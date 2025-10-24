'use client'

import { Badge } from '@/components/ui/badge'
import { Crown, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react'

interface SubscriptionBadgeProps {
  isLifetime: boolean
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'LIFETIME'
  className?: string
}

/**
 * Badge para exibir status da assinatura do usuário
 * 
 * @param isLifetime - Se a assinatura é vitalícia
 * @param status - Status atual da assinatura
 * @param className - Classes CSS adicionais
 */
export function SubscriptionBadge({ isLifetime, status, className }: SubscriptionBadgeProps) {
  // Assinatura Vitalícia - Badge especial com gradiente dourado
  if (isLifetime || status === 'LIFETIME') {
    return (
      <Badge 
        variant="default" 
        className={`bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-amber-400 shadow-lg shadow-amber-500/30 ${className}`}
      >
        <Crown className="w-3 h-3 mr-1" />
        Vitalícia
      </Badge>
    )
  }

  // Status Regular - Badges baseados no status
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge 
          variant="success" 
          className={`border-green-400 ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Ativa
        </Badge>
      )

    case 'PENDING':
      return (
        <Badge 
          variant="outline" 
          className={`border-yellow-500 text-yellow-600 ${className}`}
        >
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      )

    case 'EXPIRED':
      return (
        <Badge 
          variant="destructive" 
          className={`${className}`}
        >
          <XCircle className="w-3 h-3 mr-1" />
          Expirada
        </Badge>
      )

    case 'CANCELLED':
      return (
        <Badge 
          variant="secondary" 
          className={`${className}`}
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          Cancelada
        </Badge>
      )

    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      )
  }
}
