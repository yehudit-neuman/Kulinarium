import express from "express"
import dotenv from  "dotenv"
import cors from "cors"

import { connectToDB } from "./config/db.js"
import coursRouter from "./router/course.js"
import studentRouter from "./router/student.js"
import regRouter from "./router/registration.js"


dotenv.config()
const app=express()
app.use(express.json())
connectToDB()
app.use(cors())
app.use("/api/course",coursRouter)
app.use("/api/student",studentRouter)
app.use("/api/reg",regRouter)
let port=process.env.PORT
app.listen(port,"localhost",()=>{
    console.log("app is listening on port "+port)
})