import {motion} from "framer-motion"
import {useEffect,useState} from "react"
import http from "./http"
import "./dashboard.css"

export default function Dashboard(){
  let [cards,setCards]=useState([])
  let [title,setTitle]=useState("")
  let [content,setContent]=useState("")

  useEffect(()=>{
    let run=async()=>{
      let res=await http.get("/api/cards")
      setCards(res.data)
    }
    run()
  },[])

  let create=async()=>{
    if(!title&&!content)return
    await http.post("/api/cards",{title,content})
    setTitle("")
    setContent("")
    let res=await http.get("/api/cards")
    setCards(res.data)
  }

  let pin=async id=>{
    await http.put("/api/cards/"+id+"/pin")
    let res=await http.get("/api/cards")
    setCards(res.data)
  }

  let del=async id=>{
    await http.delete("/api/cards/"+id)
    let res=await http.get("/api/cards")
    setCards(res.data)
  }

  return(
    <motion.div
      initial={{opacity:0,y:10}}
      animate={{opacity:1,y:0}}
      transition={{duration:.4}}
      className="dash"
    >
      <div className="dashhead">
        <h2>your brain</h2>
      </div>

      <div className="create">
        <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)}/>
        <textarea placeholder="write your thought..." value={content} onChange={e=>setContent(e.target.value)}/>
        <button onClick={create}>add</button>
      </div>

      <div className="grid">
        {cards.map(c=>(
          <div key={c.id} className={`card ${c.pinned?"pinned":""}`}>
            <h4>{c.title}</h4>
            <p>{c.content}</p>
            <div className="cardact">
              <span onClick={()=>pin(c.id)}>{c.pinned?"unpin":"pin"}</span>
              <span onClick={()=>del(c.id)}>delete</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
