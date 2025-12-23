type LogLevel = "info" | "warn" | "error";

const log = (level: LogLevel, message: string, data?: unknown) => {
  const prefix = `[${level.toUpperCase()}]`;

  if (level === "error") {
    console.error(prefix, message, data ?? "");
    return;
  }

  if (import.meta.env.DEV) {
    console[level](prefix, message, data ?? "");
  }
};

export const logger = {
  info: (message: string, data?: unknown) => log("info", message, data),
  warn: (message: string, data?: unknown) => log("warn", message, data),
  error: (message: string, data?: unknown) => log("error", message, data),
};

