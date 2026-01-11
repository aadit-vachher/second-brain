import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./Login"
import Signup from "./Signup"
import Dashboard from "./Dashboard"
import Protected from "./Protected"

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={
          <Protected>
            <Dashboard/>
          </Protected>
        }/>
      </Routes>
    </BrowserRouter>
  )
}
