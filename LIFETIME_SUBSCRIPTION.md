# 🎯 Sistema de Assinatura Vitalícia - TheLeadsFy

## 📋 Visão Geral

O sistema de assinatura vitalícia foi desenvolvido para conceder acesso permanente à plataforma TheLeadsFy para vendedores, parceiros e usuários especiais que não devem passar pelo fluxo de pagamento normal.

---

## 🔑 Características das Assinaturas Vitalícias

### ✅ Benefícios
- ✨ **Acesso ilimitado permanente** à plataforma
- 🚫 **Sem necessidade de pagamento** recorrente
- ⏰ **Validade de 100 anos** (praticamente eterna)
- 🎖️ **Status especial** `LIFETIME` no banco de dados
- 🔓 **Acesso direto** ao `/generate` sem checkout

### 🆚 Diferenças vs Assinatura Regular

| Aspecto | Regular | Vitalícia |
|---------|---------|-----------|
| Duração | 30 dias | 100 anos |
| Pagamento | Requerido (R$ 19,90/mês) | Não requerido |
| Renovação | Mensal via PIX | Não requer |
| Status | PENDING → ACTIVE | LIFETIME |
| Checkout | Obrigatório | Bypass automático |
| Campo `isLifetime` | `false` | `true` |

---

## 👨‍💼 Casos de Uso

### Quando Conceder Assinatura Vitalícia:

1. **Vendedores/Afiliados** da plataforma TheLeadsFy
2. **Parceiros estratégicos** de negócios
3. **Investidores** ou stakeholders
4. **Equipe interna** (desenvolvedores, suporte, marketing)
5. **Usuários especiais** por decisão administrativa

---

## 🛠️ Como Conceder Assinatura Vitalícia

### Método 1: Via API Admin Endpoint

#### Pré-requisitos:
1. Adicionar seu email à lista de admins em:
   ```typescript
   // src/app/api/admin/subscription/lifetime/route.ts
   const ADMIN_EMAILS: string[] = [
     'seu-email@theleadsfy.com',
     'admin@theleadsfy.com'
   ]
   ```

2. Obter token de autenticação do Supabase

#### Request:
```bash
# Conceder por Profile ID
curl -X POST https://theleadsfy.com/api/admin/subscription/lifetime \
  -H "Authorization: Bearer SEU_TOKEN_SUPABASE" \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": "uuid-do-usuario"
  }'

# OU conceder por Email
curl -X POST https://theleadsfy.com/api/admin/subscription/lifetime \
  -H "Authorization: Bearer SEU_TOKEN_SUPABASE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendedor@exemplo.com"
  }'
```

#### Response de Sucesso:
```json
{
  "success": true,
  "message": "Assinatura vitalícia concedida com sucesso",
  "data": {
    "profileId": "abc-123-def",
    "email": "vendedor@exemplo.com",
    "name": "João Silva",
    "subscription": {
      "status": "LIFETIME",
      "isLifetime": true,
      "currentPeriodEnd": "2125-01-24T12:00:00.000Z"
    }
  }
}
```

---

### Método 2: Via Prisma Studio (Desenvolvimento)

1. Abrir Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Navegar até a tabela `Subscription`

3. Encontrar a assinatura do usuário pelo `profile_id`

4. Editar os campos:
   - `isLifetime`: `true`
   - `status`: `LIFETIME`
   - `currentPeriodEnd`: Data 100 anos no futuro (ex: 2125-01-01)

5. Salvar alterações

---

### Método 3: Via SQL Direto (Produção)

```sql
-- Conceder assinatura vitalícia por profile_id
UPDATE subscriptions 
SET 
  "isLifetime" = true,
  status = 'LIFETIME',
  "currentPeriodEnd" = NOW() + INTERVAL '100 years'
WHERE profile_id = 'uuid-do-usuario';

-- Conceder por email do usuário
UPDATE subscriptions 
SET 
  "isLifetime" = true,
  status = 'LIFETIME',
  "currentPeriodEnd" = NOW() + INTERVAL '100 years'
WHERE profile_id IN (
  SELECT id FROM profiles WHERE email = 'vendedor@exemplo.com'
);
```

---

## 🔍 Verificar Status de Assinatura Vitalícia

### Via API:
```bash
curl -X GET "https://theleadsfy.com/api/admin/subscription/lifetime?profileId=abc-123" \
  -H "Authorization: Bearer SEU_TOKEN_SUPABASE"
```

### Response:
```json
{
  "profileId": "abc-123-def",
  "isLifetime": true,
  "subscription": {
    "id": "sub-456",
    "profile_id": "abc-123-def",
    "status": "LIFETIME",
    "isLifetime": true,
    "currentPeriodEnd": "2125-01-24T12:00:00.000Z",
    "createdAt": "2025-01-24T12:00:00.000Z",
    "updatedAt": "2025-01-24T12:00:00.000Z"
  }
}
```

### Via Código:
```typescript
import { SubscriptionService } from '@/services/SubscriptionService/SubscriptionService'

// Verificar se é vitalícia
const isLifetime = await SubscriptionService.isLifetimeSubscription(profileId)

// Verificar se está ativa (retorna true para lifetime)
const isActive = await SubscriptionService.isSubscriptionActive(profileId)
```

