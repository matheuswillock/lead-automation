# Sistema de Onboarding e Assinatura

## 📋 Visão Geral

Este documento descreve o sistema completo de onboarding e gerenciamento de assinaturas implementado no Lead Generator.

## 🏗️ Arquitetura

### Banco de Dados (Prisma + PostgreSQL)

O sistema utiliza 3 tabelas principais:

#### 1. **Profile** (Perfis de Usuário)
```prisma
model Profile {
  id           String        @id @default(uuid()) @db.Uuid
  supabaseId   String        @unique @map("supabase_id")
  email        String?
  username     String?
  avatarUrl    String?       @map("avatar_url")
  createdAt    DateTime      @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt    DateTime      @updatedAt @map("updated_at") @db.Timestamptz(6)
  subscription Subscription?

  @@map("profiles")
}
```

#### 2. **Subscription** (Assinaturas)
```prisma
model Subscription {
  id        String            @id @default(uuid()) @db.Uuid
  profileId String            @unique @map("profile_id") @db.Uuid
  planId    String            @map("plan_id") @db.Uuid
  status    SubscriptionStatus
  startsAt  DateTime          @map("starts_at") @db.Timestamptz(6)
  endsAt    DateTime          @map("ends_at") @db.Timestamptz(6)
  createdAt DateTime          @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt DateTime          @updatedAt @map("updated_at") @db.Timestamptz(6)
  
  profile Profile           @relation(fields: [profileId], references: [id], onDelete: Cascade)
  plan    SubscriptionPlan  @relation(fields: [planId], references: [id])

  @@index([profileId])
  @@map("subscriptions")
}
```

Status disponíveis:
- `TRIAL` - Período de teste (7 dias)
- `ACTIVE` - Assinatura paga ativa
- `CANCELLED` - Assinatura cancelada
- `EXPIRED` - Assinatura expirada

#### 3. **SubscriptionPlan** (Planos de Assinatura)
```prisma
model SubscriptionPlan {
  id            String         @id @default(uuid()) @db.Uuid
  name          String         @unique
  price         Decimal        @db.Decimal(10, 2)
  description   String?
  subscriptions Subscription[]
  createdAt     DateTime       @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt     DateTime       @updatedAt @map("updated_at") @db.Timestamptz(6)

  @@map("subscription_plans")
}
```

Plano atual:
- **Professional**: R$ 19,90/mês
  - Descrição: "Extração e geração de leads rápida e consistente. Acesso completo a todas as funcionalidades."

## 🔄 Fluxo de Onboarding

### 1. Cadastro do Usuário
```
Usuário → /auth (página de autenticação)
  ↓
Criar conta via Supabase Auth
  ↓
Email de confirmação enviado
  ↓
Confirmar email → /auth/callback
  ↓
Redirecionar para /generate
```

### 2. Criação Automática de Perfil e Trial
```
Usuário autenticado acessa /generate
  ↓
useOnboarding hook detecta novo usuário
  ↓
POST /api/onboarding com dados do Supabase Auth
  ↓
ProfileService.createProfile()
  ↓
SubscriptionService.createTrialSubscription()
  ↓
Retorna perfil com trial de 7 dias ativo
```

## 📁 Estrutura de Arquivos

### Services

#### **ProfileService** (`src/services/ProfileService/ProfileService.ts`)
Gerencia operações de perfil de usuário:
- `createProfile(input)` - Cria novo perfil
- `getProfileBySupabaseId(supabaseId)` - Busca perfil por ID do Supabase
- `getProfileById(id)` - Busca perfil por ID UUID
- `updateProfile(id, data)` - Atualiza dados do perfil

#### **SubscriptionService** (`src/services/SubscriptionService/SubscriptionService.ts`)
Gerencia ciclo de vida das assinaturas:
- `createTrialSubscription(profileId, planId)` - Cria trial de 7 dias
- `activatePaidSubscription(profileId, planId)` - Ativa assinatura paga (30 dias)
- `cancelSubscription(subscriptionId)` - Cancela assinatura
- `isSubscriptionActive(subscription)` - Verifica se assinatura está ativa

### API Routes

#### **POST /api/onboarding** - Criar novo usuário
Request:
```json
{
  "supabaseId": "uuid-do-supabase",
  "email": "usuario@exemplo.com",
  "username": "usuario",
  "avatarUrl": "https://..."
}
```

Response:
```json
{
  "profile": { ... },
  "subscription": { ... },
  "subscriptionActive": true,
  "isNew": true
}
```

#### **GET /api/onboarding?supabaseId={id}** - Buscar perfil existente
Response:
```json
{
  "profile": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "subscription": {
      "status": "TRIAL",
      "endsAt": "2025-10-27T23:31:23.259Z",
      "plan": {
        "name": "Professional",
        "price": "19.90"
      }
    }
  },
  "subscription": { ... },
  "subscriptionActive": true
}
```

### Hooks

#### **useOnboarding** (`src/hooks/useOnboarding.ts`)
Hook React para gerenciar onboarding no client-side:

