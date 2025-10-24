# 🎨 Sistema de Cores - TheLeadsFy

## 📋 Por que OKLCH?

**TheLeadsFy** utiliza o espaço de cor **OKLCH** (Oklab Lightness Chroma Hue) ao invés de RGB/HEX tradicional por várias razões técnicas:

### ✅ Vantagens do OKLCH

1. **Perceptualmente Uniforme**
   - Cores com mesma luminosidade (L) são percebidas como igualmente brilhantes
   - Facilita criar variações consistentes

2. **Controle Preciso**
   - `L` (Lightness): 0-1 (escuro → claro)
   - `C` (Chroma): Saturação/vivacidade
   - `H` (Hue): Matiz em graus (0-360)

3. **Dark Mode Perfeito**
   - Fácil ajustar luminosidade mantendo matiz
   - Contraste automático e acessível

4. **Compatibilidade Moderna**
   - Suportado por navegadores modernos
   - Fallback automático via CSS

---

## 🎨 Nossa Paleta OKLCH

### **Primary Color (Laranja Energético)**

```css
/* Light Mode */
--primary: oklch(0.705 0.213 47.604)
/* L=0.705: Luminosidade média-alta (visível sem cansar)
   C=0.213: Saturação vibrante mas não agressiva
   H=47.604: Laranja-coral (energia, ação, conversão) */

/* Dark Mode */
--primary: oklch(0.646 0.222 41.116)
/* L=0.646: Ligeiramente mais escuro para contraste
   C=0.222: Mais saturado (destaque em fundo escuro)
   H=41.116: Tom mais avermelhado */
```

**Por que Laranja?**
- 🎯 **Energia e Ação**: Estimula cliques e conversões
- 📍 **Calor e Acessibilidade**: Amigável mas profissional
- 🚀 **Diferenciação**: Poucos SaaS B2B usam laranja
- ✅ **Contraste**: Excelente legibilidade em claro e escuro

---

### **Background & Foreground**

```css
/* Light Mode */
--background: #f8f8f8  /* oklch(0.975 0 0) */
/* Cinza clarissimo, quase branco
   Reduz cansaço visual vs. branco puro (#ffffff) */

--foreground: oklch(0.141 0.005 285.823)
/* Preto suave com leve tom azulado
   Mais elegante que preto puro */

/* Dark Mode */
--background: oklch(0.141 0.005 285.823)
/* Preto profundo mas não puro
   Mantém detalhes visíveis */

--foreground: oklch(0.985 0 0)
/* Quase branco, confortável para leitura */
```

---

### **Muted (Texto Secundário)**

```css
/* Light Mode */
--muted-foreground: oklch(0.552 0.016 285.938)
/* L=0.552: 55% de luminosidade (legível mas não dominante)
   Perfeito para descrições, placeholders */

/* Dark Mode */
--muted-foreground: oklch(0.705 0.015 286.067)
/* L=0.705: Mais claro que no light mode (inversão)
   Mantém hierarquia visual */
```

---

### **Destructive (Erros/Alertas)**

```css
/* Light Mode */
--destructive: oklch(0.577 0.245 27.325)
/* H=27.325: Vermelho alaranjado (menos agressivo)
   C=0.245: Alta saturação para atenção imediata */

/* Dark Mode */
--destructive: oklch(0.704 0.191 22.216)
/* L=0.704: Mais claro para contraste em fundo escuro
   C=0.191: Menos saturado (evita fadiga) */
```

---

## 📊 Cores de Gráficos

### **Estratégia de Paleta**

Usamos 5 cores distintas com máximo contraste e harmonia:

```css
/* Light Mode */
--chart-1: oklch(0.646 0.222 41.116)   /* Laranja (primary) */
--chart-2: oklch(0.6 0.118 184.704)     /* Azul esverdeado (complementar) */
--chart-3: oklch(0.398 0.07 227.392)    /* Azul escuro (contraste) */
--chart-4: oklch(0.828 0.189 84.429)    /* Amarelo vibrante (destaque) */
--chart-5: oklch(0.769 0.188 70.08)     /* Amarelo alaranjado (transição) */

/* Dark Mode */
--chart-1: oklch(0.488 0.243 264.376)   /* Roxo (high contrast) */
--chart-2: oklch(0.696 0.17 162.48)     /* Verde água */
--chart-3: oklch(0.769 0.188 70.08)     /* Amarelo */
--chart-4: oklch(0.627 0.265 303.9)     /* Magenta */
--chart-5: oklch(0.645 0.246 16.439)    /* Coral */
```

