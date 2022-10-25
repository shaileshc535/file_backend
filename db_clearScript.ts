/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { config } = require("dotenv");
const mongoose = require("mongoose");
// import mongoose from "mongoose";

config();

const connection = async () => {
  mongoose.connect(process.env.DATABASE_URI);
  const db = mongoose.connection;

  await db
    .once("open", function () {
      console.log("We are connected to test `enter code here`database!");
    })
    .on("error", () => {
      console.error.bind(console, "connection error");
    });

  const pdfScema = async () => {
    await db.dropCollection("pdfschemas", (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        console.log(result);
      }
    });
    await db.dropCollection("file_shares", (err, result) => {
      if (err) {
        console.log(err);
        process.exit(0);
      }
      if (result) {
        console.log(result);
        process.exit(0);
      }
    });
  };

  pdfScema();
};

connection();
