import winston from "winston";
const { combine, timestamp, printf } = winston.format;

const customFormat = printf(({ level, message, userId, error }) => {
  let logMessage = `${new Date(
    Date.now()
  ).toISOString()} [${level}]: ${message}`;
  if (userId) {
    logMessage += ` [userId: ${userId}]`;
  }
  if (error) {
    logMessage += `\nError Message: ${error.message}`;
    if (error.stack) {
      logMessage += `\nStack Trace: ${error.stack}`;
    }
  }
  return logMessage;
});

const logger = winston.createLogger({
  format: combine(
    customFormat // Apply the custom format
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

logger.add(
  new winston.transports.File({
    filename: "info.log",
    level: "info",
    format: winston.format.combine(
      winston.format((info) => (info.level === "info" ? info : false))()
    ),
  })
);

export default logger;
