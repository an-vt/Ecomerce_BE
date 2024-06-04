"use strict";

const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const { v4: uuidv4 } = require("uuid");

/*
  error: nghiem trong anh huong den hoat dong cua code
  warning: nhat ki canh bao, it anh huong can chu y de improve
  info: nhat ki thong tin thoi gian goi, input, output
  debug: duoc su dung de phat trien trong moi truong dev
  requestId or traceId: la thong tin chi tiet nhat cua 1 request, dung de theo doi request
*/

class MyLogger {
  constructor() {
    const formatPrint = format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
          metadata
        )}`;
      }
    );

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        formatPrint
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          dirname: "src/logs",
          level: "info",
          filename: "application-%DATE%.info.log",
          datePattern: "YYYY-MM-DD-HH-MM",
          zippedArchive: true, // true: backup file log
          maxSize: "20m", // dung luong toi da cua 1 file log
          maxFiles: "14d", // neu dat thi se xoa log trong vong 14 ngay
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
        }),
        new transports.DailyRotateFile({
          dirname: "src/logs",
          level: "error",
          filename: "application-%DATE%.error.log",
          datePattern: "YYYY-MM-DD-HH-MM",
          zippedArchive: true, // true: backup file log
          maxSize: "20m", // dung luong toi da cua 1 file log
          maxFiles: "14d", // neu dat thi se xoa log trong vong 14 ngay
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
        }),
      ],
    });
  }

  log(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign({ message }, paramLog);
    this.logger.info(logObject);
  }

  error(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign({ message }, paramLog);
    this.logger.error(logObject);
  }

  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId || uuidv4();
    return {
      context,
      requestId,
      metadata,
    };
  }
}

module.exports = new MyLogger();
