'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Search, Loader, CheckCircle2, AlertCircle, Crown, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [planInfo, setPlanInfo] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      setUser(user)
      await fetchPlanInfo()
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err)
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const fetchPlanInfo = async () => {
    try {
      // Buscar informações do plano Professional
      // Por enquanto, hardcoded
      setPlanInfo({
        id: 'f7011db9-2e21-4993-b2ba-17d0bdb0bcf6',
        name: 'Professional',
        price: '19.90',
        description: 'Extração e geração de leads rápida e consistente. Acesso completo a todas as funcionalidades.',
      })
    } catch (err) {
      console.error('Erro ao buscar plano:', err)
    }
  }

  const handlePayment = async () => {
    if (!user) return

    setProcessing(true)
    setError(null)

    try {
      // Processar pagamento
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabaseId: user.id,
          paymentMethod: 'credit_card', // Por enquanto simulado
          paymentData: {},
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      // Sucesso! Redirecionar para página de geração
      setTimeout(() => {
        router.push('/generate')
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <Loader className="h-12 w-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Logo */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer mb-8 justify-center"
          >
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Lead Generator</span>
          </motion.div>
        </Link>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Informações do Plano */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-primary" />
                <CardTitle>Professional Plan</CardTitle>
              </div>
              <CardDescription>{planInfo?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">R$ {planInfo?.price}</span>
                <span className="text-muted-foreground">/mês</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Incluído:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Busca ilimitada de leads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Exportação em CSV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Busca global (qualquer país)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Dados verificados</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle>Complete seu pagamento</CardTitle>
              <CardDescription>
                Após confirmação, você terá acesso imediato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {processing && (
                <Alert>
                  <Loader className="h-4 w-4 animate-spin" />
                  <AlertTitle>Processando...</AlertTitle>
                  <AlertDescription>
                    Aguarde enquanto processamos seu pagamento
                  </AlertDescription>
                </Alert>
              )}

              {!processing && !error && (
                <div className="p-6 bg-muted rounded-lg text-center">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Integração com gateway de pagamento será implementada aqui
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    (Stripe, Mercado Pago, PagSeguro, etc)
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader className="animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard />
                    Pagar R$ {planInfo?.price}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Pagamento seguro • Cancele quando quiser
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Link voltar */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar para página inicial
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
