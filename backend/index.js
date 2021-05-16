const express = require("express")
const app = express()
const bodyParser = require("body-parser");
const config = require("./config/client")
const houndifyApi = require("./api/houndify")

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());

app.use("/api/houndify", houndifyApi)

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))