import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";



async function getRoomId(slug:string){
    console.log("idhar hun mein")
     const response = await  axios.get(`${BACKEND_URL}/room/${slug}`)
        console.log("dekh idhar")

     console.log(response.data);
     return response.data.room
}



export default async function ChatRoom1 ({params} :{ params : {slug:string}}){
    const slug = (await params).slug;
    console.log("this is slug",slug);
    const roomId = await  getRoomId(slug);
    console.log("roomID",roomId)
    return <ChatRoom id={roomId}></ChatRoom>
}