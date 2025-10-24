# Fluxo de Assinatura - TheLeadsFy

## 📋 Visão Geral

Sistema de assinatura paga direta, sem trial gratuito. O usuário deve pagar R$ 19,90/mês para ter acesso à plataforma.

## 💰 Plano Disponível

**Professional Plan**
- ID: `f7011db9-2e21-4993-b2ba-17d0bdb0bcf6`
- Nome: `Professional`
- Preço: `R$ 19,90/mês`
- Descrição: "Extração e geração de leads rápida e consistente. Acesso completo a todas as funcionalidades."

## 🔄 Fluxo Completo de Assinatura

### 1. Landing Page → Cadastro
```
Usuário na landing page (/)
  ↓
Clica em "Assinar Agora" ou "Começar Agora"
  ↓
Redireciona para /auth (página de login/cadastro)
```

### 2. Criação de Conta
```
Usuário em /auth
  ↓
Escolhe "Create your account" (signup)
  ↓
Preenche email e senha (mínimo 6 caracteres)
  ↓
Supabase Auth cria conta
  ↓
Email de confirmação enviado
  ↓
Usuário clica no link do email
  ↓
/auth/callback?next=/checkout
  ↓
Redireciona para /checkout
```

### 3. Onboarding Automático
```
Usuário confirmado acessa /checkout
  ↓
Sistema detecta usuário autenticado
  ↓
useOnboarding hook é acionado
  ↓
POST /api/onboarding
  ↓
ProfileService.createProfile()
  ↓
SubscriptionService.createPendingSubscription()
  ↓
Subscription criada com status: PENDING
  ↓
currentPeriodEnd: +30 dias (a partir do pagamento)
```

### 4. Página de Checkout
```
Usuário em /checkout
  ↓
Vê informações do plano Professional
  ↓
Vê card de pagamento
  ↓
Clica em "Pagar R$ 19,90"
  ↓
POST /api/payment
  ↓
[Aqui virá integração com gateway]
  ↓
SubscriptionService.activateSubscription()
  ↓
Subscription atualizada: status = ACTIVE
  ↓
Redireciona para /generate
```

### 5. Uso da Plataforma
```
Usuário em /generate
  ↓
useOnboarding verifica subscription
  ↓
Se status = ACTIVE:
  ✅ Pode gerar leads normalmente
  ✅ Botão "Gerar Leads" habilitado
  ✅ Alert verde: "Assinatura ativa"
  
Se status = PENDING:
  ⚠️ Redireciona automaticamente para /checkout
  
Se status = EXPIRED ou CANCELLED:
  ❌ Botão "Gerar Leads" desabilitado
  ❌ Alert vermelho: "Assinatura expirada"
  ❌ Botão "Renovar agora"
```

## 📊 Estados da Subscription

### PENDING (Aguardando Pagamento)
- **Quando:** Criada após cadastro, antes do pagamento
- **Usuário pode:** Apenas acessar checkout
- **Ação:** Redireciona para /checkout automaticamente

### ACTIVE (Assinatura Ativa)
- **Quando:** Após pagamento aprovado
- **Usuário pode:** Gerar leads ilimitadamente
- **Duração:** 30 dias (renovável)

### EXPIRED (Assinatura Expirada)
- **Quando:** currentPeriodEnd < now
- **Usuário pode:** Ver a plataforma mas não gerar leads
- **Ação:** Precisa renovar para reativar

### CANCELLED (Assinatura Cancelada)
- **Quando:** Usuário cancela manualmente
- **Usuário pode:** Ver a plataforma mas não gerar leads
- **Ação:** Precisa reativar assinatura

## 🎨 Experiência do Usuário (UI/UX)

### Landing Page
- ✅ Botão "Assinar Agora" no card de preço
- ✅ Preço destacado: R$ 19,90/mês
- ✅ Features listadas com checkmarks
- ✅ "Sem contratos • Cancele quando quiser"

### Página de Auth (/auth)
- ✅ Toggle Login/Signup
- ✅ No signup: "Only R$ 19,90/month"
- ✅ "Unlimited lead generation • Cancel anytime"
- ✅ Após signup: mensagem para confirmar email

### Página de Checkout (/checkout)
- ✅ Duas colunas (plano + pagamento)
- ✅ Card do plano: descrição completa + features
- ✅ Card de pagamento: placeholder para gateway
- ✅ Botão "Pagar R$ 19,90"
- ✅ Loading states durante processamento
- ✅ Após pagamento: redireciona para /generate

