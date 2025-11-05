# ✅ Checklist de Deploy - ziguealuga.com

## 📋 Arquivos de Configuração Criados/Atualizados

### Frontend
- ✅ `frontend/.env.production` - Variáveis de ambiente para produção
- ✅ `frontend/.env.example` - Template atualizado com URLs de produção
- ✅ `frontend/vercel.json` - Configuração do Vercel (rewrites, headers, etc)

### Backend
- ✅ `backend/.env.production.example` - Template para produção
- ✅ `backend/render.yaml` - Configuração para deploy no Render
- ✅ `backend/Dockerfile` - Container Docker para deploy
- ✅ `backend/.dockerignore` - Arquivos ignorados no build Docker
- ✅ `backend/server.js` - Adicionado endpoint `/health` para health checks

### Documentação
- ✅ `README.md` - Documentação principal do projeto
- ✅ `DEPLOY.md` - Guia completo de deploy passo a passo
- ✅ `DNS-CONFIG.md` - Configuração detalhada de DNS
- ✅ `DEPLOYMENT-CHECKLIST.md` - Este arquivo

### CI/CD
- ✅ `.github/workflows/deploy.yml` - Pipeline de deploy automatizado

---

## 🌐 URLs Configuradas

| Ambiente | Frontend | Backend API |
|----------|----------|-------------|
| **Produção** | https://ziguealuga.com | https://api.ziguealuga.com |
| **Desenvolvimento** | http://localhost:5173 | http://localhost:5000 |

---

## 🚀 Passo a Passo para Deploy

### 1️⃣ Preparação do Código

- [ ] Commit de todas as mudanças
- [ ] Push para branch `main` no GitHub
- [ ] Verificar se todas as dependências estão no `package.json`
- [ ] Testar build local:
  ```bash
  cd frontend && npm run build
  cd ../backend && npm install
  ```

### 2️⃣ Configuração do Banco de Dados

#### Opção A: Render PostgreSQL
- [ ] Criar database no Render
- [ ] Copiar `DATABASE_URL`
- [ ] Adicionar nas variáveis de ambiente

#### Opção B: Railway PostgreSQL
- [ ] Criar database no Railway
- [ ] Copiar `DATABASE_URL`
- [ ] Adicionar nas variáveis de ambiente

#### Opção C: Supabase
- [ ] Criar projeto no Supabase
- [ ] Copiar connection string
- [ ] Adicionar nas variáveis de ambiente

**Nota**: As tabelas serão criadas automaticamente pelo Sequelize na primeira execução.

### 3️⃣ Deploy do Backend (Render)

- [ ] Criar conta no Render: https://render.com
- [ ] Criar novo Web Service:
  - Repository: Conectar GitHub
  - Root Directory: `backend`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Configurar variáveis de ambiente:
  ```bash
  NODE_ENV=production
  PORT=5000
  DATABASE_URL=[fornecido pelo Render PostgreSQL]
  JWT_SECRET=[gerar nova chave]
  CORS_ORIGIN=https://ziguealuga.com,https://www.ziguealuga.com
  FRONTEND_URL=https://ziguealuga.com
  BACKEND_URL=https://api.ziguealuga.com
  # Email
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=contato@ziguealuga.com
  SMTP_PASS=[senha de app]
  # Mercado Pago (PRODUÇÃO)
  MERCADOPAGO_ACCESS_TOKEN=[token de produção]
  MERCADOPAGO_PUBLIC_KEY=[chave de produção]
  BETA_MODE=false
  ```
- [ ] Configurar domínio customizado: `api.ziguealuga.com`
- [ ] Aguardar deploy e verificar logs
- [ ] Testar endpoint: `https://api.ziguealuga.com/health`

### 4️⃣ Deploy do Frontend (Vercel)

