import { createLogger, transports, format } from "winston";
// import { createWriteStream } from "fs";

const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, metadata }) => {
          return `[${timestamp}] ${level}: ${message}. ${JSON.stringify(
            metadata
          )}`;
        })
      ),
    }),
    new transports.File({
      dirname: "logs",
      filename: "files_app.log",
      format: format.combine(format.json()),
    }),
  ],
  format: format.combine(format.metadata(), format.timestamp()),
});

export default logger;

// import path from "path";

// const logging = {};

// logging.log = (methodName, errMsg) => {
//   const date = new Date().toString();
//   const data = "\n=> Error in " + methodName + " >>> " + errMsg + " at " + date;
//   const milliseconds =
//     new Date().getDate() +
//     "-" +
//     // parseInt(new Date().getMonth() + 1) +
//     "-" +
//     new Date().getFullYear();
//   const jsonPath = path.join(__dirname, "logs/");
//   fs.appendFile(jsonPath + milliseconds.toString(), data, function (err) {
//     if (err) throw err;
//     console.log("Updated!");
//   });
// };

// export default logging;
