import { createServer } from "node:http";

const PORT = Number(process.env.PORT) || 3001;

/** @type {{ contentType: string; buffer: Buffer; receivedAt: number } | null} */
let latest = null;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const GEO_LOOKUP_TIMEOUT_MS = 3000;

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }

  return req.socket.remoteAddress?.replace(/^::ffff:/, "") ?? "";
}

function isPrivateOrLocalIp(ip) {
  if (!ip) {
    return true;
  }

  if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") {
    return true;
  }

  if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("169.254.")) {
    return true;
  }

  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) {
    return true;
  }

  return false;
}

async function lookupGeo(ip) {
  if (isPrivateOrLocalIp(ip)) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEO_LOOKUP_TIMEOUT_MS);

  try {
    const response = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city`,
      { signal: controller.signal },
    );
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.status !== "success") {
      return null;
    }

    return {
      city: data.city || null,
      region: data.regionName || null,
      country: data.country || null,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

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

  if (method === "GET" && url === "/health") {
    sendJson(res, 200, { ok: true });
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

  if (method === "GET" && url === "/api/geo") {
    const ip = getClientIp(req);
    const geo = await lookupGeo(ip);
    sendJson(res, 200, geo ?? { city: null, region: null, country: null });
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
