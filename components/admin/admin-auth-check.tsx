"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/cookies"

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated()
      setIsAuth(auth)
      setIsChecking(false)

      if (!auth) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  if (isChecking) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Memuat...</div>
      </div>
    )
  }

  if (!isAuth) {
    return null
  }

  return <>{children}</>
}

