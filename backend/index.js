import express from "express"
import cors from "cors"

let app=express()
app.use(cors())
app.use(express.json())
app.get("/",(req,res)=>{
  res.send("backend running")
})

app.listen(3000,()=>console.log("backend live"))
