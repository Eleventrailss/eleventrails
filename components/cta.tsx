"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void }) => number
      reset: (widgetId: number) => void
      getResponse: (widgetId: number) => string
    }
  }
}

const AFFILIATE_STORAGE_KEY = 'eleventrailsAffiliateRef'
const AFFILIATE_COOKIE_NAME = 'affiliate'
const AFFILIATE_PREFIX = 'affiliate:'
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

const normalizeAffiliateSlug = (value: string) =>
  value.trim().replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase()

const formatAffiliateValue = (slug: string) => `${AFFILIATE_PREFIX}${slug}`
const isAffiliateValue = (value: string) => value.startsWith(AFFILIATE_PREFIX)

export default function CTA() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [recaptchaSiteKey] = useState<string | null>(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    informationFrom: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null)
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const recaptchaWidgetId = useRef<number | null>(null)
  const [affiliateRef, setAffiliateRef] = useState<string | null>(null)

  const clearAffiliateRef = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(AFFILIATE_STORAGE_KEY)
      } catch (storageError) {
        console.warn('Unable to clear affiliate in localStorage', storageError)
      }
      try {
        document.cookie = `${AFFILIATE_COOKIE_NAME}=;path=/;max-age=0;samesite=lax`
      } catch (cookieError) {
        console.warn('Unable to clear affiliate cookie', cookieError)
      }
    }
    setAffiliateRef(null)
    setFormData(prev => {
      if (prev.informationFrom && isAffiliateValue(prev.informationFrom)) {
        return { ...prev, informationFrom: '' }
      }
      return prev
    })
  }, [])

  const persistAffiliateRef = useCallback((rawValue: string | null | undefined) => {
    if (typeof window === 'undefined') return
    if (!rawValue) return

    const normalized = normalizeAffiliateSlug(rawValue)
    if (!normalized) return

    setAffiliateRef(prev => (prev === normalized ? prev : normalized))

    try {
      localStorage.setItem(AFFILIATE_STORAGE_KEY, normalized)
    } catch (storageError) {
      console.warn('Unable to persist affiliate in localStorage', storageError)
    }

    try {
      document.cookie = `${AFFILIATE_COOKIE_NAME}=${encodeURIComponent(normalized)};path=/;max-age=${COOKIE_MAX_AGE_SECONDS};samesite=lax`
    } catch (cookieError) {
      console.warn('Unable to persist affiliate in cookie', cookieError)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const affiliateFromParams = searchParams?.get('affiliate')
    if (affiliateFromParams === 'clear') {
      clearAffiliateRef()
      return
    }
    if (affiliateFromParams) {
      persistAffiliateRef(affiliateFromParams)
      return
    }

    if (affiliateRef) return

    const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${AFFILIATE_COOKIE_NAME}=([^;]*)`))
    if (cookieMatch && cookieMatch[1]) {
      persistAffiliateRef(decodeURIComponent(cookieMatch[1]))
      return
    }

    try {
      const storedAffiliate = localStorage.getItem(AFFILIATE_STORAGE_KEY)
      if (storedAffiliate) {
        persistAffiliateRef(storedAffiliate)
      }
    } catch (storageError) {
      console.warn('Unable to read affiliate from localStorage', storageError)
    }
  }, [searchParams, pathname, affiliateRef, persistAffiliateRef, clearAffiliateRef])

  useEffect(() => {
    if (affiliateRef) {
      setFormData(prev => {
        const formatted = formatAffiliateValue(affiliateRef)
        if (prev.informationFrom === formatted) {
          return prev
        }
        return { ...prev, informationFrom: formatted }
      })
      setError(prev => (prev && prev.includes('information') ? null : prev))
    } else {
      setFormData(prev => {
        if (prev.informationFrom && isAffiliateValue(prev.informationFrom)) {
          return { ...prev, informationFrom: '' }
        }
        return prev
      })
    }
  }, [affiliateRef])

  const fetchRecaptchaKey = async () => {
    // Key sudah diambil dari env variable, tidak perlu fetch dari general settings
  }

  const loadRecaptchaScript = () => {
    if (typeof window === 'undefined') return
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="recaptcha"]')
    
    if (existingScript && window.grecaptcha) {
      // Script already loaded, render directly
      if (recaptchaRef.current && recaptchaWidgetId.current === null) {
        window.grecaptcha.ready(() => {
          if (recaptchaRef.current && recaptchaWidgetId.current === null) {
            try {
              recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
                sitekey: recaptchaSiteKey!,
                callback: (token: string) => {
                  setRecaptchaToken(token)
                  setRecaptchaError(null)
                },
                'expired-callback': () => {
                  setRecaptchaToken(null)
                },
                'error-callback': () => {
                  setRecaptchaError('reCAPTCHA site key is invalid or domain is not registered. Please check the configuration in .env.local file.')
                },
              })
            } catch (error: any) {
              console.error('Error rendering reCAPTCHA:', error)
              setRecaptchaError(`Failed to load reCAPTCHA: ${error.message || 'Please ensure the site key is valid'}`)
            }
          }
        })
      }
      return
    }

    // Load script if not exists - Using v2 Checkbox API
    if (!existingScript && recaptchaSiteKey) {
      const script = document.createElement('script')
      // For reCAPTCHA v2 Checkbox, use the standard API URL
      script.src = 'https://www.google.com/recaptcha/api.js'
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.grecaptcha && recaptchaRef.current && recaptchaWidgetId.current === null) {
          window.grecaptcha.ready(() => {
            if (recaptchaRef.current && recaptchaWidgetId.current === null) {
              try {
                recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
                  sitekey: recaptchaSiteKey,
                  callback: (token: string) => {
                    setRecaptchaToken(token)
                    setRecaptchaError(null)
                  },
                  'expired-callback': () => {
                    setRecaptchaToken(null)
                  },
                  'error-callback': () => {
                    setRecaptchaError('Kunci situs reCAPTCHA tidak valid atau domain tidak terdaftar. Silakan periksa konfigurasi di General Settings.')
                  },
                })
              } catch (error: any) {
                console.error('Error rendering reCAPTCHA:', error)
                setRecaptchaError(`Failed to load reCAPTCHA: ${error.message || 'Please ensure the site key is valid'}`)
              }
            }
          })
        }
      }
      script.onerror = () => {
        setRecaptchaError('Failed to load reCAPTCHA script. Please check your internet connection.')
      }
      document.body.appendChild(script)
    }
  }

  useEffect(() => {
    // Key sudah diambil dari env, langsung load script jika ada
    if (recaptchaSiteKey && recaptchaRef.current) {
      const timer = setTimeout(() => {
        loadRecaptchaScript()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [recaptchaSiteKey])

  useEffect(() => {
    // Re-render captcha if ref is ready but widget not created
    if (recaptchaSiteKey && recaptchaRef.current && recaptchaWidgetId.current === null && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        if (recaptchaRef.current && recaptchaWidgetId.current === null) {
          try {
            recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
              sitekey: recaptchaSiteKey,
              callback: (token: string) => {
                setRecaptchaToken(token)
              },
              'expired-callback': () => {
                setRecaptchaToken(null)
              },
            })
          } catch (error) {
            console.error('Error rendering reCAPTCHA:', error)
          }
        }
      })
    }
  }, [recaptchaSiteKey])

            // Additional effect to check and render when DOM is ready
  useEffect(() => {
    const checkAndRender = () => {
      if (recaptchaSiteKey && recaptchaRef.current && recaptchaWidgetId.current === null) {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            if (recaptchaRef.current && recaptchaWidgetId.current === null) {
              try {
                recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
                  sitekey: recaptchaSiteKey,
                  callback: (token: string) => {
                    setRecaptchaToken(token)
                    setRecaptchaError(null)
                  },
                  'expired-callback': () => {
                    setRecaptchaToken(null)
                  },
                  'error-callback': () => {
                    setRecaptchaError('An error occurred with reCAPTCHA. Please refresh the page or contact administrator.')
                  },
                })
              } catch (error) {
                console.error('Error rendering reCAPTCHA:', error)
                setRecaptchaError('Failed to load reCAPTCHA. Please ensure the site key is valid or contact administrator.')
              }
            }
          })
        }
      }
    }

    // Check immediately
    checkAndRender()

    // Also check after a delay
    const timer = setTimeout(checkAndRender, 500)
    return () => clearTimeout(timer)
  }, [recaptchaSiteKey])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSelectChange = (value: string) => {
    if (affiliateRef) return
    setFormData(prev => ({ ...prev, informationFrom: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const informationFromValue = formData.informationFrom.trim()

    // Form validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message || !informationFromValue) {
      setError('All fields are required')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format')
      return
    }

    if (!recaptchaToken) {
      setError('Please verify that you are not a robot')
      return
    }

    setLoading(true)

    try {
      // Submit form to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          informationFrom: informationFromValue,
          recaptchaToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        informationFrom: affiliateRef ? formatAffiliateValue(affiliateRef) : '',
      })
      setRecaptchaToken(null)
      if (recaptchaWidgetId.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(recaptchaWidgetId.current)
      }
      setSuccess(true)
      setError(null)

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const informationFromOptions = [
    { value: 'google', label: 'Google Search' },
    { value: 'social_media', label: 'Social Media (Facebook, Instagram, TikTok)' },
    { value: 'friend', label: 'Referral from Friend/Family' },
    { value: 'advertisement', label: 'Advertisement' },
    { value: 'blog', label: 'Blog/Article' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <section className="bg-orange-500 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-[30px]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Left Column - Title */}
          <div className="flex items-center justify-center lg:w-1/2">
            <h2 
              className="text-white text-center lg:text-left"
              style={{
                fontFamily: 'Rubik One, sans-serif',
                fontSize: 'clamp(32px, 6vw, 64px)',
                fontWeight: 400,
                lineHeight: '1.2'
              }}
            >
              PLAN YOUR <span className="text-slate-950">RIDE</span>
            </h2>
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit} className="max-w-full">
              <div className="bg-white rounded p-6 sm:p-8 space-y-6 border-2 border-gray-200">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded border-2 border-gray-300 text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded border-2 border-gray-300 text-gray-900 placeholder:text-gray-400"
                    placeholder="name@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded border-2 border-gray-300 text-gray-900 placeholder:text-gray-400"
                    style={{ color: '#000000' }}
                    placeholder="081234567890"
                  />
                </div>

                {/* Information From */}
                <div>
                  <label htmlFor="informationFrom" className="block text-sm font-medium text-gray-700 mb-2">
                    How did you hear about us? *
                  </label>
                  {affiliateRef ? (
                    <div className="space-y-2">
                      <Input
                      value={affiliateRef}
                        disabled
                        readOnly
                        className="w-full rounded border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  ) : (
                    <Select value={formData.informationFrom} onValueChange={handleSelectChange}>
                      <SelectTrigger className="w-full rounded border-2 border-gray-300 text-gray-900 placeholder:text-gray-400">
                        <SelectValue placeholder="Select information source" />
                      </SelectTrigger>
                      <SelectContent>
                        {informationFromOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full min-h-[120px] rounded border-2 border-gray-300 text-gray-900 placeholder:text-gray-400"
                    style={{ color: '#000000' }}
                    placeholder="Write your message here..."
                  />
                </div>

                {/* reCAPTCHA v2 */}
                {recaptchaSiteKey ? (
                  <div className="mb-1">
                    <div className="flex justify-start">
                      <div 
                        ref={recaptchaRef} 
                        className="recaptcha-container"
                        style={{ minHeight: '78px', width: '100%' }}
                      />
                    </div>
                    {recaptchaError && (
                      <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm">
                        {recaptchaError}
                        <br />
                        <span className="text-xs">
                          Please ensure NEXT_PUBLIC_RECAPTCHA_SITE_KEY is configured correctly in the .env.local file.
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm mb-1">
                    reCAPTCHA is not configured. Please contact administrator to set up NEXT_PUBLIC_RECAPTCHA_SITE_KEY in the .env.local file.
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-1">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-1">
                    Thank you! Your message has been sent. We will contact you soon.
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3 px-6 rounded border-2 border-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-1"
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '16px'
                  }}
                  onClick={(e) => {
                    if (!recaptchaToken) {
                      e.preventDefault()
                      setError('Please verify that you are not a robot first')
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .recaptcha-container {
          min-height: 78px !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 100% !important;
        }
        .recaptcha-container > div {
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
        }
        .recaptcha-container iframe {
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          width: 100% !important;
          height: 78px !important;
        }
        .g-recaptcha {
          display: block !important;
          visibility: visible !important;
        }
        input::placeholder,
        input[type="tel"]::placeholder,
        textarea::placeholder {
          color: #9ca3af !important;
        }
        input,
        input[type="tel"],
        textarea {
          color: #000000 !important;
        }
        [data-slot="select-trigger"] {
          color: #000000 !important;
        }
        [data-slot="select-trigger"] span {
          color: #000000 !important;
        }
        [data-slot="select-trigger"][data-placeholder] span,
        [data-slot="select-value"][data-placeholder] {
          color: #9ca3af !important;
        }
      `}</style>
    </section>
  )
}
