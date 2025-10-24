# 🎨 TheLeadsFy - Guia de Identidade Visual

## 📋 Visão Geral

Este documento define os padrões de identidade visual, tipografia, cores e uso correto da marca **TheLeadsFy**.

---

## 🎯 Nome da Marca

### **Nome Oficial**
```
TheLeadsFy
```

### **Variações Aceitas**
- **Principal**: TheLeadsFy (capitalização correta)
- **Domínio**: theleadsfy.com (minúsculas)
- **Handle Social**: @theleadsfy (minúsculas)
- **Hashtag**: #TheLeadsFy ou #theleadsfy

### **❌ Uso Incorreto**
- ~~The Leads Fy~~
- ~~the leads fy~~
- ~~TheLeadsFY~~
- ~~THELEADSFY~~
- ~~The LeadsFy~~

---

## 🎨 Paleta de Cores

### **Cores do Sistema (OKLCH)**

Nossa paleta utiliza o espaço de cor OKLCH para maior precisão e consistência visual:

#### **Light Mode (Padrão)**

```css
/* Backgrounds */
--background: #f8f8f8           /* oklch(0.975 0 0) - Fundo principal */
--foreground: oklch(0.141 0.005 285.823)  /* Texto principal escuro */
--card: oklch(1 0 0)                      /* Branco puro para cards */
--card-foreground: oklch(0.141 0.005 285.823)

/* Primary (Laranja/Coral Vibrante) */
--primary: oklch(0.705 0.213 47.604)      /* Cor principal - Laranja energético */
--primary-foreground: oklch(0.98 0.016 73.684)  /* Texto sobre primary */

/* Secondary */
--secondary: oklch(0.967 0.001 286.375)   /* Cinza claro */
--secondary-foreground: oklch(0.21 0.006 285.885)

/* Muted (Texto secundário) */
--muted: oklch(0.967 0.001 286.375)
--muted-foreground: oklch(0.552 0.016 285.938)

/* Accent */
--accent: oklch(0.967 0.001 286.375)
--accent-foreground: oklch(0.21 0.006 285.885)

/* Destructive (Erro/Alerta) */
--destructive: oklch(0.577 0.245 27.325)  /* Vermelho vibrante */

/* Borders & Inputs */
--border: oklch(0.92 0.004 286.32)        /* Borda suave */
--input: oklch(0.92 0.004 286.32)
--ring: oklch(0.705 0.213 47.604)         /* Focus ring (primary) */

/* Uso: Variáveis CSS customizadas via Tailwind */
```

#### **Dark Mode**

```css
/* Backgrounds */
--background: oklch(0.141 0.005 285.823)  /* Fundo escuro profundo */
--foreground: oklch(0.985 0 0)            /* Texto claro */
--card: oklch(0.21 0.006 285.885)         /* Cards ligeiramente mais claros */
--card-foreground: oklch(0.985 0 0)

/* Primary (Laranja mais suave) */
--primary: oklch(0.646 0.222 41.116)      /* Laranja ajustado para dark */
--primary-foreground: oklch(0.98 0.016 73.684)

/* Secondary */
--secondary: oklch(0.274 0.006 286.033)   /* Cinza médio escuro */
--secondary-foreground: oklch(0.985 0 0)

/* Muted */
--muted: oklch(0.274 0.006 286.033)
--muted-foreground: oklch(0.705 0.015 286.067)

/* Destructive */
--destructive: oklch(0.704 0.191 22.216)  /* Vermelho para dark mode */

/* Borders & Inputs (com transparência) */
--border: oklch(1 0 0 / 10%)              /* Branco 10% opacidade */
--input: oklch(1 0 0 / 15%)               /* Branco 15% opacidade */
```

### **Cores de Gráficos (Charts)**

```css
/* Light Mode */
--chart-1: oklch(0.646 0.222 41.116)      /* Laranja */
--chart-2: oklch(0.6 0.118 184.704)        /* Azul esverdeado */
--chart-3: oklch(0.398 0.07 227.392)       /* Azul escuro */
--chart-4: oklch(0.828 0.189 84.429)       /* Amarelo vibrante */
--chart-5: oklch(0.769 0.188 70.08)        /* Amarelo alaranjado */

/* Dark Mode */
--chart-1: oklch(0.488 0.243 264.376)      /* Roxo */
--chart-2: oklch(0.696 0.17 162.48)        /* Verde água */
--chart-3: oklch(0.769 0.188 70.08)        /* Amarelo */
--chart-4: oklch(0.627 0.265 303.9)        /* Magenta */
--chart-5: oklch(0.645 0.246 16.439)       /* Coral */
```

