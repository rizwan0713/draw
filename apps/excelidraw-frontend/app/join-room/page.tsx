"use client";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function JoinRoom() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
     const token = localStorage.getItem("token");
    const roomId = inputRef.current?.value.trim();
    if (!roomId) {
      setError("Room ID is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post("http://localhost:8080/join", {
        roomId,

      }, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
        withCredentials: true, // ✅ Important if using cookies/session
      },
       );

      if (response.data.success) {
         router.push(`/canvas/${roomId}`);
      } else {
        setError("Failed to join room");
      }
    } catch (err: any) {
      console.error("Join room error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error joining room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-[100vw] h-[100vh] justify-center items-center">
      <label htmlFor="join-room">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter Room ID"
          className="px-4 py-2 border rounded"
        />
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Joining..." : "Join Room"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
