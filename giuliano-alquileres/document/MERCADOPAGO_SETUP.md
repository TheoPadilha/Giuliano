# 💳 Setup do Mercado Pago - Giuliano Alquileres

## 📋 Guia Completo de Configuração

Este guia vai te ajudar a configurar o Mercado Pago no projeto do zero.

---

## 🎯 PASSO 1: Criar Conta no Mercado Pago

1. Acesse: https://www.mercadopago.com.br
2. Clique em **"Criar conta"**
3. Preencha seus dados pessoais/da empresa
4. Verifique seu email
5. Complete o cadastro

---

## 🔑 PASSO 2: Obter Credenciais de TESTE

### 2.1. Acessar o Painel de Desenvolvedores

1. Faça login no Mercado Pago
2. Acesse: https://www.mercadopago.com.br/developers/panel/app
3. Clique em **"Suas integrações"**
4. Clique em **"Criar aplicação"**

### 2.2. Criar Aplicação

1. **Nome da aplicação:** Giuliano Alquileres
2. **Modelo de integração:** Checkout Pro
3. **Produto ou serviço:** Plataforma de aluguel de imóveis
4. Clique em **"Criar aplicação"**

### 2.3. Copiar Credenciais de TESTE

Na página da aplicação, você verá:

```
📋 Credenciais de teste
Access Token: TEST-1234567890-abcdef-...
Public Key:   TEST-abcdef-1234-...
```

**IMPORTANTE:** Use as credenciais de **TESTE** para desenvolvimento!

### 2.4. Adicionar no `.env` do Backend

Abra o arquivo `backend/.env` e cole suas credenciais:

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-abcdef-seu-token-aqui
MERCADOPAGO_PUBLIC_KEY=TEST-abcdef-1234-sua-public-key-aqui
```

---

## 👤 PASSO 3: Criar Usuários de Teste

Para testar pagamentos, você precisa de usuários falsos.

### 3.1. Acessar Usuários de Teste

1. No painel: https://www.mercadopago.com.br/developers/panel/app
2. Menu lateral: **"Suas integrações"** > **"Contas de teste"**
3. Clique em **"Criar nova conta"**

### 3.2. Criar Usuário Pagador (quem vai pagar)

```
País: Brasil
Valor disponível: R$ 5.000,00 (ou quanto quiser)
```

Clique em **"Criar conta de teste"**

Você receberá:
- Email: `test_user_123456@testuser.com`
- Senha: `qatest1234`

### 3.3. Criar Usuário Vendedor (você)

Repita o processo para criar um segundo usuário de teste.

---

## 💳 PASSO 4: Testar Pagamentos

### 4.1. Cartões de Teste do Mercado Pago

Use estes cartões para testar diferentes cenários:

#### ✅ PAGAMENTO APROVADO
```
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: APRO (qualquer nome)
CPF: Qualquer CPF válido
```

#### ❌ PAGAMENTO REJEITADO
```
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: OTHE (importante!)
CPF: Qualquer CPF válido
```

#### ⏳ PAGAMENTO PENDENTE
```
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: CONT (importante!)
CPF: Qualquer CPF válido
```

**Lista completa:** https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards

---

## 🔔 PASSO 5: Configurar Webhook (Notificações)

O webhook permite que o Mercado Pago avise seu backend quando um pagamento for aprovado/rejeitado.

### 5.1. Durante o Desenvolvimento (Local)

Para testar localmente, você precisa expor seu `localhost` para a internet. Use o **ngrok**:

#### Instalar ngrok:
```bash
# Windows (com Chocolatey)
choco install ngrok

# macOS (com Homebrew)
brew install ngrok

