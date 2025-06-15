import { useNavigate } from "react-router-dom"

const PublicRoute = ({children}) => {
const navigate = useNavigate()
  if(localStorage.getItem("token")){
    navigate("/dashboard")
  }
  else{
        return children
  }
}

export default PublicRoute