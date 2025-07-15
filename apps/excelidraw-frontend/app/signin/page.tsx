
"use client"
import { AuthPage } from "@/components/AuthPage";
import {  usePathname } from "next/navigation";

export default function Signin(){
   
    const pathName = usePathname()
    const isSignin = pathName === "/signin"

    return <AuthPage isSignin={isSignin}></AuthPage>
}