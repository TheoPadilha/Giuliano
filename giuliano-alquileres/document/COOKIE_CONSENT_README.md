# 🍪 Sistema de Cookie Consent e Google Analytics

## ✨ Funcionalidades Implementadas

### 1. Banner de Consentimento de Cookies (LGPD/GDPR Compliant)

Banner profissional que aparece na primeira visita ao site, permitindo que o usuário controle quais cookies aceitar.

#### Características:
- ✅ **Aparece após 1 segundo** da primeira visita
- ✅ **Design minimalista** alinhado com o tema Airbnb do site
- ✅ **Responsivo** - funciona perfeitamente em mobile e desktop
- ✅ **Dois modos**:
  - **Vista Simplificada**: Aceitar todos, Rejeitar todos ou Preferências
  - **Vista Detalhada**: Controle granular de cada categoria de cookies

#### Categorias de Cookies:

1. **Cookies Necessários**
   - Status: Sempre ativo (não pode desabilitar)
   - Uso: Funcionalidades essenciais do site

2. **Cookies Analíticos** ✓
   - Uso: Google Analytics para medir performance
   - Controle: Usuário pode aceitar/rejeitar

3. **Cookies de Marketing** ✓
   - Uso: Google Ads e remarketing
   - Controle: Usuário pode aceitar/rejeitar

4. **Cookies Funcionais** ✓
   - Uso: Recursos personalizados
   - Controle: Usuário pode aceitar/rejeitar

---

### 2. Botão Flutuante de Configurações

Após o usuário dar o consentimento inicial, um **botão flutuante com ícone de cookie** aparece no canto inferior direito da tela.

#### Características:
- ✅ Sempre acessível (exceto quando o banner está aberto)
- ✅ Posicionamento: Acima do botão do WhatsApp
- ✅ Permite reabrir as preferências a qualquer momento
- ✅ Animação suave ao hover

**Localização**: Bottom-right, 96px do fundo (24px acima do WhatsApp que está a 72px)

---

### 3. Google Analytics 4 (GA4)

Sistema completo de analytics para rastrear comportamento dos usuários.

#### Eventos Rastreados Automaticamente:

##### 📄 Visualizações de Página
- **Home** (`/`)
- **Página de Propriedades** (`/properties`)
- **Detalhes de Propriedade** (`/property/:id`)

##### 🔍 Eventos de Busca
- **property_search**: Quando o usuário busca propriedades
  - Captura: termo de busca, cidade, tipo, hóspedes, preço

##### 🏠 Eventos de Propriedade
- **select_item**: Quando o usuário clica em um card de propriedade
  - Captura: ID, título, categoria, preço, posição

- **view_item**: Quando visualiza detalhes da propriedade
  - Captura: ID, título, categoria, preço

- **add_to_wishlist**: Quando adiciona aos favoritos
  - Captura: ID, título, categoria, preço

##### 👤 Eventos de Usuário
- **sign_up**: Cadastro de novo usuário
  - Captura: método (email, Google, etc)

- **login**: Login no sistema
  - Captura: método

##### 💰 Eventos de Conversão
- **begin_checkout**: Início do processo de reserva
  - Captura: propriedade, datas, valor

- **purchase**: Reserva concluída (CONVERSÃO PRINCIPAL)
  - Captura: ID transação, valor total, detalhes da reserva

##### 📞 Outros Eventos
- **whatsapp_click**: Clique no botão do WhatsApp
  - Captura: fonte do clique

- **generate_lead**: Envio de formulário de contato
  - Captura: tipo de formulário

---

### 4. Google Tag Manager (GTM)

Container para gerenciar tags de terceiros sem modificar código.

#### Benefícios:
- ✅ Fácil adicionar Google Ads, Facebook Pixel, etc
- ✅ Modo Preview para debug
- ✅ Versionamento de mudanças
- ✅ Controle de quando tags disparam

---

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:

