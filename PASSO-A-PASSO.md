# Deploy na VPS Hostinger - Passo a Passo Simplificado

Siga cada etapa COM CALMA. Cada passo é importante.

---

## ETAPA 1: Preparar DNS (Fazer AGORA no painel Hostinger)

1. Entre no painel da Hostinger
2. Vá em **Gerenciar Domínio** → **DNS / Nameservers**
3. Adicione/edite os seguintes registros:

```
Tipo: A
Nome: @
Valor: SEU_IP_DA_VPS
TTL: 3600

Tipo: A
Nome: www
Valor: SEU_IP_DA_VPS
TTL: 3600

Tipo: A
Nome: api
Valor: SEU_IP_DA_VPS
TTL: 3600
```

**IMPORTANTE**: DNS pode levar de 5 minutos a 24 horas para propagar. Quanto antes configurar, melhor!

---

## ETAPA 2: Preparar arquivos no seu PC

1. Abra o PowerShell/CMD na pasta do projeto
2. Execute:

```bash
cd giuliano-alquileres\deploy
.\prepare-upload.bat
```

Isso vai criar o arquivo `ziguealuga.zip` pronto para upload.

**OU** se preferir fazer manual:
- Crie um arquivo ZIP com as pastas: `backend`, `frontend`, `deploy`
- Exclua as pastas `node_modules` e `dist` para economizar espaço

---

## ETAPA 3: Enviar arquivos para VPS

**Opção A: Usando WinSCP (Recomendado - mais fácil)**

1. Baixe WinSCP: https://winscp.net/
2. Conecte na VPS:
   - Host: IP da VPS
   - Usuário: seu usuário SSH
   - Senha: sua senha SSH
3. Arraste o arquivo `ziguealuga.zip` para a pasta `/tmp/` da VPS

**Opção B: Usando comando SCP**

```bash
scp ziguealuga.zip usuario@IP_DA_VPS:/tmp/
```

---

## ETAPA 4: Conectar na VPS via SSH

Use PuTTY ou PowerShell:

```bash
ssh usuario@IP_DA_VPS
```

---

## ETAPA 5: Extrair arquivos e dar permissões

```bash
# Extrair
cd /tmp
unzip ziguealuga.zip -d /tmp/projeto

# Dar permissão de execução nos scripts
chmod +x /tmp/projeto/deploy/*.sh
```

---

## ETAPA 6: Instalar tudo automaticamente

```bash
bash /tmp/projeto/deploy/install-vps.sh
```

Esse script vai instalar:
- Node.js 20
- PostgreSQL
- PM2
- Nginx
- Certbot (SSL)

**Tempo estimado**: 5-10 minutos

Quando terminar, você verá: ✓ Instalação concluída com sucesso!

---

## ETAPA 7: Configurar banco de dados

```bash
bash /tmp/projeto/deploy/setup-database.sh
```

Você vai precisar:
1. Criar uma senha SEGURA para o banco
2. Confirmar a senha
3. **ANOTE ESSA SENHA!** Você vai precisar dela no próximo passo!

Ao final, você verá as credenciais do banco. **COPIE E GUARDE!**

---

## ETAPA 8: Mover arquivos para local definitivo

```bash
sudo mkdir -p /var/www/ziguealuga
sudo chown -R $USER:$USER /var/www/ziguealuga
cp -r /tmp/projeto/* /var/www/ziguealuga/
```

---

## ETAPA 9: Configurar variáveis de ambiente do BACKEND

```bash
cd /var/www/ziguealuga/backend
cp .env.vps .env
nano .env
```

Agora você está editando o arquivo `.env`. Use as setas do teclado para navegar.

**Preencha ESTES campos** (substitua tudo que está em CAPS):

```env
DB_PASSWORD=A_SENHA_QUE_VOCE_CRIOU_NO_PASSO_7

JWT_SECRET=COLE_AQUI_A_CHAVE_ABAIXO

SMTP_USER=seu_email@gmail.com
SMTP_PASS=SUA_SENHA_DE_APP_GMAIL

MERCADOPAGO_ACCESS_TOKEN=APP_USR_SEU_TOKEN_DE_PRODUCAO
MERCADOPAGO_PUBLIC_KEY=APP_USR_SUA_PUBLIC_KEY_DE_PRODUCAO
```

