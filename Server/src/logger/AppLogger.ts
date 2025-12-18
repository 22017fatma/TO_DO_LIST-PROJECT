/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger, format, transports, Logger } from "winston";
import path from "path";
import fs from "fs";

class AppLogger {
  private static logDir: string = path.resolve(process.cwd(), "logs");
  private static loggerInstance: Logger;
  private static currentDate: string;

  private static getLogFileName(): string {
    const today = new Date().toISOString().split("T")[0];
    return path.join(AppLogger.logDir, `${today}.log`);
  }

  private static ensureLogDirExists() {
    if (!fs.existsSync(AppLogger.logDir)) {
      fs.mkdirSync(AppLogger.logDir, { recursive: true });
      console.log("Logs directory created successfully");
    }
  }

  private static updateTransportIfNeeded() {
    const today = new Date().toISOString().split("T")[0];
    if (today !== AppLogger.currentDate) {
      AppLogger.currentDate = today;
      const logFileName = AppLogger.getLogFileName();

      // Remove old transports and add a fresh one for the new day
      AppLogger.loggerInstance.clear();
      AppLogger.loggerInstance.add(
        new transports.File({ filename: logFileName })
      );

      console.log("Log file rotated to", logFileName);
    }
  }

  static initLogger() {
    AppLogger.ensureLogDirExists();
    AppLogger.currentDate = new Date().toISOString().split("T")[0];
    const logFileName = AppLogger.getLogFileName();

    AppLogger.loggerInstance = createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaString = Object.keys(meta).length
            ? JSON.stringify(meta)
            : "";
          return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}`;
        })
      ),
      transports: [new transports.File({ filename: logFileName })],
    });
  }

  private constructor() {}

  private static log(
    level: "info" | "error" | "warn",
    message: string,
    meta?: any
  ) {
    AppLogger.updateTransportIfNeeded();
    AppLogger.loggerInstance.log(level, { message, ...meta });
  }

  public static logInfo(message: string, data?: any) {
    console.log("[INFO]", message, data ?? "");
    this.log("info", message, { data });
  }

  public static logError(message: string, error?: any) {
    console.error("[ERROR]", message, error || "");
    this.log("error", message, { error: error?.stack || error });
  }

  public static logWarn(message: string, data?: any) {
    console.warn("[WARN]", message, data || "");
    this.log("warn", message, { data });
  }
}

export default AppLogger;
