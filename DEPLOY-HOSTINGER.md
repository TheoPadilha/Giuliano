# Guia Completo de Deploy na VPS Hostinger - Ziguealuga.com

## Preparativos antes do Deploy

### 1. Informações que você precisa ter em mãos

- IP da VPS Hostinger
- Usuário SSH (geralmente `root` ou usuário criado)
- Senha SSH
- Domínio configurado: `ziguealuga.com`
- Subdomínio para API: `api.ziguealuga.com`

### 2. Configurar DNS no Hostinger

No painel da Hostinger, configure os seguintes registros DNS:

```
Tipo A:
- @ (ou domínio raiz) -> IP_DA_VPS
- www -> IP_DA_VPS
- api -> IP_DA_VPS
```

---

## PARTE 1: Configuração Inicial do Servidor VPS

### 1.1 Conectar via SSH

```bash
ssh root@SEU_IP_VPS
# ou
ssh seu_usuario@SEU_IP_VPS
```

### 1.2 Atualizar o Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Instalar Dependências Básicas

```bash
sudo apt install -y curl wget git build-essential
```

### 1.4 Instalar Node.js 20 LTS

```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar instalação
node --version  # deve mostrar v20.x.x
npm --version
```

### 1.5 Instalar PostgreSQL

```bash
# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Iniciar serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verificar status
sudo systemctl status postgresql
```

### 1.6 Instalar PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Configurar PM2 para iniciar com o sistema
sudo pm2 startup systemd -u $USER --hp /home/$USER
```

### 1.7 Instalar Nginx

```bash
sudo apt install -y nginx

# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar status
sudo systemctl status nginx
```

---

## PARTE 2: Configuração do Banco de Dados

### 2.1 Criar Banco de Dados e Usuário

```bash
# Acessar PostgreSQL como usuário postgres
sudo -u postgres psql

# Executar os seguintes comandos no PostgreSQL:
```

```sql
-- Criar usuário
CREATE USER ziguealuga_user WITH PASSWORD 'SUA_SENHA_SUPER_SEGURA';

-- Criar banco de dados
CREATE DATABASE ziguealuga_prod OWNER ziguealuga_user;

-- Garantir privilégios
GRANT ALL PRIVILEGES ON DATABASE ziguealuga_prod TO ziguealuga_user;

-- Sair
\q
```

### 2.2 Testar Conexão

```bash
psql -h localhost -U ziguealuga_user -d ziguealuga_prod
# Digite a senha quando solicitado
# Se conectar com sucesso, digite \q para sair
```

---

## PARTE 3: Deploy do Backend

### 3.1 Criar Diretório para Aplicação

```bash
sudo mkdir -p /var/www/ziguealuga
sudo chown -R $USER:$USER /var/www/ziguealuga
cd /var/www/ziguealuga
```

### 3.2 Clonar ou Enviar o Projeto

**Opção A: Via Git (Recomendado)**

```bash
# Se você tem o projeto no GitHub/GitLab
git clone https://github.com/SEU_USUARIO/SEU_REPO.git .

# OU se for repositório privado
git clone https://SEU_TOKEN@github.com/SEU_USUARIO/SEU_REPO.git .
```

**Opção B: Via SFTP/SCP (Manual)**

Do seu computador local, envie os arquivos:

```bash
# Da sua máquina local
scp -r giuliano-alquileres/* usuario@SEU_IP_VPS:/var/www/ziguealuga/
```

### 3.3 Configurar Backend

```bash
cd /var/www/ziguealuga/backend

# Instalar dependências
npm ci --only=production

# Copiar arquivo de ambiente
cp .env.vps .env

# IMPORTANTE: Editar o arquivo .env com as informações reais
nano .env
```

### 3.4 Configurar Variáveis de Ambiente (.env)

Edite o arquivo `.env` e substitua:

```bash
# Banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=ziguealuga_user
DB_PASSWORD=SUA_SENHA_DO_POSTGRES  # A senha que você criou no passo 2.1
DB_NAME=ziguealuga_prod

# JWT Secret - Gerar uma chave segura
# Execute este comando e copie o resultado:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=COLE_AQUI_A_CHAVE_GERADA

# URLs
FRONTEND_URL=https://ziguealuga.com
BACKEND_URL=https://api.ziguealuga.com
CORS_ORIGIN=https://ziguealuga.com,https://www.ziguealuga.com

# Email (configure seu Gmail com senha de app)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app_gmail
EMAIL_FROM=noreply@ziguealuga.com

# Mercado Pago (credenciais de PRODUÇÃO)
MERCADOPAGO_ACCESS_TOKEN=APP_USR_SEU_TOKEN_REAL
MERCADOPAGO_PUBLIC_KEY=APP_USR_SUA_PUBLIC_KEY_REAL

# Modo Beta
BETA_MODE=false
```

### 3.5 Executar Migrações do Banco

```bash
cd /var/www/ziguealuga/backend

# Executar migrações
npm run migrate
# OU se você tiver um script de migração:
node migrate.js
```

### 3.6 Iniciar Backend com PM2

```bash
cd /var/www/ziguealuga/backend

# Iniciar aplicação
pm2 start server.js --name "ziguealuga-backend" --env production

# Verificar status
pm2 status

# Ver logs
pm2 logs ziguealuga-backend

# Salvar configuração do PM2
pm2 save
```

---

## PARTE 4: Deploy do Frontend

### 4.1 Configurar Variáveis de Ambiente

```bash
cd /var/www/ziguealuga/frontend

# Criar arquivo .env.production
nano .env.production
```

Adicione:

```bash
VITE_API_URL=https://api.ziguealuga.com
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR_SUA_PUBLIC_KEY_REAL
```

### 4.2 Build do Frontend

```bash
cd /var/www/ziguealuga/frontend

# Instalar dependências
npm ci

# Build de produção
npm run build
```

Isso vai gerar uma pasta `dist/` com os arquivos estáticos.

---

## PARTE 5: Configuração do Nginx

### 5.1 Configurar Site Backend (API)

```bash
sudo nano /etc/nginx/sites-available/api.ziguealuga.com
```

Cole esta configuração:

```nginx
server {
    listen 80;
    server_name api.ziguealuga.com;

    # Logs
    access_log /var/log/nginx/api.ziguealuga.access.log;
    error_log /var/log/nginx/api.ziguealuga.error.log;

    # Proxy para o backend Node.js
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
    }

    # Upload de arquivos
    client_max_body_size 10M;
}
```

### 5.2 Configurar Site Frontend

```bash
sudo nano /etc/nginx/sites-available/ziguealuga.com
```

Cole esta configuração:

```nginx
server {
    listen 80;
    server_name ziguealuga.com www.ziguealuga.com;

    # Logs
    access_log /var/log/nginx/ziguealuga.access.log;
    error_log /var/log/nginx/ziguealuga.error.log;

    # Diretório do build do frontend
    root /var/www/ziguealuga/frontend/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache de assets estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Single Page Application - todas as rotas vão para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 5.3 Ativar Sites

```bash
# Criar links simbólicos
sudo ln -s /etc/nginx/sites-available/api.ziguealuga.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ziguealuga.com /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Se tudo OK, recarregar Nginx
sudo systemctl reload nginx
```

---

## PARTE 6: Configurar SSL (HTTPS) com Let's Encrypt

### 6.1 Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Gerar Certificados SSL

```bash
# Para o site principal
sudo certbot --nginx -d ziguealuga.com -d www.ziguealuga.com

# Para a API
sudo certbot --nginx -d api.ziguealuga.com
```

Siga as instruções:
- Digite seu email
- Aceite os termos
- Escolha se quer compartilhar email (opcional)
- Certbot vai configurar automaticamente o SSL

### 6.3 Renovação Automática

```bash
# Testar renovação
sudo certbot renew --dry-run

# Certbot já adiciona um cronjob automático, mas você pode verificar:
sudo systemctl status certbot.timer
```

---

## PARTE 7: Configuração do Firewall

```bash
# Permitir SSH
sudo ufw allow OpenSSH

# Permitir HTTP e HTTPS
sudo ufw allow 'Nginx Full'

# Ativar firewall
sudo ufw --force enable

# Verificar status
sudo ufw status
```

---

## PARTE 8: Verificação Final e Testes

### 8.1 Verificar Backend

```bash
# Verificar se o backend está rodando
pm2 status

# Ver logs em tempo real
pm2 logs ziguealuga-backend --lines 50

# Testar endpoint
curl http://localhost:5000/health
```

### 8.2 Verificar Nginx

```bash
sudo systemctl status nginx
sudo nginx -t
```

### 8.3 Testar DNS

```bash
# Do seu computador local ou da VPS
ping ziguealuga.com
ping api.ziguealuga.com
```

### 8.4 Acessar Sites

Abra no navegador:
- https://ziguealuga.com (Frontend)
- https://api.ziguealuga.com/health (Backend health check)

---

## PARTE 9: Scripts de Manutenção e Atualização

### 9.1 Script de Atualização do Backend

Crie um arquivo `update-backend.sh`:

```bash
#!/bin/bash

cd /var/www/ziguealuga/backend

# Parar aplicação
pm2 stop ziguealuga-backend

# Atualizar código (se usar Git)
git pull origin main

# Instalar dependências
npm ci --only=production

# Executar migrações
npm run migrate

# Reiniciar aplicação
pm2 restart ziguealuga-backend

# Verificar status
pm2 status

echo "Backend atualizado com sucesso!"
```

### 9.2 Script de Atualização do Frontend

Crie um arquivo `update-frontend.sh`:

```bash
#!/bin/bash

cd /var/www/ziguealuga/frontend

# Atualizar código (se usar Git)
git pull origin main

# Instalar dependências
npm ci

# Build
npm run build

# Recarregar Nginx
sudo systemctl reload nginx

echo "Frontend atualizado com sucesso!"
```

### 9.3 Tornar scripts executáveis

```bash
chmod +x update-backend.sh
chmod +x update-frontend.sh
```

---

## PARTE 10: Monitoramento e Logs

### Comandos Úteis PM2

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs

# Ver logs do backend
pm2 logs ziguealuga-backend

# Reiniciar aplicação
pm2 restart ziguealuga-backend

# Parar aplicação
pm2 stop ziguealuga-backend

# Ver informações detalhadas
pm2 info ziguealuga-backend

# Monitoramento
pm2 monit
```

### Logs do Nginx

```bash
# Access logs
sudo tail -f /var/log/nginx/ziguealuga.access.log
sudo tail -f /var/log/nginx/api.ziguealuga.access.log

# Error logs
sudo tail -f /var/log/nginx/ziguealuga.error.log
sudo tail -f /var/log/nginx/api.ziguealuga.error.log
```

### Logs do PostgreSQL

```bash
sudo tail -f /var/log/postgresql/postgresql-*.log
```

---

## PARTE 11: Backup

### Script de Backup do Banco de Dados

Crie `backup-database.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="ziguealuga_prod"
DB_USER="ziguealuga_user"

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Fazer backup
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup realizado: backup_$DATE.sql.gz"
```

### Agendar Backup Automático

```bash
# Editar crontab
crontab -e

# Adicionar linha para backup diário às 3h da manhã:
0 3 * * * /var/www/ziguealuga/backup-database.sh
```

---

## Checklist Final

- [ ] VPS atualizada
- [ ] Node.js 20 instalado
- [ ] PostgreSQL instalado e configurado
- [ ] PM2 instalado
- [ ] Nginx instalado
- [ ] Banco de dados criado
- [ ] Backend configurado com .env correto
- [ ] Backend rodando no PM2
- [ ] Frontend buildado
- [ ] Nginx configurado para frontend e backend
- [ ] SSL configurado (HTTPS)
- [ ] Firewall configurado
- [ ] DNS apontando corretamente
- [ ] Sites acessíveis via HTTPS
- [ ] Backups configurados

---

## Solução de Problemas Comuns

### Backend não está respondendo

```bash
# Verificar se está rodando
pm2 status

# Ver logs de erro
pm2 logs ziguealuga-backend --err

# Reiniciar
pm2 restart ziguealuga-backend
```

### Erro de conexão com banco de dados

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão
psql -h localhost -U ziguealuga_user -d ziguealuga_prod

# Verificar .env
cat /var/www/ziguealuga/backend/.env | grep DB_
```

### Nginx retorna 502 Bad Gateway

```bash
# Verificar se backend está rodando
curl http://localhost:5000/health

# Ver logs do Nginx
sudo tail -f /var/log/nginx/api.ziguealuga.error.log

# Verificar configuração
sudo nginx -t
```

### SSL não está funcionando

```bash
# Verificar certificados
sudo certbot certificates

# Renovar manualmente
sudo certbot renew

# Ver logs
sudo journalctl -u certbot
```

---

## Contatos e Suporte

- Documentação Hostinger: https://www.hostinger.com.br/tutoriais/
- Documentação PM2: https://pm2.keymetrics.io/docs/
- Documentação Nginx: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/docs/

---

**Sucesso no seu deploy profissional!** 🚀
