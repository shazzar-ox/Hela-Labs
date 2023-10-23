import express from "express"
import cors from "cors"
import https from "https"
const app = express()
const port = process.env.PORT || 3000
import { router } from "./router/fruits.js"
app.disable('x-powered-by')
app.use(cors({
    origin: '*'
}))

app.use(express.json())
app.set('json spaces', 2)
app.use(express.urlencoded({ extended: true }))
app.use("/api/v1/fruits", router)



app.listen(port, () => {
    console.log('listening on http://localhost:4000/api/v1/fruits')

})