```
frontend/src/
├── components/common/
│   ├── CookieConsent.jsx          # Banner de cookies (365 linhas)
│   └── CookieSettingsButton.jsx   # Botão flutuante
│
└── utils/
    └── googleAnalytics.js         # Funções de tracking (250 linhas)

GOOGLE_ANALYTICS_SETUP.md         # Guia completo de configuração
COOKIE_CONSENT_README.md           # Este arquivo
```

### Arquivos Modificados:

```
frontend/src/
├── App.jsx                        # Adicionado CookieConsent e init do GA
├── pages/
│   ├── Home.jsx                   # Tracking de page view
│   └── Properties.jsx             # Tracking de page view e search
│
└── components/property/
    └── PropertyCard.jsx           # Tracking de cliques e favoritos
```

---

## 🚀 Como Funciona

### Fluxo do Usuário:

1. **Primeira Visita**
   - Usuário entra no site
   - Após 1 segundo, o banner de cookies aparece
   - Google Analytics está BLOQUEADO até dar consentimento

2. **Escolha do Usuário**

   **Opção A - Aceitar Todos:**
   - Todos os cookies são ativados imediatamente
   - Google Analytics começa a rastrear
   - Banner desaparece
   - Botão flutuante aparece

   **Opção B - Rejeitar Todos:**
   - Apenas cookies necessários são ativados
   - Google Analytics permanece bloqueado
   - Banner desaparece
   - Botão flutuante aparece

   **Opção C - Preferências:**
   - Abre painel detalhado
   - Usuário escolhe categoria por categoria
   - Salva preferências personalizadas
   - Banner desaparece
   - Botão flutuante aparece

3. **Visitas Futuras**
   - Preferências são carregadas do localStorage
   - Banner NÃO aparece
   - Botão flutuante SEMPRE disponível
   - Cookies ativados conforme preferências salvas

4. **Mudança de Preferências**
   - Clica no botão flutuante
   - Banner reabre em modo de preferências
   - Altera escolhas
   - Salva novamente

---

## 🔧 Configuração Necessária

### Passo 1: Criar Conta Google Analytics

Acesse: https://analytics.google.com/

1. Crie uma propriedade GA4
2. Configure um Web Data Stream
3. Copie o **Measurement ID** (formato: `G-XXXXXXXXXX`)

### Passo 2: Criar Conta Google Tag Manager

Acesse: https://tagmanager.google.com/

1. Crie um contêiner
2. Copie o **Container ID** (formato: `GTM-XXXXXXX`)

### Passo 3: Configurar IDs no Código

Edite o arquivo:
```
frontend/src/utils/googleAnalytics.js
```

Substitua nas linhas 4-5:
```javascript
export const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // COLE SEU ID AQUI
export const GTM_ID = "GTM-XXXXXXX"; // COLE SEU ID AQUI
```

### Passo 4: Testar

1. Abra o site em aba anônima
2. Você deve ver o banner de cookies
3. Aceite cookies analíticos
4. No Google Analytics > Tempo Real, você deve ver sua visita

**📚 Guia Completo**: Consulte `GOOGLE_ANALYTICS_SETUP.md` para instruções detalhadas

---

## 🎨 Personalização Visual

### Cores do Banner:

O banner usa as cores do tema Airbnb do site:

```css
rausch: #FF385C          /* Botões primários */
airbnb-grey-600: #484848 /* Textos */
airbnb-grey-200: #DDDDDD /* Bordas */
white: #FFFFFF           /* Fundo */
```

### Modificar Cores:

Edite `CookieConsent.jsx` e altere as classes do Tailwind:

```jsx
// Exemplo: Mudar cor do botão "Aceitar todos"
className="bg-rausch"  // Trocar para bg-blue-600, bg-green-500, etc
```

### Modificar Textos:

Todos os textos estão em português e podem ser editados diretamente em `CookieConsent.jsx`:

