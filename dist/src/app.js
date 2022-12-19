"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const method_override_1 = __importDefault(require("method-override"));
const dotenv_1 = require("dotenv");
const connection_1 = __importDefault(require("./config/connection"));
const index_1 = __importDefault(require("./routes/index"));
const logger_1 = __importDefault(require("./logger"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(Logger());
app.use((0, cors_1.default)());
// Enable pre-flight
app.options("*", (0, cors_1.default)());
app.use((0, compression_1.default)());
app.use((0, method_override_1.default)("X-HTTP-Method-Override"));
//DATABASE CONNECTION
app.use(connection_1.default);
app.use("/public", express_1.default.static("./public"));
//View Engine
// app.set("views", path.join(__dirname, "/views"));
// app.set("view engine", "ejs");
//ROUTES
app.use("/", index_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    return logger_1.default.info(`Server is listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map