### **Como Usar no Código**

```tsx
/* Usando classes Tailwind com as cores customizadas */
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Começar Agora
</button>

<div className="border border-border bg-card text-card-foreground">
  <h3 className="text-foreground">Título</h3>
  <p className="text-muted-foreground">Descrição</p>
</div>

/* Usando diretamente com CSS variables */
<div style={{ backgroundColor: 'var(--primary)' }}>
  Elemento customizado
</div>
```

### **Conversão Aproximada para HEX**

Para referência visual (valores aproximados):

```css
/* Primary Colors (Light Mode) */
Primary: #e97539       /* Laranja energético */
Background: #f8f8f8    /* Cinza clarissimo */
Foreground: #1a1a1a    /* Preto suave */

/* Primary Colors (Dark Mode) */
Primary: #d67942       /* Laranja mais suave */
Background: #1a1a1a    /* Preto profundo */
Foreground: #fafafa    /* Branco suave */

/* Destructive */
Error Light: #e94f4f   /* Vermelho vibrante */
Error Dark: #ef6b6b    /* Vermelho mais claro */
```

### **Paleta Sidebar (Opcional)**

```css
--sidebar: oklch(0.985 0 0)                /* Light mode: quase branco */
--sidebar-foreground: oklch(0.141 0.005 285.823)
--sidebar-primary: oklch(0.705 0.213 47.604)
--sidebar-border: oklch(0.92 0.004 286.32)

/* Dark mode */
--sidebar: oklch(0.21 0.006 285.885)       /* Escuro médio */
--sidebar-foreground: oklch(0.985 0 0)
```

---

## 🔤 Tipografia

### **Fonte Principal: Inter**

```css
/* Para Interface e Corpo de Texto */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Pesos disponíveis:**
- Light (300) - Texto secundário
- Regular (400) - Corpo de texto
- Medium (500) - Subtítulos
- Semi-Bold (600) - Títulos
- Bold (700) - Destaques

### **Fonte Secundária: Poppins**

```css
/* Para Títulos e Headings */
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Pesos disponíveis:**
- Regular (400) - Subtítulos
- Medium (500) - Títulos H3-H6
- Semi-Bold (600) - Títulos H2
- Bold (700) - Títulos H1, Hero

### **Escala Tipográfica**

```css
/* Títulos */
--text-hero: 56px / 1.1 / 700 (Poppins)
--text-h1: 48px / 1.2 / 700 (Poppins)
--text-h2: 40px / 1.3 / 600 (Poppins)
--text-h3: 32px / 1.4 / 600 (Poppins)
--text-h4: 24px / 1.5 / 500 (Poppins)
--text-h5: 20px / 1.5 / 500 (Inter)
--text-h6: 18px / 1.5 / 500 (Inter)

/* Corpo */
--text-lg: 18px / 1.6 / 400 (Inter)
--text-base: 16px / 1.6 / 400 (Inter)
--text-sm: 14px / 1.5 / 400 (Inter)
--text-xs: 12px / 1.4 / 400 (Inter)

/* Especiais */
--text-caption: 12px / 1.4 / 300 (Inter)
--text-button: 16px / 1 / 500 (Inter)
```

---

## 🎯 Logo e Ícone

### **Conceito do Logo**

**Elementos visuais:**
- 🎯 **Alvo**: Representa precisão na geração de leads
- 📍 **Pin de Localização**: Referência à busca geográfica

**Composição sugerida:**
```
[Ícone: Alvo + Pin]  TheLeadsFy
```

### **Variações de Logo**

1. **Logo Completo** (Horizontal)
   - Ícone + Nome completo
   - Uso: Header, landing page, documentos

2. **Logo Compacto** (Vertical)
   - Ícone acima do nome
   - Uso: Mobile, redes sociais

3. **Ícone Isolado**
   - Apenas o símbolo
   - Uso: Favicon, app icon, avatar

### **Espaçamento Mínimo**

```
Área de respiro: 24px em todos os lados do logo
Tamanho mínimo: 120px de largura (logo completo)
Tamanho mínimo: 32px (ícone isolado)
```

### **Cores do Logo**

**Versão Padrão (Light Mode):**
- Ícone: Gradiente laranja (oklch(0.705 0.213 47.604) → oklch(0.828 0.189 84.429))
- Texto: Foreground escuro (oklch(0.141 0.005 285.823))

