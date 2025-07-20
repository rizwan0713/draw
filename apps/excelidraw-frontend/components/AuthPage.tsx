"use client";

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";


export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {

    console.log("HELLO Bhai")
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      if (isSignin) {
        // Sign in
        console.log("STATUS")
        const res = await axios.post(`${HTTP_BACKEND}/signin`, {
          email,
          password,
        });
console.log("STATUS",res.status)
           const token = res.data.token;
      if (token) {
        // Save token to localStorage
        localStorage.setItem("token", token);
        console.log("Sign in success:", res.data);

        // Redirect to dashboard or home
        router.push("join-room");
      } else {
        // Sign up
        console.log("HELLO Bhai rizu")
        const res = await axios.post(`${HTTP_BACKEND}/signup`, {
          username,
          email,
          password,
        });
        console.log("Sign up success:", res.data);

        // Redirect to sign-in after successful registration
        router.push("/signin");
      }
    } else{
      console.log("SIGN UP")
      console.log(username, email, password)
       const res = await axios.post(`${HTTP_BACKEND}/signup`, {
          username,
          email,
          password,
        });
        console.log(res.data)
         router.push("/signin");

    }
    }
    catch (error) {
      console.error("Auth error:", error);
      alert("Authentication failed. Please check your credentials.");
  };
}
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white px-4">
      <div className="flex flex-col gap-4 p-6 w-full max-w-sm bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-black">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>



   {
    !isSignin  && (  
    <>
    <label
            htmlFor="username"
            className="flex flex-col gap-1 text-black"
          >
            Username
          </label>
          <input
            ref={usernameRef}
            type="text"
            id="username"
            placeholder="Choose a username"
            className="border text-black border-gray-300 placeholder:text-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

          />
    </>
    )
   }

        <label htmlFor="email" className="flex flex-col gap-1 text-black">
          Email
          <input
          ref={emailRef}
            type="text"
            placeholder="Enter your email"
            id="email"
            className="border text-black border-gray-300 placeholder:text-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label htmlFor="password" className="flex flex-col gap-1 text-black">
          Password
          <input
           ref={passwordRef}
            type="password"
            placeholder="Enter your password"
            id="password"
            className="border text-black border-gray-300 placeholder:text-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

         
    
       

        <button
          className="bg-blue-600 mt-2 text-white py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          {isSignin ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </div>
  )
  }
