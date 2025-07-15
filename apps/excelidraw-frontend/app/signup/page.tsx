"use client"
import { AuthPage } from "@/components/AuthPage";
import { usePathname } from "next/navigation";


export default function signup() {
    const pathname = usePathname()
     const isSignin = pathname === "/signin"
    return (
        <AuthPage isSignin={isSignin}></AuthPage>
    )


}