const dotenv = require("dotenv");
process.on("uncaughtException", (err) => {
  console.log("Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const mongoose = require("mongoose");
dotenv.config({ path: "./.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => console.log("Db connection successfull"));

const app = require("./app");
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log("server running!");
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