### Página de Geração (/generate)
- ✅ Verifica subscription ao carregar
- ✅ Se PENDING: redireciona para /checkout
- ✅ Se ACTIVE: mostra alert verde com data de expiração
- ✅ Se EXPIRED/CANCELLED: alert vermelho + botão renovar
- ✅ Botão "Gerar Leads" só funciona com ACTIVE

## 🔧 APIs Criadas

### POST /api/onboarding
**Cria perfil + subscription PENDING**

Request:
```json
{
  "supabaseId": "uuid",
  "email": "user@example.com",
  "username": "user",
  "avatarUrl": "https://..."
}
```

Response:
```json
{
  "profile": {...},
  "subscription": {
    "status": "PENDING",
    "currentPeriodStart": "2025-10-20T...",
    "currentPeriodEnd": "2025-11-19T..."
  },
  "isNew": true,
  "needsPayment": true,
  "message": "Complete o pagamento para ativar sua assinatura."
}
```

### POST /api/payment
**Processa pagamento e ativa subscription**

Request:
```json
{
  "supabaseId": "uuid",
  "paymentMethod": "credit_card",
  "paymentData": {...}
}
```

Response:
```json
{
  "success": true,
  "subscription": {
    "status": "ACTIVE",
    "currentPeriodStart": "2025-10-20T...",
    "currentPeriodEnd": "2025-11-19T..."
  },
  "message": "Pagamento processado e assinatura ativada!"
}
```

### GET /api/payment?supabaseId={id}
**Verifica status do pagamento**

Response:
```json
{
  "subscription": {...},
  "needsPayment": true/false,
  "isActive": true/false
}
```

## 🔌 Próximos Passos (Integração de Pagamento)

### Opções de Gateway

1. **Stripe** (Internacional)
   - Cartão de crédito/débito
   - Renovação automática
   - Webhooks para confirmação

2. **Mercado Pago** (Brasil)
   - PIX, Boleto, Cartão
   - Renovação automática
   - Webhooks para confirmação

3. **PagSeguro** (Brasil)
   - PIX, Boleto, Cartão
   - Renovação automática
   - Webhooks para confirmação

### Implementação Sugerida (Stripe)

```typescript
// src/app/api/payment/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  // ... verificações anteriores
  
  // Criar checkout session do Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: 'price_xxxxx', // ID do preço R$ 19,90 no Stripe
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${request.nextUrl.origin}/generate?success=true`,
    cancel_url: `${request.nextUrl.origin}/checkout?canceled=true`,
    customer_email: user.email,
    metadata: {
      supabaseId: user.id,
      profileId: profile.id,
    },
  })

  return NextResponse.json({ sessionUrl: session.url })
}
```

### Webhook do Stripe

```typescript
// src/app/api/webhooks/stripe/route.ts
export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')!
  const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { supabaseId, profileId } = session.metadata

    // Ativar subscription
    await SubscriptionService.activateSubscription(profileId)
  }

  if (event.type === 'invoice.payment_succeeded') {
    // Renovar subscription (pagamento mensal)
    await SubscriptionService.renewSubscription(profileId)
  }

  return NextResponse.json({ received: true })
}
```

## 📈 Melhorias Futuras

- [ ] Dashboard de subscription management
- [ ] Histórico de pagamentos
- [ ] Notas fiscais automáticas
- [ ] Cupons de desconto
- [ ] Planos anuais com desconto
- [ ] Upgrade/downgrade de planos
- [ ] Notificações de renovação (email)
- [ ] Analytics de conversão

## ✅ Status Atual

**Implementado:**
- ✅ Schema Prisma com SubscriptionStatus enum
- ✅ SubscriptionService com PENDING/ACTIVE/EXPIRED/CANCELLED
- ✅ API /onboarding cria subscription PENDING
- ✅ API /payment (mock) para ativar subscription
- ✅ Página /checkout com UI completa
- ✅ LoginForm atualizado (sem trial grátis)
- ✅ Landing page redireciona para /auth
- ✅ /generate verifica status e redireciona se PENDING
- ✅ Alerts visuais para todos os estados

**Falta Implementar:**
- ⏳ Integração real com gateway de pagamento
- ⏳ Webhooks para confirmação automática
- ⏳ Renovação automática mensal
- ⏳ Página de gerenciamento de assinatura
- ⏳ Sistema de notificações de expiração

## 🎯 Resultado

O usuário agora:
1. Se cadastra na plataforma
2. É direcionado para página de pagamento
3. Paga R$ 19,90/mês
4. Recebe acesso imediato após pagamento
5. Pode gerar leads ilimitadamente enquanto assinatura estiver ativa

**Não há mais trial gratuito** - tudo depende de pagamento confirmado!
