# 🚀 Deploy Rápido no Render.com - Backend + Banco

Guia para fazer deploy de teste do backend e banco PostgreSQL no Render.

## ✅ Status Atual

- ✅ Frontend online: https://giulianoa-frontend.onrender.com
- ⏳ Backend: Vamos fazer deploy agora
- ⏳ Banco PostgreSQL: Vamos criar agora

---

## 📋 Pré-requisitos

- [x] Conta no GitHub (para conectar repositório)
- [x] Código commitado no GitHub
- [ ] Conta no Render.com (gratuito)

---

## 🎯 Parte 1: Criar Banco PostgreSQL

### 1.1 Acessar Render Dashboard

1. Acesse: https://dashboard.render.com/
2. Login com GitHub (recomendado)

### 1.2 Criar PostgreSQL Database

1. Clique em **"New +"** → **"PostgreSQL"**
2. Preencha:
   ```
   Name: giuliano-db
   Database: giuliano_alquileres
   User: giuliano_user
   Region: Oregon (US West) - mesmo do frontend
   Plan: Free
   ```
3. Clique em **"Create Database"**
4. **AGUARDE** ~ 2 minutos até status ficar "Available"

### 1.3 Copiar Credenciais

Após criado, você verá:
```
Internal Database URL: postgresql://...
External Database URL: postgresql://...
```

**⚠️ IMPORTANTE**: Copie a **Internal Database URL** - vamos usar no backend

---

## 🎯 Parte 2: Deploy do Backend

### 2.1 Criar Web Service

1. Clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub:
   - Se primeira vez: Autorize o Render a acessar seu GitHub
   - Selecione o repositório: `Giuliano` (ou nome do seu repo)

### 2.2 Configurar o Serviço

Preencha com **EXATAMENTE** esses valores:

```
Name: giuliano-backend
Region: Oregon (US West)
Branch: main
Root Directory: giuliano-alquileres/backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 2.3 Configurar Variáveis de Ambiente

Clique em **"Advanced"** → **"Add Environment Variable"**

Adicione **TODAS** essas variáveis:

```bash
# Node
NODE_ENV=production
PORT=5000

# Database (cole a URL que você copiou)
DATABASE_URL=postgresql://giuliano_user:SENHA_AQUI@...   ← Cole a Internal Database URL

# JWT (gere um segredo forte)
JWT_SECRET=giuliano_super_secret_jwt_key_2025_muito_seguro_producao

# URLs
FRONTEND_URL=https://giulianoa-frontend.onrender.com
BACKEND_URL=https://giuliano-backend.onrender.com
CORS_ORIGIN=https://giulianoa-frontend.onrender.com

# Email - Gmail (temporário para teste)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=theohenriquecp@gmail.com
SMTP_PASS=txhijxybsdagmdjb
SMTP_FROM_EMAIL=theohenriquecp@gmail.com
SMTP_FROM_NAME=Zigué Aluga
PASSWORD_RESET_TOKEN_EXPIRY=60

# Mercado Pago (credenciais de teste)
MERCADOPAGO_ACCESS_TOKEN=TEST-your-access-token-here
MERCADOPAGO_PUBLIC_KEY=TEST-your-public-key-here
```

### 2.4 Iniciar Deploy

1. Clique em **"Create Web Service"**
2. **AGUARDE** ~ 5-10 minutos para o build e deploy
3. Você verá logs em tempo real

---

## 🎯 Parte 3: Popular o Banco de Dados

### 3.1 Executar Migrations e Seeds via Shell

1. No Render Dashboard, vá até seu **giuliano-backend** service
2. Clique na aba **"Shell"**
3. Execute os comandos:

```bash
# 1. Rodar migrations (cria tabelas)
npx sequelize-cli db:migrate

# 2. Popular cidades de SC
node seed-cities.js

# 3. Verificar se funcionou
node -e "const {sequelize} = require('./models'); sequelize.authenticate().then(() => console.log('✅ DB OK')).catch(e => console.error('❌', e))"
```

### 3.2 Criar Usuário Admin

Execute no Shell:

```bash
node -e "
const { User } = require('./models');
const bcrypt = require('bcryptjs');

