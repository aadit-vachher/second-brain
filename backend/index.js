const express=require("express")
const cors=require("cors")
require("dotenv").config()

const authRoutes=require("./routes/auth")
const cardRoutes=require("./routes/cards")

const app=express()

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
  res.status(200).send("second brain backend running")
})

app.use("/api/auth",authRoutes)
app.use("/api/cards",cardRoutes)

app.listen(process.env.PORT,()=>console.log("backend live"))
