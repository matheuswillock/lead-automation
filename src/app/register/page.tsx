'use client'

import { SignupForm } from "@/components/registerForm"
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  // Verificar se usuário já está logado
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Se já está logado, redireciona para /generate
        router.push('/generate')
      }
    }

    checkAuth()
  }, [router, supabase])

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignupForm className="w-full max-w-sm" />
    </div>
  )
}
