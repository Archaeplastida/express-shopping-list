const express = require("express"), app = express(), itemRoutes = require("./itemRoutes"), PORT = 3000;

app.use(express.json());

app.use("/items", itemRoutes);

app.use((error, req, res, next) => res.status(error.status).send(error.message));

app.listen(PORT, () => console.log(`App on port ${PORT}.`));