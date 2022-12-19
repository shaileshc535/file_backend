var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { config } = require("dotenv");
const mongoose = require("mongoose");
// import mongoose from "mongoose";
config();
const connection = () => __awaiter(this, void 0, void 0, function* () {
    mongoose.connect(process.env.DATABASE_URI);
    const db = mongoose.connection;
    yield db
        .once("open", function () {
        console.log("We are connected to test `enter code here`database!");
    })
        .on("error", () => {
        console.error.bind(console, "connection error");
    });
    const pdfScema = () => __awaiter(this, void 0, void 0, function* () {
        yield db.dropCollection("pdfschemas", (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result) {
                console.log(result);
            }
        });
        yield db.dropCollection("file_shares", (err, result) => {
            if (err) {
                console.log(err);
                process.exit(0);
            }
            if (result) {
                console.log(result);
                process.exit(0);
            }
        });
    });
    pdfScema();
});
connection();
//# sourceMappingURL=db_clearScript.js.map