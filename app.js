const path = require("path");

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "./config.env" });
const { dbConnection } = require("./config/connect");
const ApiError = require("./utils/apiError");
const globalerrorHandler = require("./middlewares/errorMiddlewares");
//Routes
const mouteRoutes = require("./routes");

//connect to database
dbConnection();

//express app
const app = express();

//cors
app.use(cors());
app.options("*", cors());

//compression
app.use(compression());

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Moute Routes
mouteRoutes(app);

app.all("*", (req, res, next) => {
  return next(
    new ApiError(`Can't find ${req.originalUrl} on this server!`, 401)
  );
});

//global error handler
app.use(globalerrorHandler);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// rejection outside express server
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
