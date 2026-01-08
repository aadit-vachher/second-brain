const express=require("express")
const prisma=require("../prisma")
const auth=require("../middleware/auth")

const router=express.Router()

router.get("/",auth,async(req,res)=>{
  const cards=await prisma.card.findMany({where:{userId:req.user.id}})
  res.status(200).json(cards)
})

router.post("/",auth,async(req,res)=>{
  const {title,content}=req.body
  const card=await prisma.card.create({data:{title,content,userId:req.user.id}})
  res.status(201).json(card)
})

module.exports=router
