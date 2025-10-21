'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Loader, CheckCircle2, AlertCircle, Crown, CreditCard, QrCode } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'
import QRCodeLib from 'qrcode'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [planInfo, setPlanInfo] = useState<any>(null)
  const [billing, setBilling] = useState<any>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerCPF, setCustomerCPF] = useState('')
  const [showPixQRCode, setShowPixQRCode] = useState(false)

  // Função para aplicar máscara de telefone
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    } else {
      // Limita a 11 dígitos
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  // Função para aplicar máscara de CPF
  const formatCPF = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara 123.456.789-01
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    } else {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setCustomerPhone(formatted)
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCustomerCPF(formatted)
  }

  const getPhoneNumbers = (phone: string) => {
    // Remove formatação e retorna apenas números
    return phone.replace(/\D/g, '')
  }

  const getCPFNumbers = (cpf: string) => {
    // Remove formatação e retorna apenas números
    return cpf.replace(/\D/g, '')
  }

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
      setCustomerName(user.user_metadata?.full_name || user.email?.split('@')[0] || '')
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

  // Gerar QR Code no Canvas quando billing estiver disponível
  useEffect(() => {
    if (billing?.brCode && qrCanvasRef.current && showPixQRCode) {
      QRCodeLib.toCanvas(
        qrCanvasRef.current,
        billing.brCode, // CORRIGIDO: usar brCode (string PIX)
        {
          width: 256,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) {
            console.error("Erro ao gerar QR Code:", error);
          }
        }
      );
    }
  }, [billing, showPixQRCode])

  const handlePayment = async () => {
    if (!user) return
    
    if (!customerName.trim()) {
      setError('Por favor, preencha seu nome')
      return
    }

    if (!customerPhone.trim()) {
      setError('Por favor, preencha seu telefone')
      return
    }

    if (!customerCPF.trim()) {
      setError('Por favor, preencha seu CPF')
      return
    }

    const cpfNumbers = getCPFNumbers(customerCPF)
    if (cpfNumbers.length !== 11) {
      setError('CPF inválido. Digite 11 dígitos')
      return
    }

    const phoneNumbers = getPhoneNumbers(customerPhone)
    if (phoneNumbers.length < 10) {
      setError('Telefone inválido')
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Criar cobrança PIX via AbacatePay
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabaseId: user.id,
          customer: {
            name: customerName,
            email: user.email,
            cellphone: phoneNumbers,
            taxId: cpfNumbers,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar cobrança PIX')
      }

      // Mostrar QR Code PIX
      setBilling(data.billing)
      setShowPixQRCode(true)

      // Iniciar polling para verificar pagamento
      startPaymentPolling(data.billing.id)

    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento')
      setProcessing(false)
    }
  }

  const startPaymentPolling = (billingId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payment?billingId=${billingId}`)
        const data = await response.json()

        if (data.isPaid) {
          clearInterval(interval)
          setProcessing(false)
          
          // Redirecionar para página de geração
          setTimeout(() => {
            router.push('/generate')
          }, 2000)
        }
      } catch (err) {
        console.error('Erro ao verificar pagamento:', err)
      }
    }, 3000) // Verificar a cada 3 segundos

    // Limpar após 10 minutos
    setTimeout(() => {
      clearInterval(interval)
      setProcessing(false)
      setError('Tempo esgotado. Por favor, tente novamente.')
    }, 600000)
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
              <CardTitle>Pagar com PIX</CardTitle>
              <CardDescription>Pagamento instantâneo e seguro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {showPixQRCode && billing ? (
                <div className="space-y-4">
                  <Alert>
                    <Loader className="h-4 w-4 animate-spin" />
                    <AlertTitle>Aguardando pagamento</AlertTitle>
                    <AlertDescription>
                      Escaneie o QR Code com o app do seu banco
                    </AlertDescription>
                  </Alert>

                  {/* QR Code PIX com Canvas */}
                  <div className="flex flex-col items-center gap-4 p-4 bg-muted rounded-lg">
                    <canvas ref={qrCanvasRef} className="rounded-lg" />

                    <div className="w-full">
                      <p className="text-xs text-muted-foreground mb-2">
                        Ou copie o código PIX:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={billing.brCode || ''} 
                          readOnly
                          className="flex-1 px-3 py-2 text-xs bg-background border rounded"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            if (billing.brCode) {
                              navigator.clipboard.writeText(billing.brCode);
                            }
                          }}
                        >
                          Copiar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="João Silva"
                      className="w-full px-3 py-2 bg-background border rounded"
                      disabled={processing}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={handlePhoneChange}
                      placeholder="(11) 98765-4321"
                      className="w-full px-3 py-2 bg-background border rounded"
                      disabled={processing}
                      maxLength={15}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CPF *
                    </label>
                    <input
                      type="text"
                      value={customerCPF}
                      onChange={handleCPFChange}
                      placeholder="123.456.789-01"
                      className="w-full px-3 py-2 bg-background border rounded"
                      disabled={processing}
                      maxLength={14}
                      required
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">Pagamento PIX</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Aprovação instantânea</li>
                      <li>• Acesso imediato à plataforma</li>
                      <li>• Seguro e criptografado</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {!showPixQRCode && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={
                    processing ||
                    !customerName.trim() ||
                    !customerPhone.trim() ||
                    !customerCPF.trim()
                  }
                >
                  {processing ? (
                    <>
                      <Loader className="animate-spin" />
                      Gerando PIX...
                    </>
                  ) : (
                    <>
                      <CreditCard />
                      Gerar QR Code PIX - R$ {planInfo?.price}
                    </>
                  )}
                </Button>
              )}

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
  );
}
