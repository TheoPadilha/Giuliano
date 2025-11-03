# 🚀 Configuração do Google Analytics e Google Tag Manager

Este guia mostrará como configurar o Google Analytics 4 (GA4) e o Google Tag Manager (GTM) no seu site de aluguel de temporada.

---

## 📋 Pré-requisitos

Você precisará de:
1. Uma conta Google
2. Acesso ao [Google Analytics](https://analytics.google.com/)
3. Acesso ao [Google Tag Manager](https://tagmanager.google.com/)

---

## 🎯 Passo 1: Criar Propriedade no Google Analytics 4

### 1.1 Acessar Google Analytics
- Acesse https://analytics.google.com/
- Faça login com sua conta Google
- Clique em **"Administrador"** (ícone de engrenagem no canto inferior esquerdo)

### 1.2 Criar Conta (se ainda não tiver)
- Clique em **"Criar conta"**
- Nome da conta: `Giuliano Aluguel Temporada`
- Configure as opções de compartilhamento de dados conforme preferir
- Clique em **"Avançar"**

### 1.3 Criar Propriedade
- Nome da propriedade: `Site Giuliano`
- Fuso horário: `(GMT-03:00) Brasília`
- Moeda: `Real brasileiro (BRL)`
- Clique em **"Avançar"**

### 1.4 Configurar Detalhes da Empresa
- Categoria: `Imóveis`
- Tamanho da empresa: Escolha conforme seu caso
- Clique em **"Criar"**
- Aceite os termos de serviço

### 1.5 Configurar Fluxo de Dados
- Escolha **"Web"**
- URL do site: `https://seu-dominio.com.br`
- Nome do stream: `Site Principal`
- Clique em **"Criar stream"**

### 1.6 Copiar ID de Medição
- Você verá um **ID de Medição** no formato `G-XXXXXXXXXX`
- **COPIE ESTE ID** - você precisará dele no próximo passo

---

## 🏷️ Passo 2: Criar Contêiner no Google Tag Manager

### 2.1 Acessar Google Tag Manager
- Acesse https://tagmanager.google.com/
- Faça login com a mesma conta Google

### 2.2 Criar Conta
- Clique em **"Criar conta"**
- Nome da conta: `Giuliano Aluguel Temporada`
- País: `Brasil`

### 2.3 Configurar Contêiner
- Nome do contêiner: `Site Giuliano`
- Tipo de destino: **Web**
- Clique em **"Criar"**
- Aceite os termos de serviço

### 2.4 Copiar ID do GTM
- Você verá um **ID do contêiner** no formato `GTM-XXXXXXX`
- **COPIE ESTE ID** - você precisará dele no próximo passo

---

## ⚙️ Passo 3: Configurar IDs no Código

### 3.1 Abrir arquivo de configuração
Abra o arquivo:
```
frontend/src/utils/googleAnalytics.js
```

### 3.2 Substituir os IDs
Encontre estas linhas no topo do arquivo:

```javascript
export const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Seu ID do Google Analytics 4
export const GTM_ID = "GTM-XXXXXXX"; // Seu ID do Google Tag Manager
```

Substitua pelos IDs reais que você copiou:

```javascript
export const GA_MEASUREMENT_ID = "G-ABC123DEF4"; // Exemplo
export const GTM_ID = "GTM-K7H9MNP"; // Exemplo
```

### 3.3 Salvar o arquivo
Salve as alterações e o sistema estará pronto para rastrear!

---

## 🎯 Passo 4: Configurar Tags no Google Tag Manager (Opcional mas Recomendado)

### 4.1 Criar Tag do Google Analytics
- No GTM, vá em **"Tags"** > **"Nova"**
- Nome: `Google Analytics - GA4`
- Tipo de tag: **Google Analytics: Configuração do GA4**
- ID de medição: Cole seu `G-XXXXXXXXXX`
- Acionador: **All Pages** (Todas as páginas)
- Salve a tag

### 4.2 Publicar Contêiner
- Clique em **"Enviar"** no canto superior direito
- Nome da versão: `Configuração inicial`
- Descrição: `Setup do Google Analytics 4`
- Clique em **"Publicar"**

---

## ✅ Passo 5: Testar a Configuração

### 5.1 Usar o Google Analytics em Tempo Real
1. Acesse Google Analytics
2. Vá em **"Relatórios"** > **"Tempo real"**
3. Abra seu site em outra aba
4. Você deve ver sua visita aparecer em tempo real!

### 5.2 Usar a Extensão Google Tag Assistant
1. Instale a extensão [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) no Chrome
2. Abra seu site
3. Clique no ícone da extensão
4. Você deve ver os tags do GA4 e GTM funcionando

### 5.3 Testar o Banner de Cookies
1. Abra o site em uma aba anônima
2. Você deve ver o banner de cookies aparecer após 1 segundo
3. Teste os botões:
   - **Aceitar todos**: Ativa todos os cookies
   - **Rejeitar todos**: Só cookies necessários
   - **Preferências**: Permite escolher individualmente

---

## 📊 Eventos Rastreados Automaticamente

O sistema já está configurado para rastrear os seguintes eventos:

### Eventos de Página
- ✅ Visualização da Home
- ✅ Visualização da página de Propriedades
- ✅ Visualização de detalhes de propriedade

### Eventos de Busca
- ✅ Busca de propriedades (com filtros)

### Eventos de Propriedade
- ✅ Clique em propriedade
- ✅ Adição aos favoritos

### Eventos de Usuário
- ✅ Cadastro (sign_up)
- ✅ Login

### Eventos de Conversão
- ✅ Início de checkout (begin_checkout)
- ✅ Compra concluída (purchase)

---

## 🔧 Eventos Personalizados

Você pode rastrear eventos personalizados usando as funções em `googleAnalytics.js`:

### Exemplo: Rastrear clique em WhatsApp
```javascript
import { trackWhatsAppClick } from "../utils/googleAnalytics";

const handleWhatsAppClick = () => {
  trackWhatsAppClick("homepage");
  // Seu código aqui...
};
```

### Exemplo: Rastrear envio de formulário
```javascript
import { trackContactFormSubmit } from "../utils/googleAnalytics";

const handleFormSubmit = () => {
  trackContactFormSubmit("contact_page");
  // Seu código aqui...
};
```

---

## 🛡️ Conformidade com LGPD/GDPR

O sistema implementa:

### ✅ Consentimento Prévio
- Os cookies analíticos e de marketing são bloqueados até o usuário consentir
- Apenas cookies necessários são permitidos sem consentimento

### ✅ Granularidade
- O usuário pode escolher quais categorias de cookies aceitar:
  - **Necessários** (sempre ativo)
  - **Analíticos** (Google Analytics)
  - **Marketing** (Google Ads, etc)
  - **Funcionais** (recursos personalizados)

### ✅ Transparência
- Links para Política de Privacidade e Política de Cookies
- Descrição clara de cada categoria

### ✅ Controle do Usuário
- Banner não intrusivo
- Fácil acesso às preferências
- Escolhas salvas localmente

---

## 📈 Relatórios Importantes no Google Analytics

### 1. Visão Geral em Tempo Real
**Relatórios > Tempo real**
- Veja quem está no site agora
- Páginas sendo visualizadas
- Origem do tráfego

### 2. Aquisição
**Relatórios > Aquisição**
- De onde vêm seus visitantes (Google, Facebook, direto, etc)
- Campanhas de marketing

### 3. Engajamento
**Relatórios > Engajamento > Páginas e telas**
- Páginas mais visitadas
- Tempo médio na página
- Taxa de rejeição

### 4. Eventos
**Relatórios > Engajamento > Eventos**
- Todos os eventos rastreados
- Propriedades clicadas
- Buscas realizadas
- Conversões

### 5. Conversões
**Relatórios > Monetização**
- Reservas concluídas
- Valor total de transações
- Taxa de conversão

---

## 🎯 Configurar Conversões como Metas

### Marcar "purchase" como Conversão Principal
1. No Google Analytics, vá em **Configurar > Eventos**
2. Encontre o evento **"purchase"**
3. Clique em **"Marcar como conversão"**
4. Pronto! Agora você pode ver relatórios de conversão

### Outras Conversões Importantes
Marque também como conversão:
- **begin_checkout** (início de reserva)
- **generate_lead** (formulário de contato)
- **sign_up** (novos cadastros)

---

## 🆘 Solução de Problemas

### Os eventos não aparecem no Google Analytics
1. Verifique se colocou os IDs corretos no arquivo `googleAnalytics.js`
2. Aguarde até 24h - pode haver delay de processamento
3. Use o relatório "Tempo real" para ver eventos instantaneamente
4. Verifique o console do navegador (F12) para erros

### O banner de cookies não aparece
1. Limpe o localStorage: F12 > Application > Local Storage > Limpar
2. Recarregue a página em aba anônima
3. Verifique se não há erros no console

### Tags não disparam no GTM
1. Use o modo "Preview" no GTM para debug
2. Verifique se publicou o contêiner
3. Confirme que o GTM_ID está correto

---

## 📚 Recursos Úteis

- [Documentação Google Analytics 4](https://support.google.com/analytics/answer/10089681)
- [Documentação Google Tag Manager](https://support.google.com/tagmanager)
- [LGPD - Lei Geral de Proteção de Dados](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)
- [GDPR - Regulamento Geral de Proteção de Dados](https://gdpr.eu/)

---

## ✨ Próximos Passos

Agora que o Google Analytics está configurado, você pode:

1. **Criar públicos personalizados** para remarketing
2. **Configurar Google Ads** para campanhas pagas
3. **Integrar com Google Search Console** para SEO
4. **Criar dashboards personalizados** com Looker Studio
5. **Configurar alertas automáticos** para métricas importantes

---

**Última atualização:** 2025-01-25
**Versão:** 1.0
**Suporte:** Para dúvidas, consulte a documentação oficial do Google Analytics
