import {motion} from "framer-motion"
import {useEffect,useState} from "react"
import http from "./http"
import "./Dashboard.css"

export default function Dashboard(){
  let [cards,setCards]=useState([])
  let [title,setTitle]=useState("")
  let [content,setContent]=useState("")
  let [tagInput,setTagInput]=useState({})
  let [activeTag,setActiveTag]=useState("")
  let [query,setQuery]=useState("")

  useEffect(()=>{
    let run=async()=>{
      let res=await http.get("/api/cards")
      setCards(res.data)
    }
    run()
  },[])

  let reload=async()=>{
    let res=await http.get("/api/cards")
    setCards(res.data)
    setActiveTag("")
  }

  let create=async()=>{
    if(!title&&!content)return
    await http.post("/api/cards",{title,content})
    setTitle("")
    setContent("")
    reload()
  }

  let pin=async id=>{
    await http.put("/api/cards/"+id+"/pin")
    reload()
  }

  let del=async id=>{
    await http.delete("/api/cards/"+id)
    reload()
  }

  let addTag=async id=>{
    let name=tagInput[id]
    if(!name)return
    await http.post("/api/cards/"+id+"/tags",{name})
    setTagInput({...tagInput,[id]:""})
    reload()
  }

  let filter=async name=>{
    setActiveTag(name)
    setQuery("")
    let res=await http.get("/api/cards/tag/"+name)
    setCards(res.data)
  }

  let search=async q=>{
    setQuery(q)
    setActiveTag("")
    if(!q){
      reload()
      return
    }
    let res=await http.get("/api/cards/search/"+q)
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
        <h2>your brain {activeTag&&`/ #${activeTag}`}</h2>
        <button
          className="logout"
          onClick={()=>{
            localStorage.removeItem("token")
            window.location="/login"
          }}
        >
          logout
        </button>
      </div>

      <div className="create">
        <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)}/>
        <textarea placeholder="write your thought..." value={content} onChange={e=>setContent(e.target.value)}/>
        <button onClick={create}>add</button>
      </div>

      <input
        placeholder="search your brain..."
        value={query}
        onChange={e=>search(e.target.value)}
        className="search"
      />

      <div className="grid">
        {cards.map(c=>(
          <div key={c.id} className={`card ${c.pinned?"pinned":""}`}>
            <h4>{c.title}</h4>
            <p>{c.content}</p>

            <div className="tags">
              {c.tags?.map(t=>(
                <span key={t.tag.id} onClick={()=>filter(t.tag.name)}>#{t.tag.name}</span>
              ))}
            </div>

            <input
              placeholder="add tag"
              value={tagInput[c.id]||""}
              onChange={e=>setTagInput({...tagInput,[c.id]:e.target.value})}
              className="taginp"
            />

            <div className="cardact">
              <span onClick={()=>addTag(c.id)}>add</span>
              <span onClick={()=>pin(c.id)}>{c.pinned?"unpin":"pin"}</span>
              <span onClick={()=>del(c.id)}>delete</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
