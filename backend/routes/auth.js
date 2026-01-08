const express=require("express")
const prisma=require("../prisma")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const router=express.Router()

router.post("/register",async(req,res)=>{
  try{
    const {name,email,password}=req.body
    const hashed=await bcrypt.hash(password,10)
    const user=await prisma.user.create({data:{name,email,password:hashed}})
    res.status(201).json(user)
  }catch{
    res.status(400).json({msg:"registration failed"})
  }
})

router.post("/login",async(req,res)=>{
  const {email,password}=req.body
  const user=await prisma.user.findUnique({where:{email}})
  if(!user)return res.status(401).json({msg:"invalid"})

  const ok=await bcrypt.compare(password,user.password)
  if(!ok)return res.status(401).json({msg:"invalid"})

  const token=jwt.sign({id:user.id},process.env.JWT_SECRET)
  res.status(200).json({token})
})

module.exports=router
