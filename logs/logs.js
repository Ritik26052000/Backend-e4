const winston = require("winston");
const { combine, printf, timestamp, label, json } = winston.format;
require("winston-mongodb");
require("dotenv").config();

const db_url = process.env.MONGODB_URL;

const myformat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    label({ label: "right meow!" }),
    timestamp(),
    myformat,
    json()
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log", level: "info" }),
    new winston.transports.File({ filename: "test.log", level: "warn" }),
    new winston.transports.File({ filename: "success.log", level: "info" }),
    new winston.transports.MongoDB({ db: db_url }),
  ],
});

module.exports = logger;
