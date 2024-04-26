require("dotenv").config();
require("express-async-errors")
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3600;

// console.log(process.env.NODE_ENV)
connectDB();

app.use(logger);

app.use(cors(corsOptions));

//express.json() middleware
app.use(express.json());

app.use(cookieParser());
// express.static is a middleware which helping server to fetch files at '/'
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use('/notes', require('./routes/noteRoutes'))

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found!" });
  } else {
    res.type("txt".send("404 Not Found!"));
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on("err", () => {
  console.log(err);
  logEvents(
    `${err.no} : ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
