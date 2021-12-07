const express = require('express')
const mongoose = require('mongoose')
const app = express();
const port = 3000;
const dbname = "todoList"

mongoose.connect(
    `mongodb://localhost:27017/todoList`,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
)

const db  = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function() {
    console.log("db connected");
})

app.use(express.json())
app.use(require("./src/routes"))

app.listen(port,()=>{
    console.log(`App started and listening on port ${port}`)
})