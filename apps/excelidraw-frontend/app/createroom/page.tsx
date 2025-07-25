"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

export default function CreateRoomPage() {
  const router = useRouter();
  const [errors, setErrors] = useState("");
  const roomNameRef = useRef<HTMLInputElement>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/signin"); // immediately redirect
    } else {
      setIsCheckingAuth(false); // allow rendering
    }
  }, [router]);

  if (isCheckingAuth) {
    return null; // Don't render anything while checking
  }

  const handleCreateRoom = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // No token means redirect immediately
      router.push("/sign-in");
      return;
    }

    const roomName = roomNameRef.current?.value.trim();
    if (!roomName) {
      setErrors("Room name cannot be empty");
      return;
    }
    // console.log("token:", token);
    try {
      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        {
          roomName,
          
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Room Created:", res.data);
      const { roomId } = res.data;

      // Navigate to room page (replace with your actual route)
      router.push(`/canvas/${roomId}`);
    } catch (err: any) {
      setErrors(
        err?.response?.data?.message ||
          "Failed to create room. Try another name."
      );
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">Create a Room</h2>

        <input
          type="text"
          ref={roomNameRef}
          placeholder="Enter room name"
          className="w-full border placeholder:text-gray-300 px-3 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {errors && <p className="text-sm text-red-500">{errors}</p>}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