```typescript
const {
  loading,              // Estado de carregamento
  data,                 // Dados do perfil e assinatura
  error,                // Mensagem de erro
  refreshProfile,       // Função para atualizar dados
  hasActiveSubscription, // Boolean - assinatura ativa
  isNewUser             // Boolean - usuário novo (trial)
} = useOnboarding(user)
```

Comportamento:
- Verifica automaticamente quando `user` muda
- Cria perfil + trial se usuário novo
- Retorna dados existentes se usuário já cadastrado
- Atualiza estado de assinatura

## 🎯 Integração em Páginas

### Exemplo: Página Generate (`src/app/generate/page.tsx`)

```typescript
export default function GeneratePage() {
  const supabase = createClient()
  const [user, setUser] = useState(null)
  
  // Hook de onboarding
  const { 
    data,
    loading,
    error,
    hasActiveSubscription,
    isNewUser
  } = useOnboarding(user)

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkAuth()
  }, [])

  // Proteger ação
  const handleGenerateLeads = async () => {
    if (!hasActiveSubscription) {
      return // Bloqueia se não tiver assinatura
    }
    // ... lógica de geração
  }

  return (
    <div>
      {/* Alertas de status */}
      {!user && <Alert>Faça login</Alert>}
      {!hasActiveSubscription && <Alert>Assinatura inativa</Alert>}
      {isNewUser && <Alert>Trial ativado!</Alert>}
      
      {/* Botão protegido */}
      <Button 
        disabled={!hasActiveSubscription}
        onClick={handleGenerateLeads}
      >
        Gerar Leads
      </Button>
    </div>
  )
}
```

## 🔒 Proteção de Rotas

### Client-Side (useOnboarding)
- Verifica `hasActiveSubscription` antes de ações
- Desabilita botões/recursos sem assinatura ativa
- Mostra alertas de status

### Server-Side (Futuro - Middleware)
```typescript
// src/middleware.ts (a implementar)
export async function middleware(request: NextRequest) {
  const { user } = await updateSession(request)
  
  if (!user && protectedRoutes.includes(request.url)) {
    return NextResponse.redirect('/auth')
  }
  
  // Verificar assinatura via API
  const profile = await fetch(`/api/onboarding?supabaseId=${user.id}`)
  if (!profile.subscriptionActive) {
    return NextResponse.redirect('/renew')
  }
  
  return NextResponse.next()
}
```

## 📊 Status da Assinatura

### Cálculos
```typescript
// Verificar se assinatura está ativa
function isActive(subscription) {
  const now = new Date()
  const endsAt = new Date(subscription.endsAt)
  
  return (
    (subscription.status === 'TRIAL' || subscription.status === 'ACTIVE') &&
    endsAt > now
  )
}

// Dias até expiração
function daysUntilExpiration(subscription) {
  const now = new Date()
  const endsAt = new Date(subscription.endsAt)
  const diff = endsAt.getTime() - now.getTime()
  
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
```

### Transições de Status
```
NOVO USUÁRIO
  ↓
TRIAL (7 dias)
  ↓
EXPIRED (se não renovar)
  ↓
ACTIVE (ao pagar)
  ↓
CANCELLED (ao cancelar)
```

## 🗄️ Seed do Banco

```bash
npm run prisma:seed
```

Cria o plano Professional:
```typescript
{
  name: 'Professional',
  price: 19.9,
  description: 'Extração e geração de leads rápida e consistente...'
}
```

## 🛠️ Comandos Úteis

```bash
# Aplicar migrações
npx prisma migrate dev --name nome_da_migracao

# Gerar Prisma Client
npx prisma generate

# Seed do banco
npm run prisma:seed

# Visualizar banco (Prisma Studio)
npm run prisma:studio

# Reset do banco (DEV ONLY!)
npx prisma migrate reset
```

## 🔐 Variáveis de Ambiente

```env
# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Database (PgBouncer - para queries)
DATABASE_URL=postgres://postgres.xxx:PASSWORD@aws-0-sa-east-1.pooler.supabase.com:6543/postgres

# Database Direct (para migrations)
DIRECT_URL=postgres://postgres.xxx:PASSWORD@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

## 📝 Próximos Passos

- [ ] Implementar middleware de proteção server-side
- [ ] Criar página de gerenciamento de assinatura
- [ ] Integrar gateway de pagamento (Stripe/Mercado Pago)
- [ ] Adicionar webhooks para renovação automática
- [ ] Implementar notificações de expiração de trial
- [ ] Dashboard de analytics de assinatura
- [ ] Sistema de cupons/descontos

## 🎉 Conclusão

O sistema está completo para:
✅ Cadastro e autenticação via Supabase
✅ Onboarding automático com trial de 7 dias
✅ Proteção de rotas e recursos
✅ Gerenciamento de assinatura (trial/active/cancelled/expired)
✅ UI com alertas e feedback de status
✅ Single subscription model (R$ 19,90/mês)

Falta implementar:
⏳ Integração de pagamento
⏳ Renovação automática
⏳ Middleware server-side
