# 🗺️ Como Configurar Google Maps API

## ❌ Erro: "Acesso negado à API do Google Maps"

Este erro acontece quando a chave da API não está configurada corretamente.

---

## ✅ SOLUÇÃO COMPLETA

### 1️⃣ Acessar o Console do Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Selecione seu projeto (ou crie um novo)

---

### 2️⃣ Habilitar as APIs Necessárias

**⚠️ IMPORTANTE:** Você precisa habilitar **3 APIs diferentes**:

#### a) Geocoding API (para buscar coordenadas por endereço)
1. Acesse: https://console.cloud.google.com/marketplace/product/google/geocoding-backend.googleapis.com
2. Clique em **"ATIVAR"** ou **"ENABLE"**
3. Aguarde alguns segundos

#### b) Maps JavaScript API (para exibir mapas)
1. Acesse: https://console.cloud.google.com/marketplace/product/google/maps-backend.googleapis.com
2. Clique em **"ATIVAR"**

#### c) Places API (opcional, mas recomendado)
1. Acesse: https://console.cloud.google.com/marketplace/product/google/places-backend.googleapis.com
2. Clique em **"ATIVAR"**

---

### 3️⃣ Configurar a Chave da API

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Você verá sua chave: `AIzaSyDwVAIikL4zHG26pL-ljC4hssWm1lFjQ2k`
3. Clique no **ícone de lápis** (editar) ao lado da chave

---

### 4️⃣ Remover Restrições (Temporariamente)

**Para testar se funciona, vamos remover as restrições:**

1. Na seção **"Restrições de aplicativo"**:
   - Selecione: **"Nenhuma"** (None)

2. Na seção **"Restrições de API"**:
   - Selecione: **"Não restringir chave"** (Don't restrict key)

3. Clique em **"SALVAR"** (SAVE)

4. **Aguarde 2-5 minutos** para as mudanças propagarem

---

### 5️⃣ Testar a Chave

Após salvar, aguarde 2-5 minutos e teste novamente:

1. Acesse sua aplicação
2. Vá em **Adicionar Propriedade** → **Localização**
3. Preencha cidade e endereço
4. Clique em **"Buscar Coordenadas Automaticamente"**

✅ Se funcionar, ótimo! Depois você pode adicionar restrições de segurança.

---

### 6️⃣ (OPCIONAL) Adicionar Restrições de Segurança

Depois que testar e funcionar, você pode restringir a chave:

#### Restrições de Aplicativo - HTTP referrers (recomendado):

```
http://localhost:5173/*
https://giulianoa-frontend.onrender.com/*
https://ziguealuga.com/*
https://*.ziguealuga.com/*
```

#### Restrições de API (selecione apenas as APIs que você usa):
- ✅ Geocoding API
- ✅ Maps JavaScript API
- ✅ Places API (se usar)

---

## 🆘 Se ainda não funcionar:

### Verificar Faturamento

1. Acesse: https://console.cloud.google.com/billing
2. Verifique se tem uma **conta de faturamento vinculada**
3. O Google Maps tem **$200 grátis por mês**, mas precisa ter cartão cadastrado

**Como adicionar:**
1. Clique em **"Vincular uma conta de faturamento"**
2. Cadastre um cartão de crédito
3. ⚠️ Não se preocupe: você tem $200 grátis/mês (aproximadamente 40.000 geocodificações)

---

## 🔑 Sua Chave Atual

```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDwVAIikL4zHG26pL-ljC4hssWm1lFjQ2k
```

Esta chave já está configurada em:
- ✅ `frontend/.env` (desenvolvimento)
- ✅ `frontend/.env.production` (produção)

---

## 📊 Monitorar Uso

Para ver quantas requisições você está fazendo:

1. Acesse: https://console.cloud.google.com/apis/dashboard
2. Veja o gráfico de uso das APIs

---

## ⚠️ IMPORTANTE: Proteger sua Chave

**NUNCA compartilhe sua chave em:**
- ❌ Repositórios públicos do GitHub
- ❌ Fóruns ou redes sociais
- ❌ Screenshots públicas

**Se a chave vazar:**
1. Acesse: https://console.cloud.google.com/apis/credentials
2. Delete a chave antiga
3. Crie uma nova chave
4. Atualize os arquivos `.env`

---

## 📞 Links Úteis

- Console Google Cloud: https://console.cloud.google.com/
- Geocoding API: https://console.cloud.google.com/marketplace/product/google/geocoding-backend.googleapis.com
- Documentação Geocoding: https://developers.google.com/maps/documentation/geocoding
- Preços: https://mapsplatform.google.com/pricing/ ($200 grátis/mês)

---

## ✅ Checklist Final

- [ ] Geocoding API habilitada
- [ ] Maps JavaScript API habilitada
- [ ] Restrições removidas (para teste)
- [ ] Aguardou 2-5 minutos após salvar
- [ ] Testou no site
- [ ] (Opcional) Faturamento configurado
- [ ] (Opcional) Restrições de segurança adicionadas

---

**🎯 Resultado Esperado:**

Quando funcionar, você verá:
- ✅ Coordenadas preenchidas automaticamente
- ✅ Mensagem: "Coordenadas encontradas! Latitude: -26.994400, Longitude: -48.638600"
- ✅ Link para "Ver no Google Maps"
