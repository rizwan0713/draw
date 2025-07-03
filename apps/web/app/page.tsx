'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function Home() {
  const [roomId,setRoomId] = useState("")
   const router = useRouter()
  return (
 <div  style ={{
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  backgroundColor:"black ",
  height:"100vh",
  width:"100vw"
 }}>
     <div>
      <input type="text" placeholder="Room Id"  value={roomId} 
      style={{
        padding:"20px",
        
      }}
         onChange={ (e) => {
          setRoomId(e.target.value);
          
         }}/>
     <button onClick={ (e) => {
      router.push(`/room/${roomId}`)
     }}
       style={{
        padding:"20px",
        
      }}
     >
      Join Room
     </button>

     </div>
 </div>
  );
}