(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  const admin = await User.create({
    name: 'Giuliano Admin',
    email: 'admin@ziguealuga.com',
    password_hash: hash,
    phone: '+5547989105580',
    role: 'admin_master',
    status: 'active',
    country: 'Brasil'
  });
  console.log('✅ Admin criado:', admin.email);
})();
"
```

---

## 🎯 Parte 4: Atualizar Frontend

### 4.1 Configurar API URL no Frontend

No seu repositório do frontend, encontre o arquivo de configuração da API e atualize:

```javascript
// Antes (desenvolvimento)
const API_URL = 'http://localhost:5000';

// Depois (produção)
const API_URL = process.env.VITE_API_URL || 'https://giuliano-backend.onrender.com';
```

### 4.2 Adicionar Variável de Ambiente no Render (Frontend)

1. Acesse seu serviço frontend no Render: **giulianoa-frontend**
2. Vá em **"Environment"** → **"Add Environment Variable"**
3. Adicione:
   ```
   VITE_API_URL=https://giuliano-backend.onrender.com
   ```
4. Clique em **"Save Changes"**
5. O frontend vai fazer redeploy automaticamente

---

## ✅ Parte 5: Testar Sistema Online

### 5.1 Health Check do Backend

Acesse no navegador:
```
https://giuliano-backend.onrender.com/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2025-11-07T...",
  "database": "connected"
}
```

### 5.2 Testar Login

1. Acesse: https://giulianoa-frontend.onrender.com/admin/login
2. Entre com:
   ```
   Email: admin@ziguealuga.com
   Senha: admin123
   ```
3. Se logar com sucesso = ✅ TUDO FUNCIONANDO!

### 5.3 Testar Listagem de Imóveis

```
https://giuliano-backend.onrender.com/api/properties
```

Deve retornar a lista de imóveis (pode estar vazia se não criou ainda).

---

## 🐛 Troubleshooting

### Erro: "Application failed to respond"

**Causa**: Backend não iniciou corretamente

**Solução**:
1. Verifique os logs no Render Dashboard
2. Confirme que `Start Command` é: `npm start`
3. Verifique se todas as variáveis de ambiente estão configuradas

### Erro: "Database connection failed"

**Causa**: DATABASE_URL incorreta

**Solução**:
1. Copie novamente a **Internal Database URL** do PostgreSQL
2. Cole em `DATABASE_URL` (sobrescreva a antiga)
3. Clique em "Save Changes"

### Erro: "CORS policy"

**Causa**: CORS_ORIGIN não configurado

**Solução**:
1. Adicione variável:
   ```
   CORS_ORIGIN=https://giulianoa-frontend.onrender.com
   ```
2. Redeploy do backend

### Backend fica "deploying" eternamente

**Causa**: Build ou start command errado

**Solução**:
1. Verifique:
   ```
   Root Directory: giuliano-alquileres/backend
   Build Command: npm install
   Start Command: npm start
   ```
2. Clique em "Manual Deploy" → "Clear build cache & deploy"

---

## 📊 Limites do Plano Free

⚠️ **Importante saber**:

- **PostgreSQL**: 1 GB storage, 97 horas/mês
- **Web Service**: Dorme após 15min de inatividade
- **Cold start**: ~30s para "acordar" quando dorme
- **RAM**: 512 MB
- **Build time**: 500 min/mês

💡 **Para produção real**, considere upgrade para plano pago ($7/mês).

---

## 🎯 URLs Finais

Após deploy completo:

```
Frontend: https://giulianoa-frontend.onrender.com
Backend:  https://giuliano-backend.onrender.com
API Docs: https://giuliano-backend.onrender.com/health
Admin:    https://giulianoa-frontend.onrender.com/admin/login
```

---

## 🔐 Segurança para Produção

**Antes de usar em produção real:**

1. ✅ Mude `JWT_SECRET` para um valor mais forte
2. ✅ Configure SendGrid (em vez de Gmail)
3. ✅ Adicione credenciais reais do Mercado Pago
4. ✅ Ative HTTPS-only cookies
5. ✅ Configure backup do banco
6. ✅ Adicione monitoring (ex: Sentry)

---

## 📞 Próximos Passos

Após tudo funcionar:

1. [ ] Criar alguns imóveis de teste
2. [ ] Fazer uma reserva de teste
3. [ ] Testar email de confirmação
4. [ ] Testar upload de fotos
5. [ ] Configurar domínio customizado (ziguealuga.com)

---

**Última atualização**: 07/11/2025
**Versão**: 1.0 (Deploy de Teste)

---

## 🆘 Precisa de Ajuda?

- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com/
- **Render Community**: https://community.render.com/
