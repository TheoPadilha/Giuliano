# PROMPT PARA CLAUDE CODE - VALIDAÇÃO COMPLETA DO PROPERTIES

Olá Claude! Preciso que você verifique se meu código está EXATAMENTE como as especificações abaixo. Analise cada arquivo e me diga o que está diferente ou faltando.

## 📋 CONTEXTO

Estou implementando uma página Properties minimalista inspirada no Airbnb e ZAP Imóveis. Recebi especificações completas e preciso garantir que meu código está 100% alinhado.

---

## 🎯 ARQUIVOS QUE VOCÊ DEVE VERIFICAR

### 1. **AirbnbHeader.jsx**

Localização: `src/components/layout/AirbnbHeader.jsx`

**DEVE TER:**

- ✅ Estado `isScrolled` que controla a animação
- ✅ useEffect que detecta scroll > 50px
- ✅ Classes condicionais baseadas em `isScrolled`:
  - Header: `py-2` quando scrolled, `py-3` normal
  - Container: `h-16` quando scrolled, `h-20` normal
  - Logo: `w-9 h-9` quando scrolled, `w-10 h-10` normal
  - Logo texto: `text-lg` quando scrolled, `text-xl` normal
  - Barra de busca: `scale-95` quando scrolled, `scale-100` normal
  - Labels: `text-[10px]` quando scrolled, `text-xs` normal
  - Inputs: `text-xs` quando scrolled, `text-sm` normal
  - Botão busca: `w-10 h-10` quando scrolled, `w-12 h-12` normal
- ✅ Todas as transições: `transition-all duration-300 ease-in-out`
- ✅ Cleanup do event listener no useEffect

**VERIFIQUE:**

```javascript
// Deve ter este estado
const [isScrolled, setIsScrolled] = useState(false);

// Deve ter este useEffect
useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// Header deve ter classes condicionais assim
className={`sticky top-0 z-50 bg-white border-b border-airbnb-grey-200 shadow-sm transition-all duration-300 ease-in-out ${
  isScrolled ? 'py-2' : 'py-3'
}`}
```

---

### 2. **Properties.jsx**

Localização: `src/pages/Properties.jsx`

**DEVE TER:**

- ✅ Estado `viewMode` com valores: "grid", "list", "map"
- ✅ Filtros sticky com `className="sticky top-[64px] z-40"`
- ✅ Barra de controles mostrando contador de resultados
- ✅ Botões para alternar entre Grid/Lista/Mapa
- ✅ Grid responsivo: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`
- ✅ Renderização condicional baseada em `viewMode`
- ✅ Empty state elegante com ícone centralizado
- ✅ Paginação com números clicáveis (mostra até 5 páginas)
- ✅ Info de intervalo: "Mostrando X - Y de Z imóveis"
- ✅ Limite padrão de 20 itens por página: `limit: 20`

**ESTRUTURA DA PÁGINA:**

```javascript
return (
  <div className="min-h-screen bg-white">
    {/* Header com animação */}
    <AirbnbHeader />

    {/* Filtros Sticky */}
    <div className="sticky top-[64px] z-40 bg-white border-b border-airbnb-grey-200 shadow-sm">
      <div className="max-w-[2520px] mx-auto px-5 sm:px-10 lg:px-20">
        <PropertyFiltersPro ... />
      </div>
    </div>

    {/* Main Content */}
    <div className="max-w-[2520px] mx-auto px-5 sm:px-10 lg:px-20">

      {/* Barra de Resultados - SÓ quando tem resultados */}
      {!loading && properties.length > 0 && (
        <div className="flex items-center justify-between py-6 border-b">
          {/* Contador */}
          <h2>X imóveis encontrados</h2>

          {/* Controles Grid/Lista/Mapa */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => setViewMode("grid")}>Grid</button>
            <button onClick={() => setViewMode("list")}>Lista</button>
            <button disabled>Mapa</button>
          </div>
        </div>
      )}

      {/* Área de Conteúdo */}
      <div className="py-8">
        {loading ? (
          <Loading />
        ) : properties.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Grid ou Lista baseado em viewMode */}
            {viewMode === "grid" && <GridView />}
            {viewMode === "list" && <ListView />}

            {/* Paginação com números */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-16">
                <div>Mostrando X - Y de Z</div>
                <div>
                  <button>Anterior</button>
                  {/* Números de página */}
                  <button>Próxima</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>

    <Footer />
  </div>
);
```

**VERIFIQUE ESPECIALMENTE:**

- Filtros sticky COM `top-[64px]` (altura do header quando scrolled)
- ViewMode buttons com ícones corretos: FaThLarge, FaList, FaMapMarkedAlt
- Paginação mostra números clicáveis (não só Anterior/Próxima)
- Grid tem 5 colunas no 2xl: `2xl:grid-cols-5`

---

### 3. **PropertyCard.jsx**

Localização: `src/components/property/PropertyCard.jsx`

**VERSÃO A USAR:** PropertyCard_SemContexto.jsx (sem dependência de FavoritesContext)

**DEVE TER:**

- ✅ Prop `layout` com valores "vertical" ou "horizontal"
- ✅ Estado local `isFavorite` (useState)
- ✅ Função `handleFavoriteClick` que apenas alterna o estado local
- ✅ Layout vertical (grid):
  - Imagem: `aspect-square rounded-xlarge`
  - Hover: `group-hover:scale-105 transition-transform duration-300`
  - Botão favorito: absolute top-3 right-3
  - Badge destaque: absolute top-3 left-3 (se is_featured)
  - Informações: cidade, rating, título, detalhes, preço
- ✅ Layout horizontal (lista):
  - Imagem: `w-64 aspect-square` à esquerda
  - Informações completas à direita
  - Descrição com `line-clamp-2`
  - Botão "Ver detalhes" no rodapé
- ✅ Formatação de preço em BRL
- ✅ Ícones: BsPeople, IoBedOutline, MdBathtub, FaStar

**NÃO DEVE TER:**

- ❌ Import do FavoritesContext
- ❌ Hook useFavorites

**DEVE TER:**

```javascript
// Estado local de favorito
const [isFavorite, setIsFavorite] = useState(false);

// Toggle simples
const handleFavoriteClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setIsFavorite(!isFavorite);
};

