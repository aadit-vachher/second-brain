const express=require("express")
const prisma=require("../prisma")
const auth=require("../middleware/auth")

const router=express.Router()

router.get("/",auth,async(req,res)=>{
  const cards=await prisma.card.findMany({
    where:{userId:req.user.id},
    orderBy:[{pinned:"desc"},{createdAt:"desc"}],
    include:{
      tags:{include:{tag:true}}
    }
  })

  if(!cards){
    return res.status(200).json([])
  }

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

router.post("/:id/tags",auth,async(req,res)=>{
  const cardId=Number(req.params.id)
  const {name}=req.body

  const card=await prisma.card.findUnique({where:{id:cardId}})

  if(!card||card.userId!==req.user.id){
    return res.status(200).json([])
  }

  let tag=await prisma.tag.findFirst({
    where:{name,userId:req.user.id}
  })

  if(!tag){
    tag=await prisma.tag.create({
      data:{name,userId:req.user.id}
    })
  }

  const exists=await prisma.cardTag.findFirst({
    where:{cardId,tagId:tag.id}
  })

  if(!exists){
    await prisma.cardTag.create({
      data:{cardId,tagId:tag.id}
    })
  }

  res.sendStatus(201)
})

router.get("/tags/all",auth,async(req,res)=>{
  const tags=await prisma.tag.findMany({
    where:{userId:req.user.id}
  })

  if(!tags){
    return res.status(200).json([])
  }

  res.status(200).json(tags)
})

router.get("/tag/:name",auth,async(req,res)=>{
  const name=req.params.name

  const tag=await prisma.tag.findFirst({
    where:{name,userId:req.user.id}
  })

  if(!tag){
    return res.status(200).json([])
  }

  const links=await prisma.cardTag.findMany({
    where:{tagId:tag.id}
  })

  if(!links){
    return res.status(200).json([])
  }

  const ids=links.map(l=>l.cardId)

  const cards=await prisma.card.findMany({
    where:{
      userId:req.user.id,
      id:{in:ids}
    },
    orderBy:[{pinned:"desc"},{createdAt:"desc"}],
    include:{
      tags:{include:{tag:true}}
    }
  })

  if(!cards){
    return res.status(200).json([])
  }

  res.status(200).json(cards)
})

router.get("/search/:q",auth,async(req,res)=>{
  const q=req.params.q

  const cards=await prisma.card.findMany({
    where:{
      userId:req.user.id,
      OR:[
        {title:{contains:q,mode:"insensitive"}},
        {content:{contains:q,mode:"insensitive"}}
      ]
    },
    orderBy:[{pinned:"desc"},{createdAt:"desc"}],
    include:{
      tags:{include:{tag:true}}
    }
  })

  if(!cards){
    return res.status(200).json([])
  }

  res.status(200).json(cards)
})

module.exports=router
