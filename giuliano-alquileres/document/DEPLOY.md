# 🚀 Guia de Deploy - Ziguealuga.com

Este documento contém instruções para fazer deploy da aplicação Ziguealuga no domínio **ziguealuga.com**.

## 📋 Pré-requisitos

- Domínio: **ziguealuga.com** configurado e registrado
- Conta em um provedor de hospedagem (Recomendações abaixo)
- Banco de dados PostgreSQL configurado
- Credenciais do Mercado Pago (produção)
- Credenciais de email SMTP

---

## 🏗️ Arquitetura de Deploy

```
ziguealuga.com (Frontend - Vercel/Netlify)
    ↓
api.ziguealuga.com (Backend - Render/Railway)
    ↓
PostgreSQL Database (Render/Railway/Supabase)
```

---

## 🌐 Opção 1: Deploy Recomendado (Render + Vercel)

### Backend (API) - Render.com

1. **Criar conta no Render**: https://render.com

2. **Criar novo Web Service**:
   - Conecte seu repositório GitHub
   - Selecione a pasta `/backend`
   - Nome: `ziguealuga-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Configurar Variáveis de Ambiente**:
   ```bash
   NODE_ENV=production
   PORT=5000

   # Database (fornecido automaticamente se usar PostgreSQL do Render)
   DATABASE_URL=postgresql://...

   # JWT (gere uma nova chave segura)
   JWT_SECRET=sua_chave_super_segura_aqui

   # CORS
   CORS_ORIGIN=https://ziguealuga.com,https://www.ziguealuga.com

   # URLs
   FRONTEND_URL=https://ziguealuga.com
   BACKEND_URL=https://api.ziguealuga.com

   # Email
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=contato@ziguealuga.com
   SMTP_PASS=sua_senha_app
   EMAIL_FROM=noreply@ziguealuga.com

   # Mercado Pago (PRODUÇÃO)
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
   MERCADOPAGO_PUBLIC_KEY=APP_USR-...
   BETA_MODE=false
   ```

4. **Criar PostgreSQL Database**:
   - No Render Dashboard, crie um PostgreSQL Database
   - Copie a `DATABASE_URL` e adicione às variáveis de ambiente

5. **Configurar Domínio Customizado**:
   - No Render, vá em Settings → Custom Domains
   - Adicione: `api.ziguealuga.com`
   - Adicione os registros DNS no seu provedor de domínio:
     ```
     Tipo: CNAME
     Nome: api
     Valor: [fornecido pelo Render]
     ```

### Frontend - Vercel

1. **Criar conta no Vercel**: https://vercel.com

2. **Importar Projeto**:
   - Conecte seu repositório GitHub
   - Selecione a pasta `/frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configurar Variáveis de Ambiente**:
   ```bash
   VITE_API_URL=https://api.ziguealuga.com
   VITE_UPLOADS_URL=https://api.ziguealuga.com/uploads
   NODE_ENV=production
   VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps
   VITE_BETA_MODE=false
   ```

4. **Configurar Domínio**:
   - No Vercel Dashboard, vá em Settings → Domains
   - Adicione: `ziguealuga.com` e `www.ziguealuga.com`
   - Configure os registros DNS:
     ```
     # Para ziguealuga.com
     Tipo: A
     Nome: @
     Valor: [IP fornecido pela Vercel]

     # Para www.ziguealuga.com
     Tipo: CNAME
     Nome: www
     Valor: cname.vercel-dns.com
     ```

---

## 🌐 Opção 2: Deploy Alternativo (Railway)

### Backend + Database - Railway.app

1. **Criar conta no Railway**: https://railway.app

2. **Criar novo projeto**:
   - New Project → Deploy from GitHub
   - Selecione o repositório

3. **Adicionar PostgreSQL**:
   - New Service → Database → PostgreSQL
   - Railway fornecerá automaticamente a `DATABASE_URL`

4. **Configurar Backend Service**:
   - Root Directory: `/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Adicione todas as variáveis de ambiente (mesmas do Render)

5. **Configurar Domínio**:
   - Settings → Generate Domain (para gerar domínio temporário)
   - Custom Domain → Adicione `api.ziguealuga.com`
   - Configure DNS conforme instruções

### Frontend - Vercel (mesmo processo acima)

---

## 🗄️ Configuração do Banco de Dados

Após criar o PostgreSQL, você precisa criar as tabelas:

1. **Conectar ao banco**:
   ```bash
   psql "sua_database_url_aqui"
   ```

2. **As tabelas serão criadas automaticamente** quando o backend iniciar pela primeira vez (Sequelize sync).

3. **Ou execute manualmente os scripts**:
   ```bash
   cd backend
   node -e "require('./models').syncModels().then(() => process.exit(0))"
   ```

---

## 📧 Configuração de Email

### Gmail (Recomendado para teste)

1. Ative a verificação em duas etapas no Google
2. Gere uma "Senha de App": https://myaccount.google.com/security
3. Use essa senha no `SMTP_PASS`

### SendGrid (Recomendado para produção)

1. Crie conta no SendGrid: https://sendgrid.com
2. Configure:
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=sua_api_key_sendgrid
   ```