- Linhas 124-132: Vista simplificada
- Linhas 181-305: Vista de preferências detalhadas
- Linhas 311-320: Links de política

---

## 📊 Relatórios Importantes no Google Analytics

### 1. Tempo Real
**Caminho**: Relatórios > Tempo real

Veja quem está no site AGORA:
- Visitantes ativos
- Páginas sendo visualizadas
- Eventos acontecendo

### 2. Aquisição
**Caminho**: Relatórios > Aquisição > Visão geral da aquisição de usuários

De onde vêm seus visitantes:
- Google orgânico
- Facebook/Instagram
- Direto (digitando URL)
- Referral (outros sites)

### 3. Engajamento
**Caminho**: Relatórios > Engajamento > Eventos

Todos os eventos customizados:
- property_search (buscas)
- select_item (cliques em propriedades)
- add_to_wishlist (favoritos)
- begin_checkout (inícios de reserva)
- purchase (conversões!)

### 4. Conversões
**Caminho**: Relatórios > Monetização > Visão geral do e-commerce

Dados de vendas:
- Total de reservas
- Receita gerada
- Taxa de conversão
- Valor médio de transação

---

## 🛡️ Conformidade com LGPD

O sistema implementa todos os requisitos da LGPD:

### ✅ Consentimento Prévio
- Cookies não-essenciais bloqueados até consentimento
- Usuário deve tomar ação ativa

### ✅ Granularidade
- Controle categoria por categoria
- Não é "tudo ou nada"

### ✅ Transparência
- Descrição clara de cada categoria
- Links para políticas de privacidade
- Informação sobre parceiros (Google)

### ✅ Revogação Fácil
- Botão sempre acessível
- Mudança de preferências a qualquer momento
- Sem burocracia

### ✅ Armazenamento Local
- Preferências salvas no localStorage
- Não envia dados de consentimento para servidor
- Privacidade do usuário respeitada

---

## 🔒 Privacidade e Segurança

### Modo de Consentimento do Google

O sistema usa o **Consent Mode** do Google Analytics:

```javascript
gtag("consent", "default", {
  analytics_storage: "denied",      // Bloqueado por padrão
  ad_storage: "denied",             // Bloqueado por padrão
  ad_user_data: "denied",           // Bloqueado por padrão
  ad_personalization: "denied",     // Bloqueado por padrão
});
```

Apenas após consentimento:
```javascript
gtag("consent", "update", {
  analytics_storage: "granted",     // Ativado!
});
```

### Dados Coletados (com consentimento)

**Google Analytics coleta**:
- Páginas visitadas
- Tempo na página
- Cliques em propriedades
- Buscas realizadas
- Conversões (reservas)

**Google Analytics NÃO coleta**:
- Senhas
- Dados de cartão de crédito
- Informações pessoais sensíveis
- Conversas privadas

---

## 📱 Responsividade

O banner de cookies é totalmente responsivo:

### Desktop (> 1024px)
- Layout horizontal
- Botões lado a lado
- Painel de preferências com 2 colunas

### Tablet (768px - 1024px)
- Layout misto
- Alguns botões empilham
- Painel de preferências com 1 coluna

### Mobile (< 768px)
- Layout vertical
- Todos os botões empilhados
- Texto otimizado
- Touch-friendly (botões maiores)

---

## 🧪 Testes

### Testar Banner de Cookies

1. **Limpar dados**:
   - F12 > Application > Local Storage
   - Delete "cookieConsent"
   - Recarregue a página

2. **Verificar aparição**:
   - Banner deve aparecer após 1 segundo
   - Deve ter 3 botões: Preferências, Rejeitar, Aceitar

3. **Testar funcionalidades**:
   - Clicar em "Preferências" abre painel detalhado
   - Toggles funcionam (exceto "Necessários")
   - "Salvar preferências" fecha o banner
   - "Aceitar todos" ativa tudo

