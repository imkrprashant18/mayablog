import { useLocation } from "react-router-dom"


const Navabr = () => {
        const location = useLocation()
        const show = location.pathname !== "/dashboard" 
  return (
        <>
    <div>Navabr</div>
    {show &&  <div>sadjkfkadsljjfklds</div>}
   
    </>

  )
}

export default Navabr