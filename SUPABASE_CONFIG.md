# Configuração do Supabase

## 🔧 Configurações Necessárias

### Desabilitar Confirmação de Email

Para que o fluxo funcione corretamente sem confirmação de email, você precisa desabilitar essa opção no Supabase:

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Authentication** → **Settings** → **Email Auth**
4. **DESABILITE** a opção: `Enable email confirmations`
5. Salve as alterações

### Por que desabilitar?

- O fluxo atual leva o usuário direto para o checkout após cadastro
- Não queremos que o usuário precise confirmar email antes de pagar
- A confirmação será implementada no futuro, quando tivermos emails transacionais configurados

### Configuração Atual

```typescript
// src/components/loginForm.tsx
await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback?next=/checkout`,
    data: {
      email_confirm: false, // Desabilitar confirmação de email
    }
  },
});
```

## 📧 Emails do Supabase (Desabilitados)

Os seguintes emails do Supabase estão atualmente **desabilitados** e serão implementados no futuro:

- ❌ Email de confirmação de cadastro
- ❌ Email de recuperação de senha
- ❌ Email de mudança de email
- ❌ Email de convite (se aplicável)

## 🔮 Implementação Futura

Quando implementarmos o sistema de emails, usaremos:

### Opções de Serviço

1. **Resend** (Recomendado)
   - Simples e moderno
   - Ótima DX (Developer Experience)
   - Templates fáceis com React Email

2. **SendGrid**
   - Tradicional e robusto
   - Muitas features

3. **Amazon SES**
   - Mais barato em escala
   - Requer mais configuração

### Templates de Email Necessários

1. **Confirmação de Cadastro**
   ```
   Assunto: Confirme seu email - TheLeadsFy
   
   Olá [Nome],
   
   Bem-vindo ao TheLeadsFy!
   
   Clique no link abaixo para confirmar seu email:
   [Botão: Confirmar Email]
   
   Ou copie e cole este link no seu navegador:
   [URL]
   ```

2. **Recuperação de Senha**
   ```
   Assunto: Redefinir senha - TheLeadsFy
   
   Olá [Nome],
   
   Recebemos uma solicitação para redefinir sua senha.
   
   Clique no link abaixo para criar uma nova senha:
   [Botão: Redefinir Senha]
   
   Se você não solicitou isso, ignore este email.
   ```

3. **Assinatura Ativada**
   ```
   Assunto: Sua assinatura foi ativada! 🎉
   
   Olá [Nome],
   
   Sua assinatura Professional foi ativada com sucesso!
   
   Você já pode começar a gerar leads ilimitados.
   
   [Botão: Acessar Plataforma]
   
   Detalhes da assinatura:
   - Plano: Professional
   - Valor: R$ 19,90/mês
   - Próxima cobrança: [Data]
   ```

4. **Renovação de Assinatura**
   ```
   Assunto: Sua assinatura foi renovada
   
   Olá [Nome],
   
   Sua assinatura Professional foi renovada com sucesso!
   
   Próxima cobrança: [Data]
   Valor: R$ 19,90
   ```

5. **Assinatura Próxima do Vencimento**
   ```
   Assunto: Sua assinatura vence em 3 dias
   
   Olá [Nome],
   
   Sua assinatura Professional vence em 3 dias.
   
   Para continuar gerando leads, certifique-se de que seu
   método de pagamento está atualizado.
   
   [Botão: Ver Assinatura]
   ```

6. **Assinatura Expirada**
   ```
   Assunto: Sua assinatura expirou
   
   Olá [Nome],
   
   Sua assinatura Professional expirou.
   
   Renove agora para continuar gerando leads:
   [Botão: Renovar Assinatura]
   ```

## 🔐 Segurança

### Proteção contra Spam

Quando habilitar confirmação de email novamente:

1. Implementar rate limiting (limitar tentativas por IP)
2. Adicionar CAPTCHA no formulário de cadastro
3. Verificar domínios de email descartáveis

### Validação de Email

```typescript
// Validar formato de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Blacklist de domínios descartáveis
const disposableEmails = [
  'tempmail.com',
  '10minutemail.com',
  // ... adicionar mais
];
```

## 📝 Checklist para Ativar Emails

Quando for implementar o sistema de emails:

- [ ] Escolher serviço de email (Resend/SendGrid/SES)
- [ ] Configurar domínio e DNS (SPF, DKIM, DMARC)
- [ ] Criar templates de email com React Email
- [ ] Implementar filas de email (Bull, BullMQ)
- [ ] Testar emails em staging
- [ ] Configurar monitoramento de entregas
- [ ] Habilitar confirmação de email no Supabase
- [ ] Atualizar fluxo de cadastro no loginForm.tsx
- [ ] Adicionar retry logic para falhas
- [ ] Implementar unsubscribe (descadastro)

## 🎯 Status Atual

**Email confirmations: DESABILITADAS** ✅

Motivo: Fluxo direto cadastro → checkout sem fricção.

O usuário cria conta e vai direto para o pagamento!
