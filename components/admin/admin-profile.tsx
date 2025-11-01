"use client"

import { User } from "lucide-react"

export default function AdminProfile() {
  // TODO: Get user data from auth context/state
  const user = {
    email: "admin@eleventrails.com",
    name: "Admin"
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#EE6A28] flex items-center justify-center">
        <User size={20} className="text-white" />
      </div>
      <div className="hidden sm:block">
        <p className="text-white text-sm font-medium">{user.name}</p>
        <p className="text-gray-400 text-xs">{user.email}</p>
      </div>
    </div>
  )
}

