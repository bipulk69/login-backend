const express = require("express");
const routes = require("./config/routes");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(bodyParser.json());

app.use("/api", routes);

app.listen(3000, () => {
  console.log("Server is running up on port 3000");
});
