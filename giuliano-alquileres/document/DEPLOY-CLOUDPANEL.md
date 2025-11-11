# 🚀 Deploy com CloudPanel - ziguealuga.com

Guia completo para fazer deploy da aplicação Ziguealuga usando CloudPanel na VPS Hostinger.

## 🎯 Por que CloudPanel?

- ✅ Interface gráfica amigável
- ✅ Nginx já configurado
- ✅ SSL automático (Let's Encrypt)
- ✅ PostgreSQL integrado
- ✅ Gerenciamento de domínios facilitado
- ✅ Firewall pré-configurado
- ✅ Node.js suportado nativamente

---

## 📋 Pré-requisitos

- VPS Hostinger (mínimo: 2 GB RAM, 2 vCPUs)
- Ubuntu 22.04 LTS
- Domínio **ziguealuga.com** registrado
- Acesso root via SSH

---

## 🏗️ Arquitetura

```
CloudPanel Dashboard
    ↓
Nginx (gerenciado pelo CloudPanel)
    ↓
PM2 → Node.js 20 (Backend)
    ↓
PostgreSQL (gerenciado pelo CloudPanel)
```

---

## 📦 Parte 1: Instalar CloudPanel

### 1.1 Conectar via SSH

```bash
ssh root@SEU_IP_DA_VPS
```

### 1.2 Instalar CloudPanel

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar CloudPanel (Ubuntu 22.04)
curl -sSL https://installer.cloudpanel.io/ce/v2/install.sh | sudo bash

# Aguarde a instalação (5-10 minutos)
# No final, você verá:
# - URL do painel: https://SEU_IP:8443
# - Usuário: admin
# - Senha: [será exibida na tela - ANOTE!]
```

### 1.3 Acessar CloudPanel

1. Abra no navegador: `https://SEU_IP:8443`
2. Login:
   - User: `admin`
   - Password: [senha gerada na instalação]
3. **IMPORTANTE**: Mude a senha de admin no primeiro acesso!

---

## 🌐 Parte 2: Configurar Domínios no CloudPanel

### 2.1 Adicionar Site Principal (ziguealuga.com)

1. No CloudPanel, vá em **Sites** → **Add Site**
2. Preencha:
   ```
   Domain Name: ziguealuga.com
   Site Type: Generic
   Vhost Template: Generic
   PHP Version: (deixe default - não usaremos PHP)
   Site User: ziguealuga
   Site User Password: [crie uma senha forte]
   ```
3. Clique em **Create**

### 2.2 Adicionar Alias www

1. Vá em **Sites** → **ziguealuga.com**
2. Aba **Domains**
3. Clique em **Add Domain**
4. Digite: `www.ziguealuga.com`
5. Salvar

### 2.3 Adicionar Subdomínio API

1. Vá em **Sites** → **Add Site**
2. Preencha:
   ```
   Domain Name: api.ziguealuga.com
   Site Type: Generic
   Vhost Template: Reverse Proxy
   Reverse Proxy URL: http://127.0.0.1:5000
   Site User: ziguealuga-api
   Site User Password: [senha forte]
   ```
3. Clique em **Create**

---

## 🔒 Parte 3: Configurar SSL

### 3.1 SSL para ziguealuga.com

1. Vá em **Sites** → **ziguealuga.com**
2. Aba **SSL/TLS**
3. Clique em **Actions** → **New Let's Encrypt Certificate**
4. Marque os domínios:
   - ☑ ziguealuga.com
   - ☑ www.ziguealuga.com
5. Clique em **Create and Install**
6. Aguarde (1-2 minutos)

### 3.2 SSL para api.ziguealuga.com

1. Vá em **Sites** → **api.ziguealuga.com**
2. Aba **SSL/TLS**
3. Clique em **Actions** → **New Let's Encrypt Certificate**
4. Marque: ☑ api.ziguealuga.com
5. Clique em **Create and Install**

**Pronto!** SSL configurado automaticamente com renovação automática.

---

## 🗄️ Parte 4: Configurar PostgreSQL

### 4.1 Criar Database via CloudPanel

1. No CloudPanel, vá em **Databases** → **Add Database**
2. Preencha:
   ```
   Database Name: ziguealuga_prod
   Database User Name: ziguealuga_user
   Database User Password: [senha super segura]
   ```
3. Clique em **Create**
4. **ANOTE** as credenciais!

### 4.2 Testar Conexão (opcional)

CloudPanel já fornece phpPgAdmin, mas podemos testar via SSH:

```bash
# Conectar ao PostgreSQL
sudo -u postgres psql

# Listar databases
\l

# Conectar ao database
\c ziguealuga_prod

# Sair
\q
```

---

## 📥 Parte 5: Deploy do Backend

### 5.1 Acessar via SSH como usuário do site

```bash
# SSH para VPS
ssh root@SEU_IP_DA_VPS

# Mudar para usuário do site
su - ziguealuga-api

# Ir para diretório home
cd ~
```

### 5.2 Instalar Node.js 20

```bash
# CloudPanel já tem Node.js, mas vamos garantir a versão 20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar shell
source ~/.bashrc

# Instalar Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verificar
node --version  # deve mostrar v20.x.x
npm --version
```

### 5.3 Clonar Repositório

```bash
# Clonar projeto
git clone [URL_DO_SEU_REPOSITORIO] ~/ziguealuga
cd ~/ziguealuga/backend
```

### 5.4 Configurar .env

```bash
nano .env
```

Adicione:

```bash
# ==================================
# PRODUÇÃO - CLOUDPANEL
# ==================================

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=ziguealuga_user
DB_PASSWORD=SUA_SENHA_DO_DATABASE
DB_NAME=ziguealuga_prod

# JWT (GERE UMA NOVA!)
JWT_SECRET=sua_chave_jwt_super_segura_de_32_caracteres_ou_mais

# Servidor
PORT=5000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://ziguealuga.com,https://www.ziguealuga.com

# URLs
FRONTEND_URL=https://ziguealuga.com
BACKEND_URL=https://api.ziguealuga.com

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@ziguealuga.com
SMTP_PASS=sua_senha_de_app_gmail
EMAIL_FROM=noreply@ziguealuga.com

# Mercado Pago (PRODUÇÃO)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token-de-producao
MERCADOPAGO_PUBLIC_KEY=APP_USR-sua-chave-de-producao
BETA_MODE=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_REGISTER_MAX=3
```

Salvar: `Ctrl+O`, Enter, `Ctrl+X`

### 5.5 Instalar Dependências

```bash
# Instalar pacotes
npm install --production

# Criar diretório de uploads
mkdir -p uploads

# Testar se funciona
npm start
# Se aparecer "Server running on port 5000", está OK
# Ctrl+C para parar
```

### 5.6 Configurar PM2

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start server.js --name ziguealuga-api

# Configurar para iniciar no boot
pm2 startup
# Copie e execute o comando que aparecer

# Salvar configuração
pm2 save

# Ver status
pm2 status
pm2 logs ziguealuga-api
```

---

## 🎨 Parte 6: Deploy do Frontend

### 6.1 Build do Frontend

```bash
# Mudar para usuário do site principal
su - ziguealuga

cd ~
```

Se ainda não clonou o repositório:

```bash
git clone [URL_DO_SEU_REPOSITORIO] ~/ziguealuga
cd ~/ziguealuga/frontend
```

### 6.2 Criar .env.production

```bash
nano .env.production
```

Adicione:

```bash
VITE_API_URL=https://api.ziguealuga.com
VITE_UPLOADS_URL=https://api.ziguealuga.com/uploads
NODE_ENV=production
VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps
VITE_BETA_MODE=false
```

### 6.3 Build

```bash
# Instalar Node.js 20 para este usuário também
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Instalar dependências
npm install

# Build
npm run build
```

### 6.4 Copiar Build para Pasta do Site

CloudPanel usa a pasta `/home/[usuario]/htdocs/[dominio]` para arquivos estáticos.

```bash
# Copiar build para pasta do CloudPanel
cp -r dist/* /home/ziguealuga/htdocs/ziguealuga.com/

# Verificar
ls -la /home/ziguealuga/htdocs/ziguealuga.com/
```

---

## 🔧 Parte 7: Configurar Vhost no CloudPanel

### 7.1 Configurar Vhost para SPA (Frontend)

1. No CloudPanel, vá em **Sites** → **ziguealuga.com**
2. Aba **Vhost**
3. Clique em **Edit Vhost**

Encontre o bloco `location / {` e substitua por:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

4. Clique em **Save**

### 7.2 Verificar Vhost da API

1. Vá em **Sites** → **api.ziguealuga.com**
2. Aba **Vhost**
3. Deve ter algo assim:

```nginx
location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Se não tiver, adicione manualmente e salve.

---

## 🌐 Parte 8: Configurar DNS

No painel do seu registrador de domínio (ou Hostinger DNS):

```
┌─────────────────────────────────────────────────────────────┐
│ Tipo    │ Nome    │ Valor                                   │
├─────────────────────────────────────────────────────────────┤
│ A       │ @       │ [IP_DA_SUA_VPS]                        │
│ A       │ www     │ [IP_DA_SUA_VPS]                        │
│ A       │ api     │ [IP_DA_SUA_VPS]                        │
└─────────────────────────────────────────────────────────────┘
```

**TTL**: 3600 (1 hora)

Aguarde propagação: 1-24 horas (geralmente 1-2h)

Verificar em: https://whatsmydns.net/

---

## ✅ Parte 9: Verificação e Testes

### 9.1 Testar Backend

```bash
# Via curl
curl https://api.ziguealuga.com/health

# Deve retornar:
# {"status":"healthy","timestamp":"...","uptime":...}
```

### 9.2 Testar Frontend

Abrir no navegador:
- https://ziguealuga.com
- https://www.ziguealuga.com

Deve carregar a página inicial.

### 9.3 Testar Fluxo Completo

1. ✅ Página inicial carrega
2. ✅ Buscar imóveis funciona
3. ✅ Login/Registro funciona
4. ✅ Upload de fotos funciona
5. ✅ Criar reserva funciona
6. ✅ Pagamento funciona (teste com Mercado Pago)
7. ✅ Emails são enviados

### 9.4 Verificar Logs

```bash
# Backend
pm2 logs ziguealuga-api

# Nginx (via CloudPanel)
# No dashboard: Sites → ziguealuga.com → Logs
```

---

## 🔄 Parte 10: Script de Deploy Automático

### 10.1 Criar Script

```bash
# Como usuário ziguealuga-api
su - ziguealuga-api
nano ~/deploy.sh
```

Adicione:

```bash
#!/bin/bash

echo "🚀 Deploy Ziguealuga - Backend"

cd ~/ziguealuga
git pull origin main

cd backend
npm install --production
pm2 restart ziguealuga-api

echo "✅ Backend atualizado!"
```

```bash
# Dar permissão
chmod +x ~/deploy.sh
```

### 10.2 Script para Frontend

```bash
# Como usuário ziguealuga
su - ziguealuga
nano ~/deploy-frontend.sh
```

Adicione:

```bash
#!/bin/bash

echo "🎨 Deploy Ziguealuga - Frontend"

cd ~/ziguealuga
git pull origin main

cd frontend
npm install
npm run build

# Copiar para pasta do site
cp -r dist/* /home/ziguealuga/htdocs/ziguealuga.com/

echo "✅ Frontend atualizado!"
```

```bash
# Dar permissão
chmod +x ~/deploy-frontend.sh
```

### 10.3 Usar os Scripts

```bash
# Backend
su - ziguealuga-api
~/deploy.sh

# Frontend
su - ziguealuga
~/deploy-frontend.sh
```

---

## 📊 Parte 11: Backup Automático

### 11.1 Backup via CloudPanel

CloudPanel já tem backup integrado!

1. No CloudPanel, vá em **Sites** → **ziguealuga.com**
2. Aba **Backups**
3. Configure:
   ```
   Backup Frequency: Daily
   Backup Time: 03:00
   Retention: 7 days
   ```
4. Clique em **Save**

Repita para **api.ziguealuga.com**.

### 11.2 Backup do Database

1. No CloudPanel, vá em **Databases**
2. Selecione **ziguealuga_prod**
3. Clique em **Backup**
4. Configure backup automático

---

## 🔥 Firewall e Segurança

CloudPanel já vem com **UFW configurado**!

Verificar portas abertas:

```bash
sudo ufw status

# Deve mostrar:
# 22/tcp    ALLOW    (SSH)
# 80/tcp    ALLOW    (HTTP)
# 443/tcp   ALLOW    (HTTPS)
# 8443/tcp  ALLOW    (CloudPanel)
```

**Recomendação**: Após configurar tudo, você pode fechar a porta 8443 externamente e acessar CloudPanel apenas via VPN ou IP específico.

---

## 📱 Monitoramento via CloudPanel

### 11.1 Dashboard

CloudPanel tem dashboard com:
- Uso de CPU
- Uso de RAM
- Uso de disco
- Tráfego de rede

Acesse: `https://SEU_IP:8443`

### 11.2 Logs em Tempo Real

1. **Backend**: `pm2 logs ziguealuga-api`
2. **Nginx**: CloudPanel → Sites → Logs
3. **PostgreSQL**: CloudPanel → Databases → Logs

---

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar PM2
pm2 status
pm2 logs ziguealuga-api

# Verificar porta
sudo netstat -tlnp | grep 5000

# Reiniciar
pm2 restart ziguealuga-api
```

### Frontend não carrega

```bash
# Verificar arquivos
ls -la /home/ziguealuga/htdocs/ziguealuga.com/

# Verificar permissões
sudo chown -R ziguealuga:ziguealuga /home/ziguealuga/htdocs/

# Verificar vhost no CloudPanel
# Sites → ziguealuga.com → Vhost
```

### SSL não funciona

No CloudPanel:
1. Sites → [seu site] → SSL/TLS
2. Clique em **Renew** se necessário
3. Verificar se domínio está apontando corretamente

### API retorna 502

```bash
# Verificar se backend está rodando
pm2 status

# Verificar logs
pm2 logs ziguealuga-api

# Verificar vhost do reverse proxy
# CloudPanel → Sites → api.ziguealuga.com → Vhost
```

---

## ✅ Checklist Final

- [ ] CloudPanel instalado e acessível
- [ ] Sites criados (ziguealuga.com e api.ziguealuga.com)
- [ ] SSL configurado e funcionando
- [ ] PostgreSQL database criado
- [ ] Backend rodando com PM2
- [ ] Frontend buildado e copiado para htdocs
- [ ] DNS propagado
- [ ] https://ziguealuga.com carrega
- [ ] https://api.ziguealuga.com/health retorna 200
- [ ] Login funciona
- [ ] Upload funciona
- [ ] Pagamento funciona
- [ ] Emails enviados
- [ ] Backup automático configurado
- [ ] Firewall ativo

---

## 🎯 Vantagens do CloudPanel

✅ Interface gráfica intuitiva
✅ SSL automático com 1 clique
✅ Nginx já otimizado
✅ Gerenciamento de usuários
✅ Backup integrado
✅ Logs centralizados
✅ Firewall pré-configurado
✅ Updates automáticos
✅ Suporte a múltiplos sites
✅ Gratuito e open-source

---

## 📞 Suporte

- **CloudPanel Docs**: https://www.cloudpanel.io/docs/
- **CloudPanel Community**: https://discord.cloudpanel.io/
- **Hostinger Support**: https://www.hostinger.com.br/

---

**Data**: 05/11/2025
**Versão**: 1.0
**Domínio**: ziguealuga.com
**Painel**: CloudPanel CE v2
