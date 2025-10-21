'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader, AlertCircle, CheckCircle2, Crown } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function SignupForm({ 
  className,
  ...props 
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const supabase = createClient()
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Validar senhas
      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem')
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter no mínimo 6 caracteres')
      }

      // Criar conta
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/checkout`,
          data: {
            full_name: name,
            email_confirm: false, // Desabilitar confirmação de email
          }
        },
      })

      if (error) throw error

      if (data.user) {
        // Criar perfil no banco de dados imediatamente
        const onboardingResponse = await fetch('/api/onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            supabaseId: data.user.id,
            email: data.user.email,
            username: name,
          }),
        })

        if (!onboardingResponse.ok) {
          throw new Error('Erro ao criar perfil')
        }

        setMessage({ 
          type: 'success', 
          text: 'Conta criada com sucesso! Redirecionando para pagamento...' 
        })
        
        // Redirecionar direto para checkout
        setTimeout(() => {
          router.push('/checkout')
        }, 1500)
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erro ao criar conta' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/checkout`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erro ao fazer cadastro com Google' 
      })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Criar sua conta</CardTitle>
          <CardDescription>
            Preencha suas informações abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <FieldGroup>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert
                    variant={
                      message.type === "error" ? "destructive" : "default"
                    }
                  >
                    {message.type === "error" ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Field>
                <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <FieldDescription>
                  Usaremos este email para entrar em contato com você.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
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
                <FieldDescription>
                  Deve ter no mínimo 6 caracteres.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirmar Senha
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
                <FieldDescription>Digite sua senha novamente.</FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Criar Conta"
                  )}
                </Button>

                  {/* TODO: Implement Google signup */}
                {/* <Button
                  variant="outline"
                  type="button"
                  className="w-full cursor-pointer"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                >
                  Cadastrar com Google
                </Button> */}

                <FieldDescription className="text-center">
                  Já tem uma conta?{" "}
                  <a
                    href="/auth"
                    className="text-primary hover:underline font-medium"
                  >
                    Entrar
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-muted-foreground"
      >
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-4 w-4 text-primary" />
          <p>
            Apenas <strong className="text-primary">R$ 19,90/mês</strong>
          </p>
        </div>
        <p className="mt-1 text-xs">
          Geração ilimitada de leads • Cancele quando quiser
        </p>
      </motion.div>

      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Voltar para página inicial
        </Link>
      </div>
    </div>
  );
}
