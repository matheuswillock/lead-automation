# Integração AbacatePay - Lead Generator

## 📋 Visão Geral

Este documento descreve a integração completa do AbacatePay como gateway de pagamento PIX para o Lead Generator.

## 🔄 Fluxo de Pagamento Completo

### 1. Cadastro do Usuário
```
Landing Page (/)
  ↓ Clica "Começar Agora"
Página de Registro (/register)
  ↓ Preenche: Nome, Email, Senha
Supabase Auth cria conta
  ↓ Automaticamente
API /api/onboarding cria Profile + Subscription PENDING
  ↓ Redireciona
Checkout (/checkout)
```

### 2. Checkout e Pagamento PIX
```
Checkout (/checkout)
  ↓ Usuário vê plano R$ 19,90/mês
  ↓ Preenche: Nome completo, Telefone (opcional)
  ↓ Clica "Gerar QR Code PIX"
API /api/payment cria cobrança AbacatePay
  ↓ Retorna
QR Code PIX exibido na tela
  ↓ Usuário escaneia e paga
Webhook /api/webhooks/abacatepay recebe notificação
  ↓ Evento: billing.paid
Subscription atualizada para ACTIVE
  ↓ Polling detecta pagamento
Redireciona para /generate
```

### 3. Uso da Plataforma
```
Generate Page (/generate)
  ↓ Verifica subscription
  ✅ Se ACTIVE: Pode gerar leads
  ❌ Se PENDING: Redireciona para /checkout
```

## 🛠️ Arquivos Criados/Modificados

### 1. **AbacatePayService** 
`src/services/AbacatePayService/AbacatePayService.ts`

Serviço responsável por toda comunicação com a API da AbacatePay.

**Métodos principais:**
```typescript
// Criar cobrança PIX
createSubscriptionBilling(customer, metadata)

// Buscar status de cobrança
getBilling(billingId)

// Cancelar cobrança
cancelBilling(billingId)
```

**Exemplo de uso:**
```typescript
const result = await AbacatePayService.createSubscriptionBilling(
  {
    name: 'João Silva',
    email: 'joao@example.com',
    cellphone: '11987654321', // Opcional
  },
  {
    profileId: 'uuid-do-profile',
    planId: 'uuid-do-plano',
  }
)

if (result.success) {
  // result.data contém:
  // - id: ID da cobrança
  // - url: URL do QR Code
  // - status: Status atual
  // - expiresAt: Data de expiração
}
```

### 2. **Webhook AbacatePay**
`src/app/api/webhooks/abacatepay/route.ts`

Endpoint que recebe notificações da AbacatePay.

**Eventos tratados:**
- `billing.paid` - Pagamento confirmado → Ativa subscription
- `billing.refunded` - Reembolso → Cancela subscription
- `billing.expired` - Cobrança expirou → Notifica usuário

**URL do webhook:** `https://seu-dominio.com/api/webhooks/abacatepay`

**Configuração no AbacatePay:**
1. Acesse o dashboard da AbacatePay
2. Vá em Configurações → Webhooks
3. Adicione a URL acima
4. Salve o secret fornecido em `ABACATEPAY_WEBHOOK_SECRET`

### 3. **API de Pagamento**
`src/app/api/payment/route.ts`

**POST** - Criar cobrança PIX
```typescript
// Request
{
  "supabaseId": "uuid-do-usuario",
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "cellphone": "11987654321" // Opcional
  }
}

// Response
{
  "success": true,
  "billing": {
    "id": "bill_xxx",
    "url": "https://...", // URL do QR Code
    "status": "PENDING",
    "amount": 1990,
    "expiresAt": "2025-10-21T..."
  }
}
```

**GET** - Verificar status
```typescript
// Verificar cobrança específica
GET /api/payment?billingId=bill_xxx

// Verificar subscription do usuário
GET /api/payment?supabaseId=uuid-do-usuario
```

### 4. **Página de Checkout**
`src/app/checkout/page.tsx`

**Features:**
- ✅ Exibe informações do plano Professional
- ✅ Formulário de dados do cliente (nome, telefone)
- ✅ Gera QR Code PIX via AbacatePay
- ✅ Polling automático para detectar pagamento
- ✅ Feedback visual do status
- ✅ Redirecionamento após pagamento confirmado

**Estados:**
1. **Inicial**: Formulário para preencher dados
2. **Processando**: Gerando QR Code
3. **QR Code exibido**: Aguardando pagamento
4. **Pago**: Redireciona para /generate

### 5. **RegisterForm**
`src/components/registerForm.tsx`

