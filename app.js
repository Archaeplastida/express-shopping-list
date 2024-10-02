const express = require("express"), app = express(), itemRoutes = require("./itemRoutes");

app.use(express.json());

app.use("/items", itemRoutes);

app.use((error, req, res, next) => res.status(error.status).send(error.message));

module.exports = app;