# Linux
sudo snap install ngrok
```

#### Expor seu backend:
```bash
ngrok http 5000
```

Você receberá uma URL pública:
```
https://abc123.ngrok.io
```

#### Configurar no `.env`:
```env
BACKEND_URL=https://abc123.ngrok.io
```

### 5.2. Cadastrar Webhook no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Selecione sua aplicação
3. Vá em **"Webhooks"**
4. Clique em **"Configurar"**
5. Cole a URL:
   ```
   https://abc123.ngrok.io/api/payments/webhook
   ```
6. Selecione os eventos:
   - ☑️ Pagamentos
   - ☑️ Merchant Orders
7. Clique em **"Salvar"**

### 5.3. Em Produção (Render/Heroku)

Quando você fizer deploy, use a URL real:
```
https://seu-backend.onrender.com/api/payments/webhook
```

---

## 🚀 PASSO 6: Testar o Fluxo Completo

### 6.1. Iniciar o Backend
```bash
cd backend
npm start
```

### 6.2. Iniciar o Frontend
```bash
cd frontend
npm run dev
```

### 6.3. Fazer uma Reserva

1. Acesse: http://localhost:5173
2. Faça login ou crie uma conta
3. Escolha uma propriedade
4. Selecione datas e hóspedes
5. Clique em **"Reservar"**
6. Você será levado para a página de pagamento

### 6.4. Pagar com Cartão de Teste

1. Na página de checkout do Mercado Pago
2. Use o cartão de teste **APRO** (aprovação)
3. Complete o pagamento

### 6.5. Verificar Resultado

- ✅ Reserva deve mudar status para **"confirmed"**
- ✅ Pagamento deve aparecer no banco como **"approved"**
- ✅ Webhook deve ter sido chamado (verifique logs do backend)

---

## 🔐 PASSO 7: Ir para Produção

### 7.1. Completar Perfil Mercado Pago

Antes de usar credenciais de produção:
1. Complete seus dados fiscais (CPF/CNPJ)
2. Adicione informações bancárias para receber
3. Aguarde aprovação (pode levar 24-48h)

### 7.2. Obter Credenciais de Produção

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Selecione sua aplicação
3. Clique em **"Credenciais de produção"**
4. Copie o **Access Token** e **Public Key**

### 7.3. Atualizar `.env` de Produção

No Render/Heroku, configure as variáveis:
```env
MERCADOPAGO_ACCESS_TOKEN=APP-1234567890-produção-seu-token
MERCADOPAGO_PUBLIC_KEY=APP-abcdef-produção-sua-key
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com
BACKEND_URL=https://api.seu-dominio.com
```

### 7.4. Recadastrar Webhook

Use a URL de produção no painel do Mercado Pago:
```
https://api.seu-dominio.com/api/payments/webhook
```

---

## 📊 PASSO 8: Monitorar Pagamentos

### 8.1. Painel do Mercado Pago

Acesse: https://www.mercadopago.com.br/activities

Você pode ver:
- 💰 Pagamentos recebidos
- 📅 Histórico de transações
- 💳 Detalhes de cada pagamento
- 📈 Relatórios financeiros

### 8.2. No Seu Backend

Você pode consultar pagamentos via API:

```bash
# Listar meus pagamentos
GET /api/payments/my

# Ver detalhes de um pagamento
GET /api/payments/:uuid
```

---

## 🎯 Checklist Final

Antes de lançar em produção:

- [ ] Credenciais de TESTE funcionando
- [ ] Webhook testado com ngrok
- [ ] Cartões de teste aprovando/rejeitando
- [ ] Reservas sendo confirmadas automaticamente
- [ ] Perfil Mercado Pago completo
- [ ] Credenciais de PRODUÇÃO obtidas
- [ ] Webhook de produção cadastrado
- [ ] Variáveis de ambiente de produção configuradas
- [ ] Pagamentos reais testados (com valor baixo)
- [ ] Sistema de reembolso testado

---

## 🆘 Troubleshooting

### Erro: "Invalid access_token"
❌ **Problema:** Token inválido ou expirado
✅ **Solução:** Verifique se copiou o token completo do painel

### Webhook não está sendo chamado
❌ **Problema:** MP não consegue acessar seu backend
✅ **Solução:**
- Verifique se o ngrok está rodando
- Confirme se a URL do webhook está correta
- Veja os logs do webhook no painel do MP

### Pagamento não aparece no banco
❌ **Problema:** Webhook falhou ou não foi processado
✅ **Solução:**
- Verifique logs do backend
- Confirme se a tabela `payments` foi criada
- Teste manualmente: `POST /api/payments/webhook`

### "external_reference" não encontrado
❌ **Problema:** Reserva não está vinculada ao pagamento
✅ **Solução:**
- Verifique se está passando `booking_id` ao criar preferência
- Confirme formato: `booking-123`

---

## 📚 Links Úteis

- 📖 Documentação Oficial: https://www.mercadopago.com.br/developers/pt/docs
- 💳 Cartões de Teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards
- 🔔 Webhooks: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
- 🆘 Suporte: https://www.mercadopago.com.br/developers/pt/support
- 📊 Painel: https://www.mercadopago.com.br/developers/panel/app

---

## 💰 Taxas do Mercado Pago

### Taxas por Transação:
- 💳 Cartão de Crédito: ~4,99% + R$ 0,39
- 💰 PIX: ~0,99%
- 🎫 Boleto: R$ 3,49 fixo

### Prazos de Recebimento:
- PIX: Imediato
- Cartão de Crédito: 14 dias (pode antecipar por taxa)
- Boleto: 2 dias úteis após compensação

---

**🎉 Pronto! Seu sistema de pagamento está configurado!**

**Dúvidas?** Consulte a documentação oficial do Mercado Pago ou entre em contato com o suporte.

---

**Desenvolvido com 💙 para Giuliano Alquileres**
**Data:** 17/01/2025
