const express=require("express")
const prisma=require("../prisma")
const auth=require("../middleware/auth")

const router=express.Router()

router.get("/",auth,async(req,res)=>{
  const cards=await prisma.card.findMany({
    where:{userId:req.user.id},
    orderBy:[{pinned:"desc"},{createdAt:"desc"}]
  })
  res.status(200).json(cards)
})

router.post("/",auth,async(req,res)=>{
  const {title,content}=req.body
  const card=await prisma.card.create({
    data:{title,content,userId:req.user.id}
  })
  res.status(201).json(card)
})

router.put("/:id/pin",auth,async(req,res)=>{
  const id=Number(req.params.id)
  const card=await prisma.card.findUnique({where:{id}})
  if(!card||card.userId!==req.user.id){
    return res.sendStatus(403)
  }

  const updated=await prisma.card.update({
    where:{id},
    data:{pinned:!card.pinned}
  })
  res.status(200).json(updated)
})

router.delete("/:id",auth,async(req,res)=>{
  const id=Number(req.params.id)
  const card=await prisma.card.findUnique({where:{id}})
  if(!card||card.userId!==req.user.id){
    return res.sendStatus(403)
  }

  await prisma.card.delete({where:{id}})
  res.sendStatus(200)
})

module.exports=router
