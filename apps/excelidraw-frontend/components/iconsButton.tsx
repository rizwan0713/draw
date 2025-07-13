import { ReactNode } from "react";

export function IconButton ({icon ,onClick,activated} :{
    icon:ReactNode,
    onClick : () => void,
    activated: boolean
}){
return <div className={`pointer m-2  rounded-full border p-2 bg-black hover:bg-gray-300 ${activated ? "text-red-700" : "text-white" }`} onClick={onClick}>
        {
            icon
        }
    </div>
}