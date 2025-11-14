# Deploy na VPS Hostinger - Guia Rápido

Scripts prontos para fazer o deploy do Ziguealuga.com na VPS da Hostinger.

## Pré-requisitos

Antes de começar, você precisa:

1. **Acesso SSH à VPS**
   - IP da VPS
   - Usuário e senha

2. **DNS Configurado**
   - No painel da Hostinger, configure:
     - Registro A: `@` apontando para o IP da VPS
     - Registro A: `www` apontando para o IP da VPS
     - Registro A: `api` apontando para o IP da VPS

3. **Informações que você vai precisar**
   - Email do Gmail para SMTP
   - Senha de app do Gmail ([como criar](https://support.google.com/accounts/answer/185833))
   - Access Token do Mercado Pago (produção)
   - Public Key do Mercado Pago (produção)

## Ordem de Execução

### 1. Enviar arquivos para a VPS

Do seu computador local, envie os arquivos:

```bash
# Comprimir o projeto
cd giuliano-alquileres
tar -czf ziguealuga.tar.gz backend frontend deploy

# Enviar para a VPS
scp ziguealuga.tar.gz usuario@IP_DA_VPS:/tmp/
```

### 2. Conectar via SSH e extrair arquivos

```bash
# Conectar na VPS
ssh usuario@IP_DA_VPS

# Extrair arquivos
cd /tmp
tar -xzf ziguealuga.tar.gz -C /tmp/

# Tornar scripts executáveis
chmod +x /tmp/deploy/*.sh
```

### 3. Executar scripts na ordem

#### 3.1 Instalar ambiente
```bash
bash /tmp/deploy/install-vps.sh
```

#### 3.2 Configurar banco de dados
```bash
bash /tmp/deploy/setup-database.sh
```
**IMPORTANTE**: Anote a senha do banco que você criar!

#### 3.3 Mover arquivos para local correto
```bash
sudo mkdir -p /var/www/ziguealuga
sudo chown -R $USER:$USER /var/www/ziguealuga
cp -r /tmp/backend /var/www/ziguealuga/
cp -r /tmp/frontend /var/www/ziguealuga/
cp -r /tmp/deploy /var/www/ziguealuga/
```

#### 3.4 Configurar variáveis de ambiente do Backend
```bash
cd /var/www/ziguealuga/backend
cp .env.vps .env
nano .env
```

Edite e preencha:
- `DB_PASSWORD` - A senha que você criou no passo 3.2
- `JWT_SECRET` - Execute: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `SMTP_USER` - Seu email do Gmail
- `SMTP_PASS` - Senha de app do Gmail
- `MERCADOPAGO_ACCESS_TOKEN` - Token de produção
- `MERCADOPAGO_PUBLIC_KEY` - Public key de produção

Salve com: `Ctrl+O`, `Enter`, `Ctrl+X`

#### 3.5 Configurar variáveis de ambiente do Frontend
```bash
cd /var/www/ziguealuga/frontend
nano .env.production
```

```env
VITE_API_URL=https://api.ziguealuga.com
VITE_MERCADOPAGO_PUBLIC_KEY=SUA_PUBLIC_KEY_REAL
```

Salve com: `Ctrl+O`, `Enter`, `Ctrl+X`

#### 3.6 Deploy do Backend
```bash
bash /var/www/ziguealuga/deploy/deploy-backend.sh
```

#### 3.7 Deploy do Frontend
```bash
bash /var/www/ziguealuga/deploy/deploy-frontend.sh
```

#### 3.8 Configurar Nginx
```bash
# Copiar configurações
sudo cp /var/www/ziguealuga/deploy/nginx-api.conf /etc/nginx/sites-available/api.ziguealuga.com
sudo cp /var/www/ziguealuga/deploy/nginx-frontend.conf /etc/nginx/sites-available/ziguealuga.com

# Ativar sites
sudo ln -s /etc/nginx/sites-available/api.ziguealuga.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ziguealuga.com /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

#### 3.9 Configurar SSL (HTTPS)
```bash
bash /var/www/ziguealuga/deploy/setup-ssl.sh
```

## Verificação

Teste se tudo está funcionando:

```bash
# Verificar backend
pm2 status
curl http://localhost:5000/health

# Ver logs
pm2 logs ziguealuga-backend
```

Acesse no navegador:
- https://ziguealuga.com
- https://api.ziguealuga.com/health

## Comandos Úteis

```bash
# Ver logs do backend
pm2 logs ziguealuga-backend

# Reiniciar backend
pm2 restart ziguealuga-backend

# Ver status
pm2 status

# Monitorar
pm2 monit

# Logs do Nginx
sudo tail -f /var/log/nginx/ziguealuga.error.log
sudo tail -f /var/log/nginx/api.ziguealuga.error.log
```

## Atualização Futura

Para atualizar a aplicação no futuro:

```bash
# Atualizar backend
cd /var/www/ziguealuga
bash deploy/deploy-backend.sh

# Atualizar frontend
bash deploy/deploy-frontend.sh
```

## Problemas Comuns

### Backend não responde
```bash
pm2 logs ziguealuga-backend --err
pm2 restart ziguealuga-backend
```

### Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão manualmente
psql -h localhost -U ziguealuga_user -d ziguealuga_prod
```

### Nginx retorna 502
```bash
# Verificar se backend está rodando
curl http://localhost:5000/health

# Ver logs do Nginx
sudo tail -f /var/log/nginx/api.ziguealuga.error.log
```

## Suporte

- Documentação Hostinger: https://www.hostinger.com.br/tutoriais/
- PM2: https://pm2.keymetrics.io/docs/
- Nginx: https://nginx.org/en/docs/
