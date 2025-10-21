'use client'

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader, AlertCircle, CheckCircle2, Crown } from "lucide-react";
import { motion } from "motion/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage({ type: 'success', text: 'Login realizado com sucesso!' });
        
        // Redirecionar para a página de geração
        setTimeout(() => {
          router.push('/generate');
        }, 1000);
      } else {
        // Cadastro (sem confirmação de email)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/checkout`,
            data: {
              email_confirm: false, // Desabilitar confirmação de email
            }
          },
        });

        if (error) throw error;

        if (data.user) {
          setMessage({ 
            type: 'success', 
            text: 'Conta criada com sucesso! Redirecionando para pagamento...' 
          });
          
          // Redirecionar direto para checkout
          setTimeout(() => {
            router.push('/checkout');
          }, 1500);
        }
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erro ao processar autenticação' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erro ao fazer login com Google' 
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isLogin ? "Entrar na sua conta" : "Criar sua conta"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Digite seu email abaixo para acessar sua conta"
              : "Crie sua conta para assinar e começar a gerar leads"}
          </CardDescription>
        </CardHeader>{" "}
        <CardContent>
          <form onSubmit={handleAuth}>
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
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  {isLogin && (
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  )}
                </div>
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
                  <FieldDescription>Mínimo de 6 caracteres</FieldDescription>
                )}
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
                  ) : isLogin ? (
                    "Entrar"
                  ) : (
                    "Criar conta"
                  )}
                </Button>
                {/* TODO: Implement Google login */}
                {/* <Button
                  variant="outline"
                  type="button"
                  className="w-full cursor-pointer"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  Entrar com Google
                </Button> */}
                <FieldDescription className="text-center">
                  {isLogin ? (
                    <>
                      Não tem uma conta?{" "}
                      <a
                        href="/register"
                        className="text-primary hover:underline font-medium"
                      >
                        Cadastre-se
                      </a>
                    </>
                  ) : (
                    <>
                      Já tem uma conta?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(true);
                          setMessage(null);
                        }}
                        className="text-primary hover:underline font-medium cursor-pointer"
                        disabled={loading}
                      >
                        Entrar
                      </button>
                    </>
                  )}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {!isLogin && (
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
      )}

      <div className="text-center">
        <a
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Voltar para página inicial
        </a>
      </div>
    </div>
  );
}