// Layout condicional
if (layout === "vertical") {
  return (/* card vertical */);
}

if (layout === "horizontal") {
  return (/* card horizontal */);
}
```

---

## 🎨 TAILWIND CONFIG

**VERIFIQUE** se seu `tailwind.config.js` tem estas cores:

```javascript
colors: {
  'rausch': '#FF385C',
  'rausch-dark': '#E31C5F',
  'airbnb-black': '#222222',
  'airbnb-grey-50': '#F7F7F7',
  'airbnb-grey-100': '#EBEBEB',
  'airbnb-grey-200': '#DDDDDD',
  'airbnb-grey-300': '#B0B0B0',
  'airbnb-grey-400': '#717171',
  'airbnb-grey-600': '#484848',
  'airbnb-grey-1000': '#000000',
},
borderRadius: {
  'xlarge': '12px',
  'medium': '8px',
},
maxWidth: {
  '2520': '2520px',
}
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Por favor, verifique CADA item abaixo e me diga o status:

### AirbnbHeader.jsx

- [ ] Tem estado `isScrolled`
- [ ] Tem useEffect com scroll listener
- [ ] Listener é removido no cleanup
- [ ] Header muda de `h-20` para `h-16` ao scrollar
- [ ] Logo diminui ao scrollar
- [ ] Barra de busca diminui ao scrollar
- [ ] Todas transições são `duration-300 ease-in-out`
- [ ] Sticky com `top-0 z-50`

### Properties.jsx

- [ ] Tem estado `viewMode`
- [ ] Filtros são sticky com `top-[64px]`
- [ ] Tem barra de controles com contador
- [ ] Tem botões Grid/Lista/Mapa
- [ ] Grid é `2xl:grid-cols-5`
- [ ] Empty state é elegante e centralizado
- [ ] Paginação mostra números clicáveis
- [ ] Info de intervalo: "Mostrando X-Y de Z"
- [ ] Limite padrão é 20
- [ ] Container máximo é `max-w-[2520px]`
- [ ] Padding é `px-5 sm:px-10 lg:px-20`

### PropertyCard.jsx

- [ ] NÃO importa FavoritesContext
- [ ] Usa estado local para favorito
- [ ] Aceita prop `layout`
- [ ] Layout vertical tem imagem quadrada
- [ ] Layout horizontal tem imagem `w-64`
- [ ] Hover aplica zoom na imagem
- [ ] Botão favorito funciona visualmente
- [ ] Formatação de preço em BRL
- [ ] Badge de destaque aparece quando `is_featured`

### Tailwind

- [ ] Cores do Airbnb configuradas
- [ ] Border radius xlarge e medium
- [ ] Max width 2520

---

## 🔍 O QUE VOCÊ DEVE ME RESPONDER

Para CADA arquivo, me diga:

1. **Status:** ✅ Correto / ⚠️ Diferenças / ❌ Faltando
2. **Se houver diferenças:** Liste EXATAMENTE o que está diferente
3. **Código atual:** Mostre as linhas problemáticas do meu código
4. **Código esperado:** Mostre como deveria ser
5. **Sugestão de correção:** O que devo fazer para corrigir

---

## 📁 ARQUIVOS DO MEU PROJETO

Aqui estão os caminhos dos meus arquivos atuais:

```
src/
├── components/
│   ├── layout/
│   │   └── AirbnbHeader.jsx
│   └── property/
│       └── PropertyCard.jsx
├── pages/
│   └── Properties.jsx
└── tailwind.config.js
```

---

## 🎯 AÇÃO SOLICITADA

1. Leia meus arquivos nos caminhos acima
2. Compare com as especificações detalhadas
3. Me dê um relatório completo:
   - O que está correto ✅
   - O que está diferente ⚠️
   - O que está faltando ❌
4. Para cada diferença, me mostre:
   - Meu código atual
   - Código esperado
   - Como corrigir

---

## ⚡ IMPORTANTE

- Seja MUITO específico nas diferenças
- Mostre trechos de código reais
- Não assuma nada - verifique tudo
- Se algo estiver 99% certo mas 1% diferente, me avise
- Priorize as funcionalidades críticas (sticky, animação, grid)

---

Obrigado! Aguardo sua análise detalhada. 🚀
