import { STATUS_SHARE_FAILED } from "../constants";

interface FbInstantError {
  code?: string;
  message?: string;
}

function isFbInstantError(error: unknown): error is FbInstantError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("code" in error || "message" in error)
  );
}

export function formatShareErrorMessage(error: unknown): string {
  if (!isFbInstantError(error)) {
    return STATUS_SHARE_FAILED;
  }

  const details = [error.code, error.message].filter(Boolean).join(": ");
  return details ? `${STATUS_SHARE_FAILED} (${details})` : STATUS_SHARE_FAILED;
}
