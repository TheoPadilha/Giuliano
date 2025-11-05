# 🚀 Deploy em VPS Hostinger - ziguealuga.com

Guia completo para fazer deploy da aplicação Ziguealuga em uma VPS da Hostinger.

## 📋 Pré-requisitos

- VPS na Hostinger (mínimo: 2 GB RAM, 2 vCPUs)
- Domínio **ziguealuga.com** apontando para o IP da VPS
- Acesso SSH à VPS
- Ubuntu 22.04 LTS (recomendado)

---

## 🏗️ Arquitetura

```
ziguealuga.com (Frontend React)
    ↓
Nginx (Reverse Proxy + SSL)
    ↓
Node.js + PM2 (Backend API)
    ↓
PostgreSQL (Database)
```

---

## 🔧 Parte 1: Configuração Inicial da VPS

### 1.1 Conectar via SSH

```bash
ssh root@SEU_IP_DA_VPS
# Ou use o painel da Hostinger para acessar via SSH
```

### 1.2 Atualizar Sistema

```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar ferramentas essenciais
sudo apt install -y curl wget git build-essential
```

### 1.3 Criar Usuário Não-Root

```bash
# Criar usuário
adduser deploy
usermod -aG sudo deploy

# Permitir SSH para novo usuário
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

### 1.4 Configurar Firewall

```bash
# Configurar UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Verificar status
sudo ufw status
```

---

## 📦 Parte 2: Instalar Dependências

### 2.1 Instalar Node.js 20

```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar instalação
node --version  # deve mostrar v20.x.x
npm --version
```

### 2.2 Instalar PostgreSQL

```bash
# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verificar status
sudo systemctl status postgresql
```

### 2.3 Configurar PostgreSQL

```bash
# Entrar no PostgreSQL
sudo -u postgres psql

# Dentro do psql:
CREATE DATABASE ziguealuga_prod;
CREATE USER ziguealuga_user WITH ENCRYPTED PASSWORD 'SUA_SENHA_SUPER_SEGURA_AQUI';
GRANT ALL PRIVILEGES ON DATABASE ziguealuga_prod TO ziguealuga_user;
\q
```

### 2.4 Instalar PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Configurar PM2 para iniciar no boot
pm2 startup
# Execute o comando que aparecer na tela
```

### 2.5 Instalar Nginx

```bash
sudo apt install -y nginx

# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 📥 Parte 3: Deploy do Backend

### 3.1 Clonar Repositório

```bash
# Entrar como usuário deploy
su - deploy

# Criar diretório para o projeto
cd ~
git clone [URL_DO_SEU_REPOSITORIO] ziguealuga
cd ziguealuga/backend
```

### 3.2 Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env
nano .env
```

Adicione o seguinte conteúdo:

```bash
# ==================================
# PRODUÇÃO - HOSTINGER VPS
# ==================================

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=ziguealuga_user
DB_PASSWORD=SUA_SENHA_SUPER_SEGURA_AQUI
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

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@ziguealuga.com
SMTP_PASS=sua_senha_de_app_gmail
EMAIL_FROM=noreply@ziguealuga.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_REGISTER_MAX=3

# Mercado Pago (PRODUÇÃO)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token-de-producao
MERCADOPAGO_PUBLIC_KEY=APP_USR-sua-chave-de-producao
BETA_MODE=false
```

Salvar: `Ctrl+O`, Enter, `Ctrl+X`

### 3.3 Instalar Dependências e Testar

```bash
# Instalar pacotes
npm install --production

# Criar diretório de uploads
mkdir -p uploads

# Testar backend localmente
npm start
# Deve aparecer "Server running on port 5000"
# Ctrl+C para parar
```

### 3.4 Configurar PM2

```bash
# Iniciar backend com PM2
pm2 start server.js --name ziguealuga-api

# Salvar configuração
pm2 save

# Verificar status
pm2 status
pm2 logs ziguealuga-api

# Configurar auto-restart
pm2 startup
```

---

## 🎨 Parte 4: Deploy do Frontend

### 4.1 Build do Frontend

```bash
cd ~/ziguealuga/frontend

# Criar .env.production
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

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# A pasta 'dist' será criada com os arquivos estáticos
```

---

## 🌐 Parte 5: Configurar Nginx

### 5.1 Configuração para ziguealuga.com (Frontend)

```bash
sudo nano /etc/nginx/sites-available/ziguealuga.com
```

Adicione:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name ziguealuga.com www.ziguealuga.com;

    root /home/deploy/ziguealuga/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5.2 Configuração para api.ziguealuga.com (Backend)

```bash
sudo nano /etc/nginx/sites-available/api.ziguealuga.com
```

Adicione:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.ziguealuga.com;

    # Proxy para Node.js
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Servir arquivos estáticos de upload diretamente
    location /uploads {
        alias /home/deploy/ziguealuga/backend/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Aumentar tamanho máximo de upload
    client_max_body_size 20M;
}
```

### 5.3 Ativar Sites

```bash
# Criar links simbólicos
sudo ln -s /etc/nginx/sites-available/ziguealuga.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.ziguealuga.com /etc/nginx/sites-enabled/

# Remover site padrão
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## 🔒 Parte 6: Configurar SSL (HTTPS)

### 6.1 Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obter Certificados SSL

```bash
# Para ziguealuga.com e www
sudo certbot --nginx -d ziguealuga.com -d www.ziguealuga.com

# Para api.ziguealuga.com
sudo certbot --nginx -d api.ziguealuga.com

# Responda as perguntas:
# Email: seu-email@exemplo.com
# Termos: (A)gree
# Compartilhar email: (N)o
# Redirect HTTP para HTTPS: (2) Redirect
```

