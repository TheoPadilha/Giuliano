# Configuração do Google Maps API

Este documento explica como obter e configurar a chave da API do Google Maps para o projeto Ziguealuga.

## Por que precisamos do Google Maps?

O Google Maps é usado para:
- Permitir que proprietários marquem a localização exata dos imóveis no mapa durante o cadastro
- Exibir a localização dos imóveis na página de detalhes
- Buscar endereços automaticamente com o Autocomplete
- Fornecer visualização interativa do mapa com marcadores

## Como obter a chave da API do Google Maps

### Passo 1: Criar uma conta Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Faça login com sua conta Google
3. Aceite os termos de serviço se solicitado

### Passo 2: Criar um novo projeto

1. No canto superior esquerdo, clique no seletor de projetos
2. Clique em **"Novo Projeto"**
3. Digite um nome para o projeto (ex: "Ziguealuga")
4. Clique em **"Criar"**

### Passo 3: Ativar a API do Google Maps

1. No menu lateral, vá em **"APIs e serviços"** → **"Biblioteca"**
2. Procure e ative as seguintes APIs:
   - **Maps JavaScript API** (obrigatória)
   - **Places API** (obrigatória - para autocomplete de endereços)
   - **Geocoding API** (obrigatória - para conversão de coordenadas em endereços)

### Passo 4: Criar credenciais da API

1. No menu lateral, vá em **"APIs e serviços"** → **"Credenciais"**
2. Clique em **"Criar credenciais"** → **"Chave de API"**
3. Sua chave será criada e exibida
4. **IMPORTANTE:** Clique em **"Restringir chave"** para configurar restrições

### Passo 5: Configurar restrições (IMPORTANTE para segurança)

#### Restrições de aplicativo:
1. Selecione **"Referenciadores HTTP (sites)"**
2. Adicione seus domínios:
   ```
   localhost:*
   seu-dominio.com/*
   *.seu-dominio.com/*
   ```

#### Restrições de API:
1. Selecione **"Restringir chave"**
2. Marque as APIs que habilitou:
   - Maps JavaScript API
   - Places API
   - Geocoding API

3. Clique em **"Salvar"**

### Passo 6: Configurar faturamento (obrigatório)

O Google Maps exige um cartão de crédito cadastrado, mas oferece:
- **$200 de créditos gratuitos por mês**
- Uso típico de um site pequeno/médio fica dentro do limite gratuito
- Você só é cobrado se ultrapassar os $200/mês

1. No menu lateral, vá em **"Faturamento"**
2. Clique em **"Vincular uma conta de faturamento"**
3. Siga as instruções para cadastrar seu cartão

## Como configurar a chave no projeto

### 1. Copie sua chave da API

No Google Cloud Console, copie a chave que você criou.

### 2. Configure no arquivo .env

No arquivo `giuliano-alquileres/frontend/.env`, adicione:

```env
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

**Exemplo:**
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Reinicie o servidor de desenvolvimento

```bash
cd giuliano-alquileres/frontend
npm run dev
```

## Como usar o Google Maps no projeto

### Para proprietários (cadastro de imóveis)

Ao cadastrar um novo imóvel, os proprietários verão:

1. **Campo de busca de endereço**: Digite o endereço e selecione da lista
2. **Mapa interativo**: Clique no mapa para marcar a localização exata
3. **Marcador arrastável**: Arraste o marcador para ajustar a posição
4. **Coordenadas**: Latitude e longitude são salvos automaticamente

### Para visitantes (visualização de imóveis)

Na página de detalhes do imóvel, os visitantes verão:

1. **Mapa da localização**: Mostra a área aproximada do imóvel
2. **Endereço**: Exibe o endereço cadastrado
3. **Botão "Abrir no Google Maps"**: Link direto para o Google Maps

## Testando sem a chave da API

Se você não configurar a chave da API, o sistema continuará funcionando:
- Uma mensagem amigável será exibida no lugar do mapa
- O endereço em texto ainda será mostrado
- Todas as outras funcionalidades continuam operando normalmente

## Custos estimados

### Uso gratuito mensal (incluído nos $200):
- **Maps JavaScript API**: 28.000 carregamentos de mapa
- **Places API (Autocomplete)**: 1.000 solicitações
- **Geocoding API**: 40.000 solicitações

### Para um site com 1.000 visualizações/dia:
- ~30.000 carregamentos de mapa/mês
- ~3.000 buscas de endereço/mês
- **Custo estimado**: $10-20/mês (bem abaixo dos $200 gratuitos)

## Segurança

### Boas práticas:

✅ **SEMPRE restringir a chave por domínio**
✅ **SEMPRE restringir quais APIs podem usar a chave**
✅ **Configurar alertas de uso no Google Cloud**
✅ **Monitorar o uso mensal**

❌ **NUNCA compartilhar a chave publicamente**
❌ **NUNCA commitar o arquivo .env no git**
❌ **NUNCA usar a chave sem restrições**

## Resolução de problemas

### Erro: "This API key is not authorized to use this service"
- Verifique se você ativou todas as APIs necessárias
- Confirme que a restrição de API inclui as APIs que está usando

### Erro: "RefererNotAllowedMapError"
- Adicione seu domínio/localhost nas restrições HTTP
- Use o formato correto: `localhost:*` ou `*.seu-dominio.com/*`

### Mapa não carrega, mas não há erro
- Aguarde 5-10 minutos após criar/modificar a chave
- Limpe o cache do navegador
- Verifique se o faturamento está ativo

## Links úteis

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Preços do Google Maps](https://cloud.google.com/maps-platform/pricing)
- [Calculadora de custos](https://mapsplatformtransition.withgoogle.com/calculator)

## Suporte

Se encontrar problemas, verifique:
1. A chave está corretamente configurada no .env
2. O servidor foi reiniciado após adicionar a chave
3. As APIs estão ativadas no Google Cloud Console
4. O faturamento está ativo
5. As restrições estão configuradas corretamente
