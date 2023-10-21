// const express = require("express")
import express from "express"
import cors from "cors"
import https from "https"
import fs from "fs"
// const bodyParser = require("body-parser")
const app = express()
const port = 4000
// const fruitRouter = require("./router/fruits")
import { router } from "./router/fruits.js"
app.disable('x-powered-by')
app.use(cors({
    origin: '*'
}))

app.use(express.json())
app.set('json spaces', 2)
app.use(express.urlencoded({ extended: true }))
app.use("/api/v1/fruits", router)


// https.createServer({
//     key: fs.readFileSync("key.pem"),
//     cert: fs.readFileSync("cert.pem"),
// }, app).listen(port, () => {
//     console.log('listening on https://localhost:4000/api/v1/fruits')
// })


app.listen(4000, () => {
    console.log('listening on http://localhost:4000/api/v1/fruits')

})
