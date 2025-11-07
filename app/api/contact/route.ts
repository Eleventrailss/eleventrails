import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, informationFrom, recaptchaToken } = body

    // Validasi input
    if (!name || !email || !phone || !message || !informationFrom || !recaptchaToken) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    // Get reCAPTCHA secret key from environment variable
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY

    if (!recaptchaSecret) {
      console.error('RECAPTCHA_SECRET_KEY tidak ditemukan di environment variables')
      return NextResponse.json(
        { error: 'Konfigurasi CAPTCHA tidak ditemukan' },
        { status: 500 }
      )
    }

    // Verify reCAPTCHA token
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`,
      {
        method: 'POST',
      }
    )

    const recaptchaData = await recaptchaResponse.json()

    if (!recaptchaData.success) {
      return NextResponse.json(
        { error: 'Verifikasi CAPTCHA gagal. Silakan coba lagi.' },
        { status: 400 }
      )
    }

    // Simpan ke database
    const { data, error } = await supabase
      .from('customer')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          message: message.trim(),
          information_from: informationFrom,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error inserting customer:', error)
      return NextResponse.json(
        { error: 'Gagal menyimpan data. Silakan coba lagi.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Terima kasih! Pesan Anda telah terkirim.',
        data 
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error in contact API:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}

