"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { setCookie } from "@/lib/cookies"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Simple validation
      if (!email || !password) {
        setError("Email dan password harus diisi")
        setLoading(false)
        return
      }

      // Simple authentication (in production, use Supabase Auth or API)
      // For now, check against hardcoded credentials
      const adminEmail = "eleventrailss@gmail.com"
      const adminPassword = "Tokoku45@"

      if (email === adminEmail && password === adminPassword) {
        // Set cookie for session
        setCookie('admin_token', 'authenticated', 7) // 7 days
        setCookie('admin_email', email, 7)
        
        // Redirect to admin dashboard
        router.push("/admin/rides")
      } else {
        setError("Email atau password salah")
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-slate-950 w-full overflow-x-hidden max-w-full min-h-screen">
      {/* Background similar to home hero */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/hero-bg.png" 
          alt="Background" 
          className="w-full h-full opacity-60" 
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%'
          }}
        />
        <div className="absolute inset-0 bg-[#171717DE]"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-[30px] py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <a href="/" className="inline-block mb-4">
              <h1 className="font-bold text-3xl sm:text-4xl" style={{color:'#EE6A28'}}>ElevenTrails</h1>
            </a>
            <div className="inline-flex items-center justify-center mb-4 w-[132px] h-[30px] rounded-[24px] bg-orange-500/15">
              <span className="text-orange-400 text-[12px] font-semibold tracking-wider uppercase">Admin Login</span>
            </div>
            <h2 className="text-white text-2xl sm:text-3xl font-bold">Selamat Datang</h2>
            <p className="text-gray-300 text-sm mt-2">Masuk untuk mengelola konten</p>
          </div>

          {/* Login Card */}
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 sm:p-8 shadow-xl">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#EE6A28] focus:ring-2 focus:ring-[#EE6A28]/50 transition-colors"
                placeholder="admin@eleventrails.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-white text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#EE6A28] focus:ring-2 focus:ring-[#EE6A28]/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#EE6A28] hover:bg-[#d85a20] text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}
            >
              {loading ? (
                <>
                  <span>Memproses...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Kembali ke{" "}
              <a href="/" className="text-[#EE6A28] hover:text-[#d85a20] transition-colors">
                halaman utama
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
