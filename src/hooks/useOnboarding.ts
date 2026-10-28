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

  const handleOnboarding = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Primeiro, verificar se o usuário já existe
      const checkResponse = await fetch('/api/onboarding')
      
      if (checkResponse.ok) {
        const existingData = await checkResponse.json()
        setData({
          ...existingData,
          isNew: false,
        })
        return
      }

      // Um perfil só pode ser criado se a API confirmou que ele não existe.
      // Qualquer outro status (por exemplo 401 ou 500) não deve tentar criar
      // um segundo perfil e mascarar a causa original.
      if (checkResponse.status !== 404) {
        throw new Error('Não foi possível verificar sua conta. Atualize a página e entre novamente.')
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
        throw new Error('Não foi possível criar sua conta. Tente entrar novamente.')
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

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    handleOnboarding()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const refreshProfile = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/onboarding`)
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
