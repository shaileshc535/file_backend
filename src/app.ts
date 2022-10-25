import compression from "compression";
import express from "express";
import cors from "cors";
import methodOverride from "method-override";
import { config } from "dotenv";
import getConnection from "./config/connection";
import Router from "./routes/index";
import logger from "./logger";

config();

logger.info("information log");
logger.warn("warning log");
logger.error("error log");
logger.debug("debug log");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(Logger());
app.use(cors());
// Enable pre-flight
app.options("*", cors());
app.use(compression());
app.use(methodOverride("X-HTTP-Method-Override"));

//DATABASE CONNECTION
app.use(getConnection);
app.use("/public", express.static("./public"));
//View Engine
// app.set("views", path.join(__dirname, "/views"));
// app.set("view engine", "ejs");

//ROUTES

app.use("/", Router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  return console.log(`Server is listening at http://localhost:${PORT}`);
});
