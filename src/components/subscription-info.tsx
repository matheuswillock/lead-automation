'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SubscriptionBadge } from '@/components/subscription-badge'
import { Calendar, CreditCard, Sparkles } from 'lucide-react'

interface SubscriptionInfoProps {
  subscription: {
    id: string
    status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'LIFETIME'
    isLifetime: boolean
    currentPeriodEnd: Date | string
    createdAt?: Date | string
  }
  className?: string
}

/**
 * Card informativo sobre o status da assinatura do usuário
 * Mostra informações diferentes para assinaturas vitalícias vs regulares
 */
export function SubscriptionInfo({ subscription, className }: SubscriptionInfoProps) {
  const periodEnd = new Date(subscription.currentPeriodEnd)
  const createdAt = subscription.createdAt ? new Date(subscription.createdAt) : null
  const isLifetime = subscription.isLifetime || subscription.status === 'LIFETIME'

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Minha Assinatura</CardTitle>
            <CardDescription>
              {isLifetime 
                ? 'Você tem acesso vitalício à plataforma'
                : 'Informações sobre seu plano atual'
              }
            </CardDescription>
          </div>
          <SubscriptionBadge 
            isLifetime={subscription.isLifetime} 
            status={subscription.status} 
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Assinatura Vitalícia - Mensagem especial */}
        {isLifetime ? (
          <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Acesso Premium Vitalício
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Você é um parceiro especial da TheLeadsFy! 
                  Seu acesso nunca expira e você pode usar todas as funcionalidades sem limites.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Assinatura Regular - Informações de validade */
          <>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Válido até</p>
                <p className="text-sm text-muted-foreground">
                  {periodEnd.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {subscription.status === 'ACTIVE' && (
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Valor</p>
                  <p className="text-sm text-muted-foreground">
                    R$ 19,90/mês via PIX
                  </p>
                </div>
              </div>
            )}

            {subscription.status === 'PENDING' && (
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-4 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⏳ Sua assinatura está aguardando confirmação de pagamento.
                  Após o pagamento, você terá acesso imediato à plataforma.
                </p>
              </div>
            )}

            {subscription.status === 'EXPIRED' && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">
                  ⚠️ Sua assinatura expirou. Renove para continuar usando a plataforma.
                </p>
              </div>
            )}
          </>
        )}

        {/* Data de criação */}
        {createdAt && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Membro desde {createdAt.toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
