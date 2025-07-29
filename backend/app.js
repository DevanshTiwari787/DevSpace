let express = require('express')
require('dotenv').config()
let app = express()
let db = require("./db")
app.use(express.json())

let userRouter = require("./routers/userRouter")

app.use("/user", userRouter);

app.listen(3000, '0.0.0.0', () => {
    console.log("Server is running on port 3000");
});