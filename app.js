require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const usersRouter = require("./routes/users");
const categoriesRouter = require("./routes/categories");
const eventsRouter = require("./routes/events");
const gpseventsRouter = require("./routes/gpsevents");

const app = express();
app.use(cors());

const fileUpload = require("express-fileupload");
app.use(fileUpload());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/categories", categoriesRouter);
app.use("/events", eventsRouter);
app.use("/gpsevents", gpseventsRouter);
module.exports = app;
