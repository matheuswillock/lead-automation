'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Search, Loader, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        setMessage({ type: 'success', text: 'Login realizado com sucesso!' })
        
        // Redirecionar para a página de geração
        setTimeout(() => {
          router.push('/generate')
        }, 1000)
      } else {
        // Cadastro
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        setMessage({ 
          type: 'success', 
          text: 'Cadastro realizado! Verifique seu email para confirmar a conta.' 
        })
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erro ao processar autenticação' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
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

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Entrar' : 'Criar conta'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Entre com suas credenciais para acessar o sistema' 
                : 'Crie sua conta e comece com 7 dias grátis'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleAuth}>
            <CardContent className="space-y-4">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                    {message.type === 'error' ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">
                    Mínimo de 6 caracteres
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" />
                    Processando...
                  </>
                ) : isLogin ? (
                  'Entrar'
                ) : (
                  'Criar conta'
                )}
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setMessage(null)
                  }}
                  className="text-primary hover:underline"
                  disabled={loading}
                >
                  {isLogin 
                    ? 'Não tem uma conta? Cadastre-se' 
                    : 'Já tem uma conta? Entre'}
                </button>
              </div>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Voltar para a página inicial
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {!isLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            <p>🎉 Ao criar sua conta, você ganha <strong className="text-primary">7 dias grátis</strong></p>
            <p className="mt-1">Depois, apenas <strong className="text-primary">R$ 19,90/mês</strong></p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
