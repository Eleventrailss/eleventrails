"use client"

import { User } from "lucide-react"

export default function AdminProfile() {
  // TODO: Get user data from auth context/state
  const user = {
    email: "admin@eleventrails.com",
    name: "Admin"
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#EE6A28] flex items-center justify-center flex-shrink-0">
        <User size={16} className="sm:w-5 sm:h-5 text-white" />
      </div>
      <div className="hidden md:block">
        <p className="text-white text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-none">{user.name}</p>
        <p className="text-gray-400 text-[10px] sm:text-xs truncate max-w-[120px] sm:max-w-none">{user.email}</p>
      </div>
    </div>
  )
}

