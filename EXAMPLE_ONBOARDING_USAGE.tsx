/**
 * EXEMPLO DE USO DO FLUXO DE ONBOARDING
 * 
 * Este arquivo demonstra como integrar o sistema de subscription
 * em uma página ou componente do seu app.
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient, User } from '@supabase/supabase-js'
import { useOnboarding } from '@/hooks/useOnboarding'

// Configurar Supabase client (já deve estar configurado no seu projeto)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ExampleOnboardingPage() {
  const [user, setUser] = useState<User | null>(null)
  
  // Hook de onboarding
  const { 
    loading, 
    data, 
    error, 
    hasActiveSubscription, 
    isNewUser,
    refreshProfile 
  } = useOnboarding(user)

  // Buscar usuário autenticado
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p>Erro: {error}</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Você precisa fazer login</p>
        </div>
      </div>
    )
  }

  // Success - Mostrar informações do usuário e subscription
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Mensagem de boas-vindas para novos usuários */}
      {isNewUser && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          🎉 Bem-vindo! Você ganhou 7 dias de trial gratuito!
        </div>
      )}

      {/* Card de Perfil */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Perfil</h2>
        <div className="space-y-2">
          <p><strong>ID:</strong> {data?.profile?.id}</p>
          <p><strong>Username:</strong> {data?.profile?.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>

      {/* Card de Subscription */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Assinatura</h2>
        
        {data?.profile?.subscription ? (
          <div className="space-y-3">
            <div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                hasActiveSubscription 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {hasActiveSubscription ? '✓ Ativa' : '✗ Inativa'}
              </span>
            </div>

            <p><strong>Plano:</strong> {data.profile.subscription.plan.name}</p>
            <p><strong>Preço:</strong> R$ {data.profile.subscription.plan.price}/mês</p>
            <p>
              <strong>Período:</strong>{' '}
              {new Date(data.profile.subscription.currentPeriodStart).toLocaleDateString()} até{' '}
              {new Date(data.profile.subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
            
            {/* Calcular dias restantes */}
            <p>
              <strong>Dias restantes:</strong>{' '}
              {Math.ceil(
                (new Date(data.profile.subscription.currentPeriodEnd).getTime() - Date.now()) 
                / (1000 * 60 * 60 * 24)
              )} dias
            </p>

            {!hasActiveSubscription && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
                ⚠️ Sua assinatura expirou. Renove para continuar usando o sistema.
              </div>
            )}
          </div>
        ) : (
          <p>Nenhuma assinatura encontrada</p>
        )}
      </div>
    </div>
  )
}
