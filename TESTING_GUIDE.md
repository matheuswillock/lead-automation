# 🧪 Guia de Teste - Sistema de Assinatura

## 🚀 Como Testar o Fluxo Completo

### ✅ Pré-requisitos

1. Servidor rodando: `npm run dev`
2. API Key da AbacatePay configurada no `.env`
3. (Opcional) ngrok para testar webhook: `ngrok http 3000`

---

## 📝 Passo a Passo

### **1. Cadastro de Novo Usuário**

1. Acesse: `http://localhost:3000`
2. Clique em **"Começar Agora"**
3. Você será redirecionado para: `/register`

**Preencha o formulário:**
- Nome completo: `João Silva`
- Email: `joao@teste.com`
- Senha: `teste123`
- Confirmar senha: `teste123`

4. Clique em **"Criar Conta"**

**O que acontece:**
- ✅ Conta criada no Supabase Auth
- ✅ Profile criado automaticamente via `/api/onboarding`
- ✅ Subscription criada com status `PENDING`
- ✅ Redireciona para `/checkout`

---

### **2. Página de Checkout**

Você será redirecionado automaticamente para: `/checkout`

**Você verá:**
- 📋 Card esquerdo: Informações do plano (R$ 19,90/mês)
- 💳 Card direito: Formulário de pagamento PIX

**Preencha:**
- Nome completo: (já vem preenchido)
- Telefone: `11987654321` (opcional)

**Clique em:** **"Gerar QR Code PIX"**

**O que acontece:**
- ✅ POST para `/api/payment` cria cobrança na AbacatePay
- ✅ QR Code PIX é exibido
- ✅ Código PIX copiável mostrado
- ✅ Polling iniciado para detectar pagamento

---

### **3. Simular Pagamento (Dev Mode)**

**Opção A: Via Dashboard AbacatePay**
1. Acesse: https://abacatepay.com/dashboard
2. Login com sua conta
3. Vá em **"Cobranças"** (Billings)
4. Encontre a cobrança recém-criada
5. Status: `PENDING`
6. Clique em **"Simular Pagamento"** (botão azul)
7. Cobrança muda para `PAID`

**O que acontece:**
- ✅ Webhook dispara para `/api/webhooks/abacatepay`
- ✅ Subscription atualizada para `ACTIVE`
- ✅ Polling detecta pagamento após ~3 segundos
- ✅ Mensagem de sucesso exibida
- ✅ Redireciona para `/generate` após 2 segundos

**Opção B: Manualmente via API (avançado)**
```bash
# Buscar billing ID
curl http://localhost:3000/api/payment?supabaseId=<UUID>

# Simular webhook
curl -X POST http://localhost:3000/api/webhooks/abacatepay \
  -H "Content-Type: application/json" \
  -d '{
    "event": "billing.paid",
    "data": {
      "id": "bill_xxx",
      "metadata": {
        "profileId": "<UUID_DO_PROFILE>"
      }
    }
  }'
```

---

### **4. Acessar Plataforma**

Após pagamento confirmado:
- ✅ Você é redirecionado para: `/generate`
- ✅ Subscription status: `ACTIVE`
- ✅ Alert verde: "Assinatura ativa"
- ✅ Pode gerar leads normalmente

---

## 🔍 Como Verificar Cada Etapa

### Verificar Profile Criado
```bash
# Via console do navegador (F12)
# Na página /checkout
localStorage.getItem('sb-<...>-auth-token')
```

### Verificar Subscription
```bash
curl http://localhost:3000/api/payment?supabaseId=<UUID>
```

Resposta esperada:
```json
{
  "subscription": {
    "status": "PENDING", // ou "ACTIVE" após pagamento
    "currentPeriodEnd": "2025-11-20T...",
    "plan": {
      "name": "Professional",
      "price": "19.90"
    }
  }
}
```

### Verificar Billing na AbacatePay
```bash
curl http://localhost:3000/api/payment?billingId=bill_xxx
```

Resposta esperada:
```json
{
  "billing": {
    "id": "bill_xxx",
    "status": "PENDING", // ou "PAID"
    "amount": 1990
  },
  "isPaid": false // ou true
}
```

