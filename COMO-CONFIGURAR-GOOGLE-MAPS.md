# Como Configurar Google Maps API - Guia Completo

## O Erro que você está vendo:

```
Erro no Cadastro
Acesso negado à API do Google Maps. Verifique a chave da API ou entre em contato com o suporte.
```

Isso acontece porque a chave API precisa ter as APIs corretas habilitadas no Google Cloud.

---

## SOLUÇÃO RÁPIDA (Passo a Passo)

### PASSO 1: Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Se for sua primeira vez, aceite os termos

### PASSO 2: Criar ou Selecionar um Projeto

**Se você NÃO tem projeto:**
1. Clique em "Select a project" no topo
2. Clique em "NEW PROJECT"
3. Nome do projeto: `Ziguealuga` (ou o nome que preferir)
4. Clique em "CREATE"
5. Aguarde alguns segundos e selecione o projeto criado

**Se você JÁ tem um projeto:**
1. Clique em "Select a project" no topo
2. Selecione seu projeto existente

### PASSO 3: Habilitar as APIs Necessárias

Você precisa habilitar **2 APIs**:

#### 3.1 - Habilitar Geocoding API

1. No menu lateral, vá em: **APIs & Services** → **Library**
2. Na busca, digite: `Geocoding API`
3. Clique em **Geocoding API**
4. Clique no botão azul **ENABLE** (Ativar)
5. Aguarde a ativação

#### 3.2 - Habilitar Maps JavaScript API (Opcional, mas recomendado)

1. Volte para **Library**
2. Na busca, digite: `Maps JavaScript API`
3. Clique em **Maps JavaScript API**
4. Clique no botão azul **ENABLE** (Ativar)
5. Aguarde a ativação

### PASSO 4: Criar/Verificar sua API Key

1. No menu lateral, vá em: **APIs & Services** → **Credentials**
2. Clique em **+ CREATE CREDENTIALS** no topo
3. Selecione **API Key**
4. Uma janela vai aparecer com sua chave - **COPIE ESSA CHAVE!**
5. Clique em **RESTRICT KEY** para configurar (IMPORTANTE para segurança)

### PASSO 5: Configurar Restrições da API Key (IMPORTANTE!)

Depois de criar a chave, você vai estar na página de edição da key:

#### 5.1 - Aba "API restrictions"

1. Selecione: **Restrict key**
2. Marque APENAS essas APIs:
   - ☑️ Geocoding API
   - ☑️ Maps JavaScript API (se você habilitou)
3. Clique em **SAVE** no final da página

#### 5.2 - Aba "Application restrictions" (Para desenvolvimento local)

**Para TESTAR LOCALMENTE (localhost):**
1. Selecione: **HTTP referrers (web sites)**
2. Adicione estes referrers:
   ```
   http://localhost:*
   http://127.0.0.1:*
   ```
3. Clique em **SAVE**

**Para PRODUÇÃO (quando for fazer deploy):**
1. Selecione: **HTTP referrers (web sites)**
2. Adicione seus domínios:
   ```
   https://ziguealuga.com/*
   https://www.ziguealuga.com/*
   https://api.ziguealuga.com/*
   http://localhost:*
   ```
3. Clique em **SAVE**

### PASSO 6: Adicionar a Chave no seu Projeto

1. Copie sua API Key do Google Cloud Console
2. Abra o arquivo: `giuliano-alquileres/frontend/.env`
3. Substitua a linha da chave:

```env
VITE_GOOGLE_MAPS_API_KEY=SUA_CHAVE_COPIADA_AQUI
```

4. Salve o arquivo

### PASSO 7: Reiniciar o Frontend

**IMPORTANTE:** Você PRECISA reiniciar o servidor de desenvolvimento!

1. Pare o servidor (Ctrl+C no terminal onde o frontend está rodando)
2. Inicie novamente:

```bash
cd giuliano-alquileres/frontend
npm run dev
```

### PASSO 8: Testar

1. Acesse o sistema
2. Vá em criar novo imóvel
3. Preencha endereço e cidade
4. Clique em "Buscar Coordenadas no Mapa"
5. Deve funcionar agora! ✅

---

## Se AINDA der erro:

### Erro 1: "REQUEST_DENIED"

**Causa:** APIs não habilitadas ou restrições muito rigorosas

**Solução:**
1. Verifique se as APIs estão habilitadas (Passo 3)
2. Remova temporariamente as restrições de HTTP referrer
3. Teste novamente
4. Adicione as restrições novamente depois

### Erro 2: "OVER_QUERY_LIMIT"

**Causa:** Você excedeu a cota gratuita (improvável no início)

**Solução:**
1. Google dá $200 de crédito gratuito por mês
2. Verifique sua fatura em: https://console.cloud.google.com/billing
3. Pode precisar adicionar um método de pagamento (não será cobrado se ficar dentro do free tier)

### Erro 3: "INVALID_REQUEST"

**Causa:** Endereço mal formatado

**Solução:**
1. Certifique-se que o endereço está completo
2. Certifique-se que selecionou uma cidade

### Erro 4: Chave não funciona

**Causa:** Variável de ambiente não carregou

**Solução:**
1. Certifique-se que o arquivo `.env` está na raiz da pasta `frontend`
2. Certifique-se que a chave começa com `VITE_`
3. Reinicie o servidor (Ctrl+C e `npm run dev` novamente)
4. Limpe o cache do navegador (Ctrl+Shift+R)

---

## Verificar se está funcionando

Abra o console do navegador (F12) e execute:

```javascript
console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
```

Deve mostrar sua chave API. Se mostrar `undefined`, significa que a variável não está sendo carregada.

---

## Custos do Google Maps

### Free Tier (Grátis):
- Google dá **$200 de crédito grátis por mês**
- Geocoding API: $5 por 1000 requisições
- Com $200, você tem **40.000 requisições grátis por mês**

Para um projeto pequeno/médio, você não vai pagar nada! 🎉

Se precisar economizar mais:
1. Implemente cache das coordenadas no banco
2. Valide os endereços antes de fazer a requisição

---

## Alternativa: Usar Backend para Geocoding

Se você NÃO quiser usar o Google Maps no frontend, posso te ajudar a criar um endpoint no backend que faz a geocodificação. Assim a chave fica secreta no servidor.

Quer que eu crie essa alternativa? É mais seguro e econômico!

---

## Checklist Final

- [ ] Projeto criado no Google Cloud Console
- [ ] Geocoding API habilitada
- [ ] API Key criada
- [ ] Restrições configuradas (API restrictions)
- [ ] Chave adicionada no arquivo .env
- [ ] Frontend reiniciado
- [ ] Testado e funcionando

---

**Se seguiu todos os passos e ainda não funciona, me chame e me diga qual erro específico está aparecendo no console do navegador (F12 → Console).**
