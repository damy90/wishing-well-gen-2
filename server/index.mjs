import { createServer } from "node:http";

const PORT = Number(process.env.PORT) || 3001;

/** @type {{ contentType: string; buffer: Buffer; receivedAt: number } | null} */
let latest = null;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    ...CORS_HEADERS,
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(body));
}

function sendNoContent(res) {
  res.writeHead(204, CORS_HEADERS);
  res.end();
}

const server = createServer(async (req, res) => {
  const { method, url } = req;

  if (method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  if (method === "POST" && url === "/api/receive") {
    try {
      const buffer = await readBody(req);
      const contentType =
        req.headers["content-type"]?.trim() || "application/octet-stream";
      latest = { contentType, buffer, receivedAt: Date.now() };
      sendJson(res, 200, { ok: true, receivedAt: latest.receivedAt });
    } catch {
      sendJson(res, 500, { error: "Failed to read body" });
    }
    return;
  }

  if (method === "GET" && url?.startsWith("/api/receive/latest")) {
    const parsed = new URL(url, "http://localhost");
    const after = Number(parsed.searchParams.get("after") || "0");

    if (!latest || latest.receivedAt <= after) {
      sendNoContent(res);
      return;
    }

    sendJson(res, 200, {
      contentType: latest.contentType,
      data: latest.buffer.toString("base64"),
      receivedAt: latest.receivedAt,
    });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Receive API listening on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to a free port.`);
    console.error(`  lsof -i :${PORT}   # find PID, then: kill <PID>`);
    process.exit(1);
  }
  throw err;
});
