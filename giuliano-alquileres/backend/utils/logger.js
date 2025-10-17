/**
 * Sistema de Logging Simples
 * Substitui console.log com diferentes níveis de log
 */

const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

const COLORS = {
  ERROR: "\x1b[31m", // Vermelho
  WARN: "\x1b[33m", // Amarelo
  INFO: "\x1b[36m", // Ciano
  DEBUG: "\x1b[35m", // Magenta
  RESET: "\x1b[0m",
};

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL || "INFO";
    this.isProduction = process.env.NODE_ENV === "production";
  }

  shouldLog(level) {
    const levels = ["ERROR", "WARN", "INFO", "DEBUG"];
    return levels.indexOf(level) <= levels.indexOf(this.level);
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const color = this.isProduction ? "" : COLORS[level];
    const reset = this.isProduction ? "" : COLORS.RESET;

    const metaString =
      Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";

    return `${color}[${timestamp}] [${level}]${reset} ${message}${metaString}`;
  }

  error(message, meta) {
    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      console.error(this.formatMessage(LOG_LEVELS.ERROR, message, meta));
    }
  }

  warn(message, meta) {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      console.warn(this.formatMessage(LOG_LEVELS.WARN, message, meta));
    }
  }

  info(message, meta) {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      console.log(this.formatMessage(LOG_LEVELS.INFO, message, meta));
    }
  }

  debug(message, meta) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      console.log(this.formatMessage(LOG_LEVELS.DEBUG, message, meta));
    }
  }

  // Helpers específicos
  http(method, path, statusCode, duration) {
    const message = `${method} ${path} ${statusCode} - ${duration}ms`;
    if (statusCode >= 500) {
      this.error(message);
    } else if (statusCode >= 400) {
      this.warn(message);
    } else {
      this.info(message);
    }
  }

  database(operation, duration) {
    this.debug(`DB ${operation} completed in ${duration}ms`);
  }
}

// Singleton
const logger = new Logger();

module.exports = logger;