**Mudanças:**
- Cria profile automaticamente após signup
- Chama `/api/onboarding` imediatamente
- Subscription criada com status PENDING
- Redireciona direto para /checkout

## 🔐 Variáveis de Ambiente

Adicione ao seu `.env`:

```env
# AbacatePay
ABACATEPAY_API_URL=https://api.abacatepay.com.br/v1
ABACATEPAY_API_KEY=your_api_key_here
ABACATEPAY_WEBHOOK_SECRET=your_webhook_secret_here

# App URL (para redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 Configuração Inicial

### 1. Criar conta na AbacatePay

1. Acesse https://abacatepay.com
2. Crie sua conta
3. Complete o onboarding

### 2. Configurar Dev Mode

Durante desenvolvimento, use o **Dev Mode**:
- Pagamentos são simulados
- Webhooks podem ser testados localmente
- Não há cobrança real

### 3. Obter API Key

1. Dashboard → Configurações → API Keys
2. Copie sua API Key de desenvolvimento
3. Adicione ao `.env` como `ABACATEPAY_API_KEY`

### 4. Configurar Webhook (Produção)

Para receber notificações de pagamento:

1. Dashboard → Configurações → Webhooks
2. Adicione: `https://seu-dominio.com/api/webhooks/abacatepay`
3. Copie o webhook secret
4. Adicione ao `.env` como `ABACATEPAY_WEBHOOK_SECRET`

**Para desenvolvimento local** use ngrok ou similar:
```bash
ngrok http 3000
# Copie a URL e adicione: https://xxx.ngrok.io/api/webhooks/abacatepay
```

### 5. Testar Integração

#### Teste 1: Criar cobrança
```bash
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{
    "supabaseId": "uuid-do-usuario",
    "customer": {
      "name": "Teste Silva",
      "email": "teste@example.com"
    }
  }'
```

#### Teste 2: Verificar cobrança
```bash
curl http://localhost:3000/api/payment?billingId=bill_xxx
```

#### Teste 3: Simular pagamento (Dev Mode)
No dashboard da AbacatePay:
1. Vá em Cobranças
2. Encontre a cobrança criada
3. Clique em "Simular Pagamento"
4. Webhook será disparado automaticamente

## 🔄 Fluxo de Estados da Subscription

```
PENDING (Criado após cadastro)
  ↓ Usuário paga PIX
billing.paid webhook
  ↓
ACTIVE (30 dias de acesso)
  ↓ Após 30 dias ou cancelamento
EXPIRED/CANCELLED
```

## 📊 Monitoramento

### Logs importantes:
```typescript
// Webhook recebido
console.log('Webhook AbacatePay recebido:', body)

// Assinatura ativada
console.log('Assinatura ativada com sucesso:', subscription.id)

// Erro ao criar cobrança
console.error('Erro ao criar cobrança:', error)
```

### Dashboard da AbacatePay:
- Ver todas as cobranças
- Status de pagamentos
- Webhooks enviados
- Logs de erros

## 🚀 Próximos Passos

### Funcionalidades futuras:

1. **Assinatura Recorrente**
   - Implementar billing recorrente mensal
   - Adicionar campo `frequency: 'monthly'` na criação

2. **Múltiplos métodos de pagamento**
   - Adicionar cartão de crédito
   - Adicionar boleto bancário

3. **Notificações por email**
   - Pagamento confirmado
   - Assinatura próxima do vencimento
   - Pagamento falhado

4. **Gestão de assinatura**
   - Página para usuário ver histórico
   - Cancelar assinatura
   - Renovar manualmente

5. **Cupons de desconto**
   - Sistema de cupons promocionais
   - Descontos por indicação

## 📞 Suporte

**AbacatePay:**
- Email: ajuda@abacatepay.com
- Documentação: https://docs.abacatepay.com
- Discord: https://discord.gg/abacatepay

**Lead Generator:**
- Issues: GitHub repository
- Email: contato@leadgenerator.com

## 🔒 Segurança

### Validação de Webhook:
```typescript
// TODO: Implementar validação de assinatura
const signature = request.headers.get('x-abacatepay-signature')
const isValid = validateWebhookSignature(signature, body, WEBHOOK_SECRET)

if (!isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
}
```

### Ambiente de produção:
- ✅ Sempre use HTTPS
- ✅ Valide assinaturas do webhook
- ✅ Implemente rate limiting
- ✅ Monitore logs de erro
- ✅ Configure alertas para falhas

## 📈 Métricas Importantes

- Taxa de conversão (cadastro → pagamento)
- Tempo médio até pagamento
- Taxa de abandono no checkout
- Falhas de webhook
- Tempo de ativação da subscription
