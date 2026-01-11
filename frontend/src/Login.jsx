import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {motion} from "framer-motion"
import http from "./http"
import "./Login.css"

export default function Login(){
  let [email,setEmail]=useState("")
  let [password,setPassword]=useState("")
  let [err,setErr]=useState("")
  let nav=useNavigate()

  let submit=async e=>{
    e.preventDefault()
    try{
      let res=await http.post("/api/auth/login",{email,password})
      localStorage.setItem("token",res.data.token)
      setErr("")
      nav("/dashboard")
    }catch(e){
      setErr(e?.response?.data?.msg||"Login failed")
    }
  }

  return(
    <motion.div
      initial={{opacity:0,y:10}}
      animate={{opacity:1,y:0}}
      transition={{duration:.4}}
      className="login"
    >
      <h2>access your brain</h2>

      <form onSubmit={submit} className="loginForm">
        {err&&<div className="loginErr">{err}</div>}

        <input
          value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder="email"
          type="email"
          required
        />

        <input
          value={password}
          onChange={e=>setPassword(e.target.value)}
          placeholder="password"
          type="password"
          required
        />

        <button type="submit">enter</button>
      </form>

      <div className="logfooter">
        new here?
        <span className="loglink" onClick={()=>nav("/signup")}> create brain</span>
      </div>
    </motion.div>
  )
}
