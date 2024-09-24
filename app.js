const express = require("express"), app = express(), itemRoutes = require("./itemRoutes"), port = 3000;

app.use(express.json());
app.use("/items", itemRoutes);

app.listen(port, () => console.log(`App on port ${port}.`));