**Para gerar o JWT_SECRET**, abra OUTRO terminal SSH (mantenha o nano aberto) e execute:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e cole no `.env` no campo `JWT_SECRET=`

**Para salvar o arquivo no nano**:
1. Pressione `Ctrl+O` (letra O)
2. Pressione `Enter`
3. Pressione `Ctrl+X`

---

## ETAPA 10: Configurar variáveis de ambiente do FRONTEND

```bash
cd /var/www/ziguealuga/frontend
nano .env.production
```

Cole isto (substitua a PUBLIC_KEY):

```env
VITE_API_URL=https://api.ziguealuga.com
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR_SUA_PUBLIC_KEY_REAL
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## ETAPA 11: Fazer deploy do BACKEND

```bash
bash /var/www/ziguealuga/deploy/deploy-backend.sh
```

Esse script vai:
1. Instalar dependências do backend
2. Rodar migrações do banco
3. Iniciar o backend com PM2

**Ao final**, você deve ver: ✓ Backend respondendo corretamente!

Se der erro, me mande os logs:
```bash
pm2 logs ziguealuga-backend
```

---

## ETAPA 12: Fazer deploy do FRONTEND

```bash
bash /var/www/ziguealuga/deploy/deploy-frontend.sh
```

Esse script vai:
1. Instalar dependências do frontend
2. Fazer o build de produção
3. Colocar os arquivos no lugar certo

**Tempo estimado**: 2-5 minutos (o build pode demorar um pouco)

---

## ETAPA 13: Configurar NGINX

```bash
# Copiar configurações
sudo cp /var/www/ziguealuga/deploy/nginx-api.conf /etc/nginx/sites-available/api.ziguealuga.com
sudo cp /var/www/ziguealuga/deploy/nginx-frontend.conf /etc/nginx/sites-available/ziguealuga.com

# Ativar sites
sudo ln -s /etc/nginx/sites-available/api.ziguealuga.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ziguealuga.com /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t
```

Você deve ver: **syntax is ok** e **test is successful**

Se deu OK, recarregue o Nginx:
```bash
sudo systemctl reload nginx
```

---

## ETAPA 14: Configurar SSL (HTTPS) - PASSO FINAL!

```bash
bash /var/www/ziguealuga/deploy/setup-ssl.sh
```

Vai pedir:
1. Seu email (para notificações do Let's Encrypt)
2. Confirmação para continuar

O script vai configurar HTTPS para todos os domínios automaticamente!

**IMPORTANTE**: O DNS precisa estar apontando corretamente. Se der erro, espere mais um pouco a propagação do DNS.

---

## PRONTO! Agora teste:

Abra no navegador:

1. **https://ziguealuga.com** → Deve mostrar o site
2. **https://api.ziguealuga.com/health** → Deve mostrar resposta da API

---

## Comandos úteis para monitorar:

```bash
# Ver status do backend
pm2 status

# Ver logs em tempo real
pm2 logs ziguealuga-backend

# Reiniciar backend se precisar
pm2 restart ziguealuga-backend

# Ver logs de erro do Nginx
sudo tail -f /var/log/nginx/ziguealuga.error.log
sudo tail -f /var/log/nginx/api.ziguealuga.error.log
```

---

## Se algo der errado:

**Backend não inicia:**
```bash
pm2 logs ziguealuga-backend --err
```

**Não consegue conectar no banco:**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão
psql -h localhost -U ziguealuga_user -d ziguealuga_prod
```

**Site não abre (502 Bad Gateway):**
```bash
# Verificar se backend está respondendo
curl http://localhost:5000/health

# Ver logs do Nginx
sudo tail -f /var/log/nginx/api.ziguealuga.error.log
```

---

## Atualizações futuras:

Quando quiser atualizar o código:

```bash
# Atualizar backend
cd /var/www/ziguealuga
bash deploy/deploy-backend.sh

# Atualizar frontend
bash deploy/deploy-frontend.sh
```

---

**Boa sorte com o deploy profissional!** 🚀

Se precisar de ajuda em algum passo específico, me chame e me diga em qual ETAPA você está.
