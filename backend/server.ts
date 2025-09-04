import express from "express"
import dotenv from "dotenv"
dotenv.config ()
import cors from "cors"

const app = express ()
const PORT = process.env.PORT

app.use (cors())

app.get("/", (req, res)=>{
    res.send ("Hi Backend")
})

app.listen(PORT, ()=>{
    console.log (`Server started at http://localhost:${PORT}`)
})