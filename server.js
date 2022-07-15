const express = require("express");
const app = express();
const cors=require('cors');
app.use(express.json());
app.use(cors());
const { port } = require("./config/index");
require("./app/utils/mongoose");

app.use("/api", require("./app/routes/Ragistration.route"));

// const Port=9999;
app.listen(port, console.log(`Server is runing ${port}`));
// console.log({port})