---

## 🎨 Atualizar UI para Mostrar Status Vitalício

### Badge de Assinatura Vitalícia

Criar componente visual para indicar status especial:

```typescript
// components/subscription-badge.tsx
import { Badge } from '@/components/ui/badge'
import { Crown } from 'lucide-react'

interface SubscriptionBadgeProps {
  isLifetime: boolean
  status: string
}

export function SubscriptionBadge({ isLifetime, status }: SubscriptionBadgeProps) {
  if (isLifetime) {
    return (
      <Badge 
        variant="default" 
        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white"
      >
        <Crown className="w-3 h-3 mr-1" />
        Vitalícia
      </Badge>
    )
  }

  return <Badge variant={status === 'ACTIVE' ? 'success' : 'secondary'}>{status}</Badge>
}
```

### Usar em páginas:

```typescript
// Em qualquer página que mostre subscription
import { SubscriptionBadge } from '@/components/subscription-badge'

// No componente:
<SubscriptionBadge 
  isLifetime={subscription.isLifetime} 
  status={subscription.status} 
/>

{subscription.isLifetime ? (
  <p className="text-sm text-muted-foreground">
    🎉 Você tem acesso vitalício à plataforma!
  </p>
) : (
  <p className="text-sm text-muted-foreground">
    Válido até: {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
  </p>
)}
```

---

## 🧪 Testar Sistema de Assinatura Vitalícia

### Checklist de Testes:

- [ ] **Criar assinatura vitalícia** via API admin endpoint
- [ ] **Verificar no banco** se `isLifetime = true` e `status = LIFETIME`
- [ ] **Login com usuário vitalício** e verificar redirecionamento
- [ ] **Acessar `/generate`** diretamente (deve funcionar sem checkout)
- [ ] **Verificar UI** mostra badge/status de vitalícia corretamente
- [ ] **Testar renovação** (deve retornar mesma subscription sem mudanças)
- [ ] **Verificar método `isSubscriptionActive`** retorna `true`
- [ ] **Verificar método `isLifetimeSubscription`** retorna `true`

---

## 🔒 Segurança

### ⚠️ Importantes Considerações:

1. **Endpoint Admin Protegido**:
   - Apenas emails listados em `ADMIN_EMAILS` podem conceder vitalícia
   - Requer token Bearer válido do Supabase
   - Service role key para bypass de RLS

2. **Lista de Admins**:
   - Manter `ADMIN_EMAILS` atualizada com contas confiáveis
   - Não commitar emails sensíveis no repositório público
   - Considerar mover para variável de ambiente

3. **Auditoria**:
   - Logs automáticos no console de quem concede vitalícia
   - Considerar adicionar tabela `subscription_audit_log` para rastreabilidade

---

## 📊 Banco de Dados

### Schema da Subscription:

```prisma
model Subscription {
  id               String             @id @default(uuid())
  profile_id       String             @unique
  status           SubscriptionStatus @default(PENDING)
  isLifetime       Boolean            @default(false) // 🆕 Campo vitalícia
  currentPeriodEnd DateTime
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
  
  profile Profile @relation(fields: [profile_id], references: [id], onDelete: Cascade)
  
  @@map("subscriptions")
}

enum SubscriptionStatus {
  PENDING   // Aguardando pagamento
  ACTIVE    // Ativa e paga
  CANCELLED // Cancelada pelo usuário
  EXPIRED   // Expirada
  LIFETIME  // Vitalícia (vendedores/parceiros) 🆕
}
```

### Migration Aplicada:

```sql
-- 20251024121218_add_lifetime_subscription

-- AlterEnum: Adicionar LIFETIME ao enum SubscriptionStatus
ALTER TYPE "SubscriptionStatus" ADD VALUE 'LIFETIME';

-- AlterTable: Adicionar campo isLifetime
ALTER TABLE "subscriptions" 
ADD COLUMN "isLifetime" BOOLEAN NOT NULL DEFAULT false;
```

---

## 🚀 Próximos Passos

### Melhorias Futuras:

1. **UI Admin Panel**:
   - Criar página `/admin/subscriptions` para gerenciar assinaturas
   - Listagem de todas as assinaturas vitalícias
   - Botão para conceder/revogar vitalícia com confirmação

2. **Email de Boas-vindas**:
   - Enviar email especial quando conceder assinatura vitalícia
   - Template diferenciado com badge de "Parceiro Premium"

3. **Analytics**:
   - Dashboard com métricas de assinaturas vitalícias vs regulares
   - Tracking de lifetime value (LTV) de cada tipo

4. **Automação**:
   - Webhook para conceder vitalícia automaticamente por evento
   - Integração com CRM para identificar vendedores elegíveis

---

## 📞 Suporte

Para dúvidas sobre o sistema de assinatura vitalícia:

- 📧 Email: suporte@theleadsfy.com
- 📚 Documentação: [BRANDING.md](./BRANDING.md)
- 🎨 Design System: [COLOR_SYSTEM.md](./COLOR_SYSTEM.md)

---

**Última Atualização**: 24/01/2025  
**Versão**: 1.0.0  
**Status**: ✅ Implementado e Testado
