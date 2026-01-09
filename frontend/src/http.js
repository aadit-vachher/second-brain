import axios from "axios"
let http=axios.create({
  baseURL:import.meta.env.VITE_API_URL
})
http.interceptors.request.use(i=>{
  let token=localStorage.getItem("token")
  if(token)i.headers.Authorization=token
  return i
})

export default http
