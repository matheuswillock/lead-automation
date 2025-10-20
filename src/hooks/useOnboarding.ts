'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'

interface OnboardingData {
  profile: any
  subscription: any
  subscriptionActive: boolean
  isNew: boolean
}

export function useOnboarding(user: User | null) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<OnboardingData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    handleOnboarding()
  }, [user])

  const handleOnboarding = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Primeiro, verificar se o usuário já existe
      const checkResponse = await fetch(`/api/onboarding?supabaseId=${user.id}`)
      
      if (checkResponse.ok) {
        const existingData = await checkResponse.json()
        setData({
          ...existingData,
          isNew: false,
        })
        return
      }

      // Se não existir, criar novo usuário
      const createResponse = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabaseId: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.email?.split('@')[0],
          avatarUrl: user.user_metadata?.avatar_url,
        }),
      })

      if (!createResponse.ok) {
        throw new Error('Erro ao criar usuário')
      }

      const newData = await createResponse.json()
      setData(newData)

    } catch (err: any) {
      console.error('Erro no onboarding:', err)
      setError(err.message || 'Erro ao processar onboarding')
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/onboarding?supabaseId=${user.id}`)
      if (response.ok) {
        const updatedData = await response.json()
        setData({
          ...updatedData,
          isNew: false,
        })
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err)
    }
  }

  return {
    loading,
    data,
    error,
    refreshProfile,
    hasActiveSubscription: data?.subscriptionActive || false,
    isNewUser: data?.isNew || false,
  }
}