---

## ⚠️ Troubleshooting

### Problema: QR Code não aparece
**Causa:** Erro ao criar cobrança
**Solução:**
1. Verifique se `ABACATEPAY_API_KEY` está correta
2. Abra DevTools (F12) → Console
3. Verifique erro: `Erro ao criar cobrança`
4. Tente novamente

### Problema: Polling não detecta pagamento
**Causa:** Webhook não configurado
**Solução:**
1. Configure webhook no dashboard AbacatePay
2. Use ngrok para desenvolvimento local
3. URL: `https://xxx.ngrok.io/api/webhooks/abacatepay`

### Problema: Subscription não ativa
**Causa:** Webhook falhou
**Solução:**
1. Verifique logs do terminal
2. Procure por: `Webhook AbacatePay recebido`
3. Se não aparecer, webhook não está chegando
4. Teste manualmente com curl (ver Opção B acima)

### Problema: Redireciona para /checkout mesmo após pagar
**Causa:** Subscription ainda está PENDING
**Solução:**
1. Abra DevTools → Network
2. Verifique chamadas para `/api/payment`
3. Confirme status da subscription
4. Pode ser delay do webhook (aguarde ~10 segundos)

---

## 📊 Estados Esperados

| Etapa | Subscription Status | Página | Ação |
|-------|---------------------|---------|------|
| Cadastro | `PENDING` | /checkout | Aguardando pagamento |
| Checkout (antes PIX) | `PENDING` | /checkout | Gerar QR Code |
| Checkout (após PIX) | `PENDING` | /checkout | Aguardando confirmação |
| Pagamento confirmado | `ACTIVE` | /checkout → /generate | Pode usar plataforma |

---

## 🎯 Checklist de Teste

- [ ] Cadastro funciona
- [ ] Profile criado automaticamente
- [ ] Subscription criada como PENDING
- [ ] Redireciona para /checkout
- [ ] Formulário de checkout visível
- [ ] QR Code PIX gerado com sucesso
- [ ] Código PIX copiável funciona
- [ ] Simular pagamento no dashboard funciona
- [ ] Webhook recebido (check terminal logs)
- [ ] Subscription atualizada para ACTIVE
- [ ] Polling detecta mudança
- [ ] Redireciona para /generate
- [ ] Pode gerar leads normalmente

---

## 📝 Logs Importantes

### Terminal (Backend)
```
Webhook AbacatePay recebido: { event: 'billing.paid', ... }
Assinatura ativada com sucesso: uuid-xxx
```

### Console do Navegador (Frontend)
```
POST /api/payment 200
Billing created: { id: 'bill_xxx', ... }
Starting payment polling...
Payment detected! Redirecting...
```

---

## 🎬 Vídeo de Teste Ideal

1. ▶️ 00:00 - Landing page
2. ▶️ 00:05 - Clique "Começar Agora"
3. ▶️ 00:10 - Preenche formulário de cadastro
4. ▶️ 00:20 - Clique "Criar Conta"
5. ▶️ 00:25 - Redireciona para /checkout
6. ▶️ 00:30 - Preenche dados do cliente
7. ▶️ 00:35 - Clique "Gerar QR Code PIX"
8. ▶️ 00:40 - QR Code exibido
9. ▶️ 00:45 - Vai no dashboard AbacatePay
10. ▶️ 00:50 - Simula pagamento
11. ▶️ 00:55 - Volta para checkout
12. ▶️ 01:00 - Mensagem "Pagamento confirmado"
13. ▶️ 01:03 - Redireciona para /generate
14. ▶️ 01:05 - Alert verde "Assinatura ativa"
15. ✅ 01:10 - Teste concluído!

**Tempo total esperado:** ~1 minuto

---

## 🆘 Suporte

Se algo não funcionar:
1. Verifique os logs do terminal
2. Abra DevTools → Console/Network
3. Confirme variáveis de ambiente
4. Teste cada endpoint individualmente
5. Consulte `ABACATEPAY_INTEGRATION.md` para detalhes técnicos
