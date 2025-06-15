import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import useAuthStore from "../store/user-auth";




const ProtecterRoute = ({children})=>{
        const navigate = useNavigate()
        const {user,fetchCurrentUser}= useAuthStore()

        useEffect(()=>{
                if(!user){
                        fetchCurrentUser()
                }
        },[user, fetchCurrentUser])
        if(localStorage.getItem("token")){
                return children
        }       
        else{
                navigate("/login")
        }

}


export default ProtecterRoute;