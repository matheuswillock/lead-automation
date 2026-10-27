# 🎯 TheLeadsFy

> **Leadify your business** - Geração de leads B2B simplificada através de busca geográfica inteligente

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17.1-2D3748)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Sobre o Projeto

**TheLeadsFy** é uma plataforma SaaS completa para geração e extração de leads B2B. Através de busca geográfica inteligente, permite que empresas, vendedores e profissionais de marketing encontrem prospects qualificados por localização e tipo de negócio.

### 🎯 Principais Funcionalidades

- 🔍 **Busca Inteligente**: Pesquise por tipo de negócio + localização (cidade, bairro, região)
- 📊 **Extração Completa**: Nome, telefone, endereço, avaliações, horário de funcionamento
- 📥 **Exportação Instantânea**: Download em CSV/Excel pronto para CRM
- 💳 **Pagamento via PIX**: Sistema de assinatura mensal brasileiro (R$ 19,90)
- 👑 **Assinaturas Vitalícias**: Acesso permanente para vendedores e parceiros da plataforma
- 🎨 **Interface Moderna**: UX/UI otimizada e responsiva
- ⚡ **Performance**: Resultados em tempo real

### 🎯 Público-Alvo

- Vendedores B2B
- Agências de marketing
- Representantes comerciais
- Empresas de telemarketing
- Consultores de vendas
- Empreendedores digitais

---

## 🚀 Stack Tecnológica

### Frontend
- **Next.js 15.3.4** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TailwindCSS 4** - Estilização utility-first
- **Shadcn/ui** - Componentes acessíveis
- **Framer Motion** - Animações
- **Lucide Icons** - Ícones SVG

### Backend
- **Next.js API Routes** - Endpoints serverless
- **Prisma ORM 6.17.1** - Database ORM
- **PostgreSQL** - Banco de dados relacional
- **Supabase** - Auth + Database hosting

### Integrações
- **Serper API** - Dados do Google Places
- **AbacatePay** - Pagamentos PIX
- **Supabase Auth** - Autenticação

### DevOps
- **Vercel** - Deploy e hosting
- **GitHub Actions** - CI/CD
- **ESLint + TypeScript** - Code quality

---

## 📦 Instalação e Setup

### Pré-requisitos

- Node.js 20+
- npm ou yarn
- PostgreSQL (ou Supabase)
- Conta Serper API
- Conta AbacatePay

### 1. Clone o Repositório

```bash
git clone https://github.com/matheuswillock/lead-automation.git
cd lead-automation
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Serper API (Google Places)
SERPER_API_KEY=sua_chave_aqui
# Opcional; por padrão a aplicação usa https://google.serper.dev/places
SERPER_API_URL=https://google.serper.dev/places

# Database PostgreSQL
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_HOST=seu_host
POSTGRES_PORT=5432
POSTGRES_DB=theleadsfy
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica
SUPABASE_SERVICE_ROLE_KEY=sua_chave_privada

# AbacatePay
ABACATEPAY_API_URL=https://api.abacatepay.com/v1
ABACATEPAY_API_KEY=sua_chave_api
ABACATEPAY_WEBHOOK_SECRET=seu_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configure o Banco de Dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Popular banco (opcional)
npm run prisma:seed
```

### Busca de locais com Serper

A geração de leads usa `POST https://google.serper.dev/places`, com `X-API-KEY` e JSON. A chave deve ficar apenas no ambiente do servidor (`.env.local` ou `.env`), nunca no navegador nem em arquivos versionados.

Corpo enviado pela aplicação:

```json
{
  "q": "clínica odontológica Jundiaí, SP",
  "gl": "br",
  "hl": "pt-br",
  "page": 1
}
```

A cidade digitada em Localização é anexada ao `q`; a aplicação não envia o parâmetro `location` do Serper, porque ele só aceita o nome canônico do Google (ex.: `Jundiai,State of Sao Paulo,Brazil`) e ignora texto livre, devolvendo resultados do país todo (testado em 2026-10-27). `gl` é o código de país ISO de duas letras. O Playground do Serper mostra 10 resultados por página e 1 crédito por consulta Places; a aplicação limita cada execução a 10 páginas. Três buscas de uma página retornam até 30 candidatos brutos, não 30 leads qualificados. Para buscar 30 leads qualificados em três nichos e quatro regiões, planeje até 12 consultas (até 120 candidatos brutos), valide manualmente cada registro e pare quando atingir a meta; confirme o custo e o saldo antes de rodar o lote.

### 5. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura do Projeto

```
theleadsfy/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Autenticação
│   │   ├── checkout/          # Página de pagamento
│   │   ├── generate/          # Geração de leads
│   │   └── register/          # Cadastro
│   ├── components/            # Componentes React
│   │   ├── landingPage/       # Landing page sections
│   │   └── ui/                # UI components (Shadcn)
│   ├── services/              # Serviços de integração
│   │   ├── AbacatePayService/ # Pagamentos
│   │   ├── SerperService/     # Busca de leads
│   │   └── SubscriptionService/ # Assinaturas
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utilidades
├── prisma/                    # Schema e migrations
├── public/                    # Assets estáticos
└── docs/                      # Documentação
```

---

## 🔄 Fluxo de Uso

### 1. Cadastro e Pagamento
```
Landing Page → Registro → Checkout → Pagamento PIX → Dashboard
```

### 2. Geração de Leads
```
Busca (Local + Negócio) → Extração de Dados → Visualização → Exportação CSV
```

### 3. Assinatura
```
R$ 19,90/mês → PIX → Ativação Automática → Acesso Completo
```

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run dev:ngrok        # Inicia com ngrok (para webhooks)

# Build e Produção
npm run build            # Build de produção
npm run start            # Inicia servidor de produção

# Qualidade de Código
npm run lint             # Executa ESLint
npm test                 # Executa os testes de integração Serper locais (sem consumir créditos)

# Prisma (Database)
npm run prisma:generate  # Gera Prisma Client
npm run prisma:studio    # Abre Prisma Studio (GUI)
npm run prisma:migrate   # Executa migrations
npm run prisma:seed      # Popula banco de dados
```

---

## 📚 Documentação Adicional

- [Integração AbacatePay](./ABACATEPAY_INTEGRATION.md)
- [Sistema de Onboarding](./ONBOARDING_SYSTEM.md)
- [Fluxo de Assinatura](./SUBSCRIPTION_FLOW.md)
- [Guia de Testes](./TESTING_GUIDE.md)
- [Changelog AbacatePay](./CHANGELOG_ABACATEPAY.md)
- [Branding Guidelines](./BRANDING.md)
- [Sistema de Cores OKLCH](./COLOR_SYSTEM.md)
- 👑 **[Sistema de Assinatura Vitalícia](./LIFETIME_SUBSCRIPTION.md)** ← Novo!
- [Resumo da Implementação](./IMPLEMENTATION_SUMMARY.md)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia as [diretrizes de contribuição](./CONTRIBUTING.md) antes de submeter um PR.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 👥 Time

Desenvolvido com ❤️ por **TheLeadsFy Team**

---

## 🔗 Links

- 🌐 **Website**: [theleadsfy.com](https://theleadsfy.com)
- 📧 **Email**: contato@theleadsfy.com
- 💬 **Suporte**: suporte@theleadsfy.com

---

**TheLeadsFy** - Leads certos, no lugar certo 🎯📍