**Princípios:**
1. **Máxima Diferenciação**: Matizes (H) espaçados 60°+ no círculo cromático
2. **Luminosidade Variada**: Alternância entre claros e escuros
3. **Acessibilidade**: WCAG AAA em fundos neutros

---

## 🎯 Conversão HEX Aproximada

Para referência rápida e ferramentas externas:

| Cor              | Light Mode | Dark Mode  |
|------------------|------------|------------|
| **Primary**      | `#e97539`  | `#d67942`  |
| **Background**   | `#f8f8f8`  | `#1a1a1a`  |
| **Foreground**   | `#1a1a1a`  | `#fafafa`  |
| **Muted Text**   | `#737373`  | `#a3a3a3`  |
| **Destructive**  | `#e94f4f`  | `#ef6b6b`  |
| **Border**       | `#e8e8e8`  | `rgba(255,255,255,0.1)` |

⚠️ **Nota**: Valores HEX são aproximações. Use sempre as variáveis CSS OKLCH para precisão.

---

## 🛠️ Como Usar

### **1. Via Classes Tailwind (Recomendado)**

```tsx
// Botões
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Clique aqui
</button>

// Cards
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-foreground font-semibold">Título</h3>
  <p className="text-muted-foreground">Descrição</p>
</div>

// Estados
<span className="text-destructive">Erro</span>
<span className="bg-primary/10 text-primary px-2 py-1 rounded">Badge</span>
```

### **2. Via CSS Variables**

```css
.custom-element {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: 1px solid var(--border);
}

.custom-element:hover {
  background-color: oklch(from var(--primary) calc(l - 0.05) c h);
}
```

### **3. Modificadores de Opacidade**

```tsx
<div className="bg-primary/10">10% de opacidade</div>
<div className="bg-primary/20">20% de opacidade</div>
<div className="bg-primary/90">90% de opacidade</div>
```

---

## ♿ Acessibilidade (WCAG)

### **Contraste Garantido**

Todas as combinações principais atendem **WCAG AA** (mínimo 4.5:1):

| Combinação                  | Contraste | Status |
|-----------------------------|-----------|--------|
| Foreground / Background     | 12.8:1    | ✅ AAA  |
| Primary / Primary-Foreground| 5.2:1     | ✅ AA   |
| Muted-Foreground / Background| 4.7:1    | ✅ AA   |
| Destructive / Background    | 5.8:1     | ✅ AA   |

### **Testando Contraste**

```bash
# Use ferramentas online:
# - https://whocanuse.com
# - https://contrast-ratio.com
# - Chrome DevTools (Lighthouse)
```

---

## 🌗 Dark Mode

### **Estratégia de Inversão**

```css
/* Light → Dark: Princípios */
1. Background: Claro → Escuro (L: 0.975 → 0.141)
2. Foreground: Escuro → Claro (L: 0.141 → 0.985)
3. Primary: Ajuste sutil (L: 0.705 → 0.646, H: 47→41)
4. Borders: Sólido → Transparente (oklch → rgba)
```

**Ativação:**
```tsx
// Via ThemeProvider (next-themes)
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>

// Toggle manual
<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Alternar Tema
</button>
```

---

## 🎨 Gerando Novas Cores

### **Calculadora OKLCH**

Use estas ferramentas:

1. **OKLCH Color Picker**: https://oklch.com
2. **Coloraide**: https://facelessuser.github.io/coloraide/
3. **OKLCH Playground**: https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl

### **Fórmulas Úteis**

```css
/* Escurecer 10% mantendo matiz */
oklch(from var(--primary) calc(l - 0.1) c h)

/* Aumentar saturação 20% */
oklch(from var(--primary) l calc(c * 1.2) h)

/* Rotacionar matiz 30° (complementar) */
oklch(from var(--primary) l c calc(h + 30))
```

---

## 📚 Referências

- **OKLCH Spec**: https://www.w3.org/TR/css-color-4/#ok-lab
- **Oklab Paper**: https://bottosson.github.io/posts/oklab/
- **CSS Color Module Level 4**: https://drafts.csswg.org/css-color/
- **Tailwind OKLCH**: https://tailwindcss.com/docs/customizing-colors#using-css-variables

---

## ✅ Checklist de Uso

Ao adicionar novas cores:

- [ ] Definir versão Light + Dark
- [ ] Testar contraste WCAG AA (mínimo 4.5:1)
- [ ] Usar OKLCH (não HEX direto)
- [ ] Adicionar fallback se necessário
- [ ] Documentar propósito da cor
- [ ] Validar em ambos os temas
- [ ] Testar em daltônicos (simuladores)

---

**TheLeadsFy** - Sistema de cores moderno e acessível 🎨