4. **Verificar persistência**:
   - Recarregue a página
   - Banner NÃO deve aparecer
   - Botão flutuante deve estar visível

### Testar Google Analytics

1. **Com consentimento negado**:
   - Rejeite todos os cookies
   - F12 > Console
   - Não deve haver chamadas para google-analytics.com

2. **Com consentimento dado**:
   - Aceite cookies analíticos
   - F12 > Console
   - Deve ver "✅ Google Analytics inicializado"
   - Deve ver "📊 Página rastreada: /"

3. **Testar eventos**:
   - Vá para /properties
   - Console deve mostrar: "📊 Página rastreada: /properties"
   - Clique em uma propriedade
   - Console deve mostrar: "📊 Evento rastreado: select_item"

4. **Verificar no GA**:
   - Google Analytics > Tempo Real
   - Você deve aparecer como visitante ativo
   - Eventos devem aparecer em tempo real

---

## 🚨 Troubleshooting

### Banner não aparece

**Possível causa**: Você já deu consentimento antes

**Solução**:
```
1. F12 > Application > Local Storage
2. Delete a chave "cookieConsent"
3. Recarregue a página
```

### Eventos não aparecem no GA

**Possível causa 1**: IDs incorretos

**Solução**:
```
Verifique em frontend/src/utils/googleAnalytics.js
GA_MEASUREMENT_ID deve estar no formato G-XXXXXXXXXX
GTM_ID deve estar no formato GTM-XXXXXXX
```

**Possível causa 2**: Cookies bloqueados

**Solução**:
```
1. Limpe localStorage
2. Recarregue o site
3. Aceite cookies analíticos
4. Teste novamente
```

**Possível causa 3**: Delay do GA

**Solução**:
```
Eventos podem demorar até 24h para aparecer em relatórios
Use "Tempo Real" para ver eventos instantaneamente
```

### Botão flutuante não aparece

**Possível causa**: Você ainda não deu consentimento

**Solução**:
```
O botão só aparece DEPOIS de aceitar ou rejeitar cookies
Dê consentimento primeiro (qualquer opção)
```

---

## 📈 Métricas Importantes

### KPIs para Acompanhar:

1. **Taxa de Aceitação de Cookies**
   - Meta: > 60% aceitam cookies analíticos
   - Como medir: Manualmente ou criar evento customizado

2. **Taxa de Conversão (Reservas)**
   - Meta: 2-5% dos visitantes fazem reserva
   - Como medir: GA > Monetização > E-commerce

3. **Páginas Mais Visitadas**
   - Meta: Identificar propriedades populares
   - Como medir: GA > Engajamento > Páginas

4. **Origem do Tráfego**
   - Meta: Entender de onde vêm os visitantes
   - Como medir: GA > Aquisição

5. **Tempo Médio no Site**
   - Meta: > 3 minutos (indica engajamento)
   - Como medir: GA > Engajamento > Visão geral

---

## 🔮 Próximos Passos

Possíveis melhorias futuras:

1. **Google Ads Integration**
   - Campanhas de remarketing
   - Anúncios segmentados

2. **Facebook Pixel**
   - Rastreamento para Facebook Ads
   - Audiências customizadas

3. **Hotjar ou Crazy Egg**
   - Mapas de calor
   - Gravações de sessão
   - Feedback de usuários

4. **A/B Testing**
   - Google Optimize
   - Testar variações de páginas

5. **Email Marketing Integration**
   - Mailchimp ou SendGrid
   - Rastrear conversões de email

---

## 📞 Suporte

Para mais informações:

- **Documentação GA4**: https://support.google.com/analytics/answer/10089681
- **Documentação GTM**: https://support.google.com/tagmanager
- **LGPD**: https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd

---

**Desenvolvido com ❤️ para Giuliano Aluguel Temporada**

**Última atualização**: 2025-10-25
**Versão**: 1.0.0
**Status**: ✅ Produção