- [ ] Criar conta no Vercel: https://vercel.com
- [ ] Importar projeto do GitHub
- [ ] Configurar projeto:
  - Root Directory: `frontend`
  - Framework: `Vite`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] Configurar variáveis de ambiente:
  ```bash
  VITE_API_URL=https://api.ziguealuga.com
  VITE_UPLOADS_URL=https://api.ziguealuga.com/uploads
  NODE_ENV=production
  VITE_GOOGLE_MAPS_API_KEY=[sua chave]
  VITE_BETA_MODE=false
  ```
- [ ] Fazer deploy
- [ ] Configurar domínio customizado:
  - Adicionar: `ziguealuga.com`
  - Adicionar: `www.ziguealuga.com`
- [ ] Aguardar SSL automático
- [ ] Verificar se site carrega: https://ziguealuga.com

### 5️⃣ Configuração DNS

- [ ] Acessar painel do provedor de domínio
- [ ] Adicionar registros DNS:
  ```
  Tipo: A
  Nome: @
  Valor: 76.76.21.21 (IP do Vercel)
  TTL: 3600

  Tipo: CNAME
  Nome: www
  Valor: cname.vercel-dns.com
  TTL: 3600

  Tipo: CNAME
  Nome: api
  Valor: [seu-app].onrender.com
  TTL: 3600
  ```
- [ ] Aguardar propagação DNS (1-24h)
- [ ] Verificar propagação: https://whatsmydns.net/
- [ ] Testar todas as URLs:
  - https://ziguealuga.com
  - https://www.ziguealuga.com
  - https://api.ziguealuga.com

### 6️⃣ Configuração do Mercado Pago

- [ ] Acessar: https://www.mercadopago.com.br/developers
- [ ] Ir em "Suas aplicações"
- [ ] **Trocar para modo PRODUÇÃO** (não teste!)
- [ ] Copiar credenciais de produção:
  - Access Token
  - Public Key
- [ ] Adicionar no backend (Render)
- [ ] Configurar webhook:
  - URL: `https://api.ziguealuga.com/api/webhooks/mercadopago`
  - Eventos: `payment`, `merchant_order`

### 7️⃣ Configuração de Email

#### Gmail
- [ ] Ativar verificação em 2 etapas
- [ ] Gerar senha de app: https://myaccount.google.com/security
- [ ] Adicionar credenciais no backend

#### SendGrid (Recomendado)
- [ ] Criar conta: https://sendgrid.com
- [ ] Gerar API Key
- [ ] Configurar domínio verificado
- [ ] Adicionar credenciais no backend

### 8️⃣ Testes de Produção

#### Frontend
- [ ] Página inicial carrega
- [ ] Busca de imóveis funciona
- [ ] Filtros funcionam
- [ ] Google Maps carrega
- [ ] Login/Registro funciona
- [ ] Navegação entre páginas
- [ ] Imagens carregam corretamente

#### Backend
- [ ] Endpoint `/health` responde
- [ ] Login funciona
- [ ] CRUD de imóveis funciona
- [ ] Upload de fotos funciona
- [ ] Sistema de reservas funciona
- [ ] Emails são enviados

#### Pagamento
- [ ] Fazer reserva teste
- [ ] Pagar com cartão de teste Mercado Pago
- [ ] Verificar se webhook funciona
- [ ] Verificar se status atualiza
- [ ] Verificar email de confirmação

#### Sistema de Reviews
- [ ] Criar review em reserva concluída
- [ ] Verificar se review aparece no imóvel
- [ ] Testar edição/exclusão de review

---

## 🔐 Segurança

### Antes de ir ao ar:

- [ ] Gerar nova `JWT_SECRET` aleatória
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Usar credenciais de PRODUÇÃO do Mercado Pago
- [ ] Verificar CORS configurado corretamente
- [ ] HTTPS habilitado em todos os domínios
- [ ] Rate limiting ativo
- [ ] Remover `console.log` sensíveis
- [ ] `BETA_MODE=false`
- [ ] Helmet configurado (já está)
- [ ] Variáveis de ambiente não commitadas

