import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {motion} from "framer-motion"
import http from "./http"
import "./login.css"

export default function Signup(){
  let [name,setName]=useState("")
  let [email,setEmail]=useState("")
  let [password,setPassword]=useState("")
  let [err,setErr]=useState("")
  let nav=useNavigate()

  let submit=async e=>{
    e.preventDefault()
    try{
      await http.post("/api/auth/register",{name,email,password})
      nav("/")
    }catch{
      setErr("account already exists")
    }
  }

  return(
    <motion.div
      initial={{opacity:0,y:10}}
      animate={{opacity:1,y:0}}
      transition={{duration:.4}}
      className="login"
    >
      <h2>create your brain</h2>

      <form onSubmit={submit} className="loginForm">
        {err&&<div className="loginErr">{err}</div>}

        <input placeholder="name" value={name} onChange={e=>setName(e.target.value)}/>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <button type="submit">create</button>
      </form>
    </motion.div>
  )
}