---

## 💳 Mercado Pago - Configuração de Produção

1. Acesse: https://www.mercadopago.com.br/developers
2. Vá em "Suas aplicações" → Selecione sua aplicação
3. **IMPORTANTE**: Use as credenciais de PRODUÇÃO, não de teste!
4. Copie:
   - `Access Token` → `MERCADOPAGO_ACCESS_TOKEN`
   - `Public Key` → `MERCADOPAGO_PUBLIC_KEY`
5. Configure a URL de webhook: `https://api.ziguealuga.com/api/webhooks/mercadopago`

---

## 🔒 Segurança - Checklist antes do Deploy

- [ ] Gerar nova `JWT_SECRET` aleatória e segura
- [ ] Trocar senhas do banco de dados
- [ ] Usar credenciais de PRODUÇÃO do Mercado Pago
- [ ] Configurar CORS corretamente
- [ ] Habilitar HTTPS em todos os domínios
- [ ] Configurar rate limiting
- [ ] Remover console.logs sensíveis
- [ ] Configurar variável `BETA_MODE=false`
- [ ] Testar fluxo completo de pagamento
- [ ] Configurar backup automático do banco

---

## 📊 Monitoramento (Opcional mas Recomendado)

### Sentry - Monitoramento de Erros

1. Crie conta: https://sentry.io
2. Crie projeto para Node.js e React
3. Adicione DSN nas variáveis de ambiente

### Google Analytics

1. Crie propriedade no Google Analytics
2. Adicione `VITE_GA_MEASUREMENT_ID` no frontend

---

## 🧪 Testando o Deploy

Após o deploy, teste:

1. **Frontend**:
   - Acesse `https://ziguealuga.com`
   - Verifique se carrega corretamente
   - Teste navegação entre páginas

2. **Backend**:
   - Acesse `https://api.ziguealuga.com/health` (deve retornar status OK)
   - Teste login
   - Teste criação de propriedade

3. **Pagamento**:
   - Faça uma reserva teste
   - Complete o fluxo de pagamento
   - Verifique se o webhook do Mercado Pago funciona

---

## 🐛 Troubleshooting

### Erro: CORS bloqueado
- Verifique se `CORS_ORIGIN` está correto no backend
- Inclua tanto `https://ziguealuga.com` quanto `https://www.ziguealuga.com`

### Erro: Banco de dados não conecta
- Verifique se `DATABASE_URL` está correta
- Confirme que o IP do servidor backend está liberado no firewall do banco

### Erro: Uploads não funcionam
- Configure storage persistente no Render/Railway
- Ou use Cloudinary para uploads

### Erro: Emails não enviam
- Verifique credenciais SMTP
- Confirme que a porta 587 está liberada
- Teste com Gmail primeiro antes de usar outros provedores

---

## 📝 Comandos Úteis

```bash
# Gerar JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Testar conexão com banco
psql "sua_database_url" -c "SELECT version();"

# Ver logs do backend (Render)
render logs -t ziguealuga-api

# Build local do frontend
cd frontend && npm run build

# Testar build de produção localmente
cd frontend && npm run preview
```

---

## 🔄 Atualização Contínua

### Deploy Automático

Render e Vercel fazem deploy automático quando você faz push para o GitHub:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### Deploy Manual

Se necessário fazer deploy manual:

**Backend (Render)**:
- Acesse o dashboard → Manual Deploy → Deploy Latest Commit

**Frontend (Vercel)**:
- Acesse o dashboard → Deployments → Redeploy

---

## 📞 Suporte

- Render Support: https://render.com/docs
- Vercel Support: https://vercel.com/support
- Railway Support: https://docs.railway.app

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Frontend acessível em ziguealuga.com
- [ ] Backend acessível em api.ziguealuga.com
- [ ] HTTPS configurado e funcionando
- [ ] Banco de dados conectado e populado
- [ ] Pagamento Mercado Pago testado em produção
- [ ] Emails sendo enviados corretamente
- [ ] Google Maps funcionando
- [ ] Upload de fotos funcionando
- [ ] Todas as páginas carregando
- [ ] Sistema de reviews funcionando
- [ ] Painel administrativo acessível
- [ ] Monitoramento configurado (Sentry, Analytics)
- [ ] Backup do banco configurado

---

**Data de criação**: 05/11/2025
**Versão**: 1.0
**Domínio**: ziguealuga.com