---

## 📊 Monitoramento (Opcional mas Recomendado)

### Sentry - Erros
- [ ] Criar conta: https://sentry.io
- [ ] Criar projeto Node.js
- [ ] Criar projeto React
- [ ] Adicionar DSN nas variáveis de ambiente
- [ ] Testar captura de erro

### Google Analytics
- [ ] Criar propriedade GA4
- [ ] Copiar Measurement ID
- [ ] Adicionar no frontend
- [ ] Verificar eventos

### Uptime Monitoring
- [ ] UptimeRobot: https://uptimerobot.com
- [ ] Configurar monitor para:
  - https://ziguealuga.com
  - https://api.ziguealuga.com/health
- [ ] Configurar alertas por email

---

## 🔄 CI/CD Automático (GitHub Actions)

### Configurar Secrets no GitHub

- [ ] Ir em Settings → Secrets and variables → Actions
- [ ] Adicionar secrets:
  ```
  VERCEL_TOKEN
  VERCEL_ORG_ID
  VERCEL_PROJECT_ID
  RENDER_SERVICE_ID
  RENDER_API_KEY
  VITE_API_URL
  VITE_UPLOADS_URL
  VITE_GOOGLE_MAPS_API_KEY
  ```
- [ ] Fazer push na branch `main`
- [ ] Verificar deploy automático em Actions

---

## 🐛 Troubleshooting

### Backend não inicia
```bash
# Verificar logs no Render
# Common issues:
- DATABASE_URL incorreta
- JWT_SECRET faltando
- Porta incorreta
```

### Frontend erro 404
```bash
# Verificar:
- vercel.json está commitado
- Rewrite rules configuradas
- Build sem erros
```

### DNS não resolve
```bash
# Verificar propagação
nslookup ziguealuga.com
nslookup api.ziguealuga.com

# Limpar cache DNS local
ipconfig /flushdns  # Windows
sudo dscacheutil -flushcache  # Mac
```

### SSL não funciona
```bash
# Aguardar 10-30 min após configurar DNS
# Forçar renovação no painel Vercel/Render
# Verificar se DNS propagou corretamente
```

### Uploads não funcionam
```bash
# Render: Configurar disk storage persistente
# Ou migrar para Cloudinary:
- Criar conta Cloudinary
- Adicionar credenciais
- Implementar upload para Cloudinary
```

---

## ✅ Checklist Final

### Pré-Launch
- [ ] Todos os testes passando
- [ ] DNS propagado
- [ ] SSL funcionando
- [ ] Backup do banco configurado
- [ ] Emails sendo enviados
- [ ] Pagamento testado
- [ ] Logs monitorados

### Launch Day
- [ ] Anunciar lançamento
- [ ] Monitorar logs em tempo real
- [ ] Testar fluxo completo
- [ ] Verificar performance
- [ ] Responder feedback

### Pós-Launch
- [ ] Monitorar uptime
- [ ] Analisar erros (Sentry)
- [ ] Revisar analytics
- [ ] Coletar feedback
- [ ] Planejar melhorias

---

## 📞 Suporte e Recursos

### Documentação
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **Mercado Pago**: https://www.mercadopago.com.br/developers/pt/docs

### Ferramentas
- **DNS Checker**: https://dnschecker.org/
- **SSL Test**: https://www.ssllabs.com/ssltest/
- **PageSpeed**: https://pagespeed.web.dev/
- **Uptime Monitor**: https://uptimerobot.com/

### Comunidade
- **Stack Overflow**: https://stackoverflow.com/
- **Render Community**: https://community.render.com/
- **Vercel Discord**: https://discord.gg/vercel

---

**Data de criação**: 05/11/2025
**Versão**: 1.0
**Domínio**: ziguealuga.com
**Status**: ✅ Pronto para Deploy
