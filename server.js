const express = require("express");
const app = express();

const PORT = process.env.PORT || 8000;

//dotenv configuration:
const dotenv = require("dotenv");
dotenv.config();

//connection database:
const connectDb = require("./db/config");
connectDb();

//middlewares:
app.use(express.json());

app.use("/api/v1/user", require("./route/userRoutes"));
app.use("/api/v1/admin", require("./route/adminRoutes"));

app.get("/", (req, res) => {
  res.send("<h1>hello</h1>");
});
app.listen(process.env.PORT, () => {
  console.log("server is listening");
});
