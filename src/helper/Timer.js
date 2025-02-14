import React from 'react'
import Countdown from "react-countdown"
const Timer = ({time,setisExpire}) => {


  
  return (
    <div>
        <Countdown onComplete={()=>setisExpire(true)} date={Date.now() + time}/>
    </div>
  )
}

export default Timer