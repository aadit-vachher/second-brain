import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./Login"
import Signup from "./Signup"

function Dashboard(){
  return <div style={{padding:20}}>dashboard</div>
}

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}
