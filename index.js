require("dotenv").config();
require("./Config/db");
const express = require("express");
const userRouter = require("./Router/userRouter");

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use("/api", userRouter);

app.listen(port, () => {
  console.log(`server is listen on port http://localhost:${port}`);
});