### 6.3 Testar Renovação Automática

```bash
# Testar renovação
sudo certbot renew --dry-run

# Verificar timer de renovação
sudo systemctl status certbot.timer
```

---

## 🌐 Parte 7: Configurar DNS

No painel da Hostinger ou do seu registrador de domínio:

### DNS Records

```
Tipo: A
Nome: @
Valor: [IP_DA_SUA_VPS]
TTL: 3600

Tipo: A
Nome: www
Valor: [IP_DA_SUA_VPS]
TTL: 3600

Tipo: A
Nome: api
Valor: [IP_DA_SUA_VPS]
TTL: 3600
```

**Aguarde propagação**: 1-24 horas

---

## ✅ Parte 8: Verificação e Testes

### 8.1 Verificar Serviços

```bash
# Backend
pm2 status
pm2 logs ziguealuga-api

# Nginx
sudo systemctl status nginx

# PostgreSQL
sudo systemctl status postgresql

# Firewall
sudo ufw status
```

### 8.2 Testar URLs

```bash
# Health check do backend
curl https://api.ziguealuga.com/health

# Frontend
curl -I https://ziguealuga.com

# SSL
curl -I https://ziguealuga.com | grep SSL
```

### 8.3 Acessar pelo Navegador

- Frontend: https://ziguealuga.com
- Backend API: https://api.ziguealuga.com/health
- Painel Admin: https://ziguealuga.com/admin

---

## 🔄 Parte 9: Scripts de Deploy Automático

### 9.1 Criar Script de Deploy

```bash
nano ~/deploy.sh
```

Adicione:

```bash
#!/bin/bash

echo "🚀 Iniciando deploy do Ziguealuga..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretório do projeto
PROJECT_DIR="/home/deploy/ziguealuga"

# Backend
echo -e "${BLUE}📦 Atualizando backend...${NC}"
cd $PROJECT_DIR
git pull origin main

cd backend
npm install --production
pm2 restart ziguealuga-api
echo -e "${GREEN}✓ Backend atualizado${NC}"

# Frontend
echo -e "${BLUE}🎨 Buildando frontend...${NC}"
cd $PROJECT_DIR/frontend
npm install
npm run build
echo -e "${GREEN}✓ Frontend buildado${NC}"

# Nginx
echo -e "${BLUE}🌐 Recarregando Nginx...${NC}"
sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx recarregado${NC}"

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo "Frontend: https://ziguealuga.com"
echo "Backend:  https://api.ziguealuga.com"
```

```bash
# Dar permissão de execução
chmod +x ~/deploy.sh
```

### 9.2 Deploy Manual

```bash
# Executar deploy
~/deploy.sh
```

---

## 📊 Parte 10: Monitoramento

### 10.1 Logs

```bash
# Backend
pm2 logs ziguealuga-api

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

### 10.2 Recursos do Sistema

```bash
# Uso de CPU e memória
pm2 monit

# Disk usage
df -h

# Memória
free -h

# Processos
htop
```

---

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar logs
pm2 logs ziguealuga-api

# Verificar porta
sudo netstat -tlnp | grep 5000

# Reiniciar
pm2 restart ziguealuga-api
```

### Nginx erro 502

```bash
# Verificar se backend está rodando
pm2 status

# Verificar configuração
sudo nginx -t

# Ver logs
sudo tail -f /var/log/nginx/error.log
```

### SSL não funciona

```bash
# Verificar certificados
sudo certbot certificates

# Renovar manualmente
sudo certbot renew

# Recarregar Nginx
sudo systemctl reload nginx
```

### Uploads não funcionam

```bash
# Verificar permissões
ls -la ~/ziguealuga/backend/uploads

# Corrigir permissões
chmod 755 ~/ziguealuga/backend/uploads
chown -R deploy:deploy ~/ziguealuga/backend/uploads
```

---

## 🔐 Segurança Adicional

### Configurar Fail2Ban

```bash
sudo apt install -y fail2ban

# Configurar
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Backup Automático

```bash
# Criar script de backup
nano ~/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/home/deploy/backups"

mkdir -p $BACKUP_DIR

# Backup do banco
pg_dump -U ziguealuga_user -h localhost ziguealuga_prod > $BACKUP_DIR/db_$DATE.sql

# Backup dos uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /home/deploy/ziguealuga/backend/uploads

# Manter apenas últimos 7 backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup concluído: $DATE"
```

```bash
chmod +x ~/backup.sh

# Adicionar ao crontab (backup diário às 3h)
crontab -e
# Adicionar linha:
0 3 * * * /home/deploy/backup.sh >> /home/deploy/backup.log 2>&1
```

---

## ✅ Checklist Final

- [ ] VPS configurada e atualizada
- [ ] Node.js 20 instalado
- [ ] PostgreSQL configurado
- [ ] PM2 gerenciando backend
- [ ] Nginx configurado
- [ ] SSL ativo (HTTPS)
- [ ] DNS propagado
- [ ] Frontend carregando
- [ ] Backend respondendo em /health
- [ ] Uploads funcionando
- [ ] Pagamentos testados
- [ ] Emails sendo enviados
- [ ] Backup configurado
- [ ] Monitoramento ativo

---

**Data**: 05/11/2025
**Versão**: 1.0
**Domínio**: ziguealuga.com
**Servidor**: VPS Hostinger