**Versão Alternativa (Dark Mode):**
- Ícone: Gradiente laranja suave (oklch(0.646 0.222 41.116) → oklch(0.769 0.188 70.08))
- Texto: Foreground claro (oklch(0.985 0 0))

**Versão Monocromática:**
- Light: Tudo em foreground (oklch(0.141 0.005 285.823))
- Dark: Tudo em foreground claro (oklch(0.985 0 0))

---

## 🖼️ Estilo Visual

### **Princípios de Design**

1. **Minimalista**: Menos é mais, foco no essencial
2. **Profissional**: Confiável e corporativo
3. **Tech**: Moderno e inovador
4. **Acessível**: Legível e inclusivo

### **Elementos de Interface**

#### **Bordas e Raios**
```css
--radius-sm: 4px    /* Badges, tags */
--radius-md: 8px    /* Botões, inputs */
--radius-lg: 12px   /* Cards */
--radius-xl: 16px   /* Modais */
--radius-full: 9999px /* Pills, avatares */
```

#### **Sombras**
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15)
```

#### **Espaçamento**
```css
/* Sistema de 8px */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

---

## 💬 Tom de Voz

### **Características**

- ✅ **Direto e Objetivo**: Sem enrolação
- ✅ **Profissional**: Confiável e sério
- ✅ **Amigável**: Acessível e próximo
- ✅ **Orientado a Resultados**: Foco em ROI e vendas

### **Linguagem**

**Palavras-chave para usar:**
- Leads, prospecção, vendas, conversão
- Rápido, simples, inteligente, eficiente
- Resultados, ROI, crescimento, sucesso
- Busca, encontrar, gerar, extrair

**Evitar:**
- Jargões técnicos excessivos
- Promessas impossíveis
- Linguagem muito informal
- Termos negativos ou agressivos

---

## 📝 Taglines Oficiais

### **Principal**
```
"Leadify your business"
```
*Transforme seu negócio em leads*

### **Alternativas**

```
"Find leads, close deals"
```
*Encontre leads, feche negócios*

```
"Geração de leads simplificada"
```
*Versão direta em português*

```
"Leads certos, no lugar certo"
```
*Foco em geolocalização*

```
"Seu mapa de oportunidades"
```
*Versão emocional*

---

## 🎨 Exemplos de Aplicação

### **Header Principal**
```tsx
<h1 className="text-6xl font-bold text-foreground">
  Leadify your business
</h1>
<p className="text-lg text-muted-foreground">
  Geração de leads B2B simplificada através de busca geográfica inteligente
</p>
```

### **Botão Primário**
```tsx
<button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 rounded-lg">
  Começar Agora
</button>
```

### **Card de Feature**
```tsx
<div className="bg-card rounded-lg shadow-md p-6 border border-border">
  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
    <Icon className="text-primary" />
  </div>
  <h3 className="text-2xl font-semibold text-foreground mb-2">
    Título da Feature
  </h3>
  <p className="text-base text-muted-foreground">
    Descrição da funcionalidade...
  </p>
</div>
```

---

## 📱 Redes Sociais

### **Perfis Oficiais**

- **Instagram**: @theleadsfy
- **LinkedIn**: /company/theleadsfy
- **Twitter/X**: @theleadsfy
- **Facebook**: /theleadsfy
- **YouTube**: @theleadsfy

### **Imagem de Perfil**
- Usar ícone isolado do logo
- Fundo: Primary (oklch(0.705 0.213 47.604) - laranja)
- Ícone: Branco ou primary-foreground
- Tamanho: 400x400px mínimo

### **Capa/Banner**
- Dimensões: 1500x500px (LinkedIn) / 1200x675px (Twitter)
- Fundo: Gradiente laranja suave com background
- Texto: "TheLeadsFy - Leadify your business"
- Elementos: Ícones de alvo + localização em primary

---

## ✅ Checklist de Conformidade

Ao criar materiais da marca, verifique:

- [ ] Nome escrito corretamente: **TheLeadsFy**
- [ ] Cores da paleta oficial utilizadas
- [ ] Tipografia Inter ou Poppins aplicada
- [ ] Área de respiro do logo respeitada
- [ ] Tom de voz profissional e direto
- [ ] Tagline oficial quando aplicável
- [ ] Elementos visuais minimalistas
- [ ] Contraste acessível (WCAG AA)

---

## 📞 Contato para Dúvidas de Marca

Para questões sobre uso da marca, entre em contato:
- Email: brand@theleadsfy.com
- Design Team: design@theleadsfy.com

---

**TheLeadsFy** - Leads certos, no lugar certo 🎯📍
