# 📚 Tutorial Completo: Deploy Full-Stack no CloudPanel

> **Projeto**: Giuliano Alquileres (Clone Airbnb)
> **Stack**: Node.js + Express + MySQL + React + Vite
> **Servidor**: CloudPanel + Ubuntu
> **Domínios**: ziguealuga.com (frontend) e api.ziguealuga.com (backend)

---

## 📋 Índice

1. [Informações do Servidor](#informações-do-servidor)
2. [Acesso Inicial ao CloudPanel](#acesso-inicial-ao-cloudpanel)
3. [Configuração do Banco de Dados MySQL](#configuração-do-banco-de-dados-mysql)
4. [Deploy do Backend (Node.js)](#deploy-do-backend-nodejs)
5. [Deploy do Frontend (React)](#deploy-do-frontend-react)
6. [Configuração de SSL/HTTPS](#configuração-de-sslhttps)
7. [Criação do Admin Master](#criação-do-admin-master)
8. [Popular Banco de Dados (Seed)](#popular-banco-de-dados-seed)
9. [Comandos SSH Úteis](#comandos-ssh-úteis)
10. [Troubleshooting](#troubleshooting)

---

## 🖥️ Informações do Servidor

### Dados de Acesso

```
IP do Servidor: 82.180.136.126
CloudPanel URL: http://82.180.136.126:8443

Usuários SSH:
- ziguealuga (frontend)
- ziguealuga-api (backend)

Domínios:
- Frontend: https://ziguealuga.com
- Backend API: https://api.ziguealuga.com
```

### Banco de Dados

```
Tipo: MySQL
Nome: ziguealugaProd
Usuário: theo
Senha: LNL0Fc8w4xm3CZVVWBJJ
Host: localhost
Porta: 3306
```

---

## 🔐 Acesso Inicial ao CloudPanel

### 1. Acessar o Painel

1. Abra o navegador e acesse: `http://82.180.136.126:8443`
2. Faça login com suas credenciais de admin

### 2. Criar Sites

No CloudPanel, você precisa criar **2 sites**:

#### Site 1: Frontend (ziguealuga.com)
- **Domain**: ziguealuga.com
- **Type**: Static (HTML/React)
- **User**: ziguealuga

#### Site 2: Backend (api.ziguealuga.com)
- **Domain**: api.ziguealuga.com
- **Type**: Node.js
- **User**: ziguealuga-api

---

## 🗄️ Configuração do Banco de Dados MySQL

### 1. Criar Banco via CloudPanel

1. No menu lateral, vá em **Databases**
2. Clique em **Add Database**
3. Preencha:
   - **Database Name**: `ziguealugaProd`
   - **Database User**: `theo`
   - **Password**: Gere uma senha forte
4. Anote as credenciais!

### 2. Adaptação do Código para MySQL

O projeto originalmente usava PostgreSQL. Fizemos as seguintes mudanças:

#### Arquivo: `backend/config/database.js`

```javascript
const dialect = process.env.DB_DIALECT || "postgres";

const config = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || (dialect === "mysql" ? 3306 : 5432),
  database: process.env.DB_NAME || "giuliano_alquileres",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  dialect: dialect,
  // ... resto da configuração
};
```

#### Arquivo: `backend/models/CityGuide.js`

**Mudança**: `JSONB` → `JSON` (MySQL não suporta JSONB)

```javascript
touristic_spots: {
  type: DataTypes.JSON, // Antes era JSONB
  allowNull: true,
},
```

---

## 🚀 Deploy do Backend (Node.js)

### 1. Conectar via SSH

```bash
ssh ziguealuga-api@82.180.136.126
```

Digite a senha quando solicitado.

### 2. Estrutura de Pastas

```
/home/ziguealuga-api/
├── htdocs/
│   └── backend/           # Arquivos do backend aqui
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── config/
│       ├── middleware/
│       ├── server.js
│       ├── package.json
│       └── .env
├── logs/
└── tmp/
```

### 3. Upload dos Arquivos Backend

**Opção A: Via SCP (Windows CMD/PowerShell)**

```bash
scp -r "C:\Users\theoh\Documents\MeusProjetos\Giuliano\giuliano-alquileres\backend\*" ziguealuga-api@82.180.136.126:~/htdocs/backend/
```

**Opção B: Via FileZilla**

1. Host: `82.180.136.126`
2. Username: `ziguealuga-api`
3. Password: [sua senha]
4. Port: `22`
5. Arraste a pasta `backend` para `/home/ziguealuga-api/htdocs/`

### 4. Configurar Variáveis de Ambiente (.env)

Conecte via SSH e crie o arquivo `.env`:

```bash
cd ~/htdocs/backend
nano .env
```

Cole o conteúdo:

```bash
# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=theo
DB_PASSWORD=LNL0Fc8w4xm3CZVVWBJJ
DB_NAME=ziguealugaProd
DB_DIALECT=mysql

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456

# CORS
CORS_ORIGIN=https://ziguealuga.com,https://www.ziguealuga.com

# URLs
FRONTEND_URL=https://ziguealuga.com
BACKEND_URL=https://api.ziguealuga.com

# Node
NODE_ENV=production
PORT=5000
```

**Salvar**: `Ctrl + O` → `Enter` → `Ctrl + X`

### 5. Instalar Dependências

```bash
cd ~/htdocs/backend
npm install
```

**Atenção**: Se houver erro com `uuid@13`, instale a versão 9:

```bash
npm uninstall uuid
npm install uuid@9.0.1
```

### 6. Executar Migrations

```bash
npx sequelize-cli db:migrate
```

### 7. Configurar PM2 (Process Manager)

PM2 mantém o Node.js rodando em background.

```bash
# Instalar PM2 localmente
npm install pm2

# Iniciar aplicação
npx pm2 start server.js --name backend

# Salvar configuração
npx pm2 save

# Ver status
npx pm2 status

# Ver logs
npx pm2 logs backend

# Reiniciar
npx pm2 restart backend

# Parar
npx pm2 stop backend
```

### 8. Testar Backend

Acesse no navegador:
```
https://api.ziguealuga.com/api/utilities/cities
```

Se retornar JSON, está funcionando! ✅

---

## 🎨 Deploy do Frontend (React)

### 1. Build Local

No seu PC Windows:

```bash
cd "C:\Users\theoh\Documents\MeusProjetos\Giuliano\giuliano-alquileres\frontend"
npm run build
```

Isso cria a pasta `dist/` com os arquivos otimizados.

### 2. Upload do Build

**Via SCP:**

```bash
scp -r "C:\Users\theoh\Documents\MeusProjetos\Giuliano\giuliano-alquileres\frontend\dist\*" ziguealuga@82.180.136.126:~/htdocs/
```

**Via FileZilla:**

1. Conecte com usuário `ziguealuga`
2. Vá para `/home/ziguealuga/htdocs/`
3. **Delete** tudo que está lá
4. Arraste **TODO o conteúdo** da pasta `dist` (não a pasta dist em si, mas o conteúdo dentro dela)

### 3. Configurar Nginx para SPA (React Router)

Edite o vhost do Nginx para suportar rotas do React:

**Via CloudPanel:**

1. Sites → ziguealuga.com → **Vhost**
2. Procure o bloco `location /`
3. Adicione `try_files`:

```nginx
server {
    root /home/ziguealuga/htdocs;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. Salve e recarregue Nginx

**Via SSH:**

```bash
sudo nano /etc/nginx/sites-enabled/ziguealuga.com.conf
```

Adicione o `try_files` e salve. Depois:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Testar Frontend

Acesse:
```
https://ziguealuga.com
```

O site React deve carregar! ✅

---

## 🔒 Configuração de SSL/HTTPS

### Via CloudPanel (Recomendado)

1. Vá em **Sites** → Clique no site
2. Aba **SSL/TLS**
3. Clique em **New Let's Encrypt Certificate**
4. Selecione os domínios (com e sem www)
5. Clique em **Create**

Repita para ambos os sites (frontend e backend).

### Verificação

- ✅ https://ziguealuga.com (deve ter cadeado verde)
- ✅ https://api.ziguealuga.com (deve ter cadeado verde)

---

## 👤 Criação do Admin Master

### 1. Conectar via SSH ao Backend

```bash
ssh ziguealuga-api@82.180.136.126
cd ~/htdocs/backend
```

### 2. Criar Script de Admin

```bash
nano create-admin-master.js
```

Cole o código:

```javascript
const { User } = require('./models');

async function createAdminMaster() {
  try {
    console.log('🔧 Criando usuário admin master...\n');

    const adminData = {
      name: 'Admin Master',
      email: 'admin@ziguealuga.com',
      password: 'admin123',  // Senha em TEXTO PLANO
      role: 'admin_master',
      status: 'active'
    };

    // User.create() vai criptografar automaticamente via hook beforeCreate
    const admin = await User.create(adminData);

    console.log('✅ Admin master criado com sucesso!');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Senha: admin123`);
    console.log(`👤 Role: ${admin.role}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createAdminMaster();
```

Salvar: `Ctrl + O` → `Enter` → `Ctrl + X`

### 3. Executar Script

```bash
node create-admin-master.js
```

### 4. Login

Acesse:
```
https://ziguealuga.com/admin/login
```

**Credenciais:**
- Email: `admin@ziguealuga.com`
- Senha: `admin123`

---

## 🌱 Popular Banco de Dados (Seed)

### 1. Criar Script de Seed

```bash
cd ~/htdocs/backend
nano seed-data.js
```

Cole o código completo (63 cidades SC + 12 comodidades):

```javascript
const { City, Amenity, sequelize } = require("./models");

const CITIES_SC = [
  { name: "Balneário Camboriú", state: "SC", region: "Litoral" },
  { name: "Florianópolis", state: "SC", region: "Litoral" },
  { name: "Bombinhas", state: "SC", region: "Litoral" },
  // ... (adicione todas as 63 cidades)
];

const AMENITIES = [
  { name: "Wi-Fi", icon: "wifi", category: "basic" },
  { name: "Ar Condicionado", icon: "snowflake", category: "comfort" },
  { name: "Piscina", icon: "waves", category: "comfort" },
  // ... (adicione todas as 12 comodidades)
];

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado ao banco");

    // Seed cidades
    for (const cityData of CITIES_SC) {
      const [city, isNew] = await City.findOrCreate({
        where: { name: cityData.name, state: cityData.state },
        defaults: cityData
      });
      if (isNew) console.log(`✅ Criada: ${cityData.name}`);
    }

    // Seed amenities
    for (const amenityData of AMENITIES) {
      const [amenity, isNew] = await Amenity.findOrCreate({
        where: { name: amenityData.name },
        defaults: amenityData
      });
      if (isNew) console.log(`✅ Criada: ${amenityData.name}`);
    }

    console.log("\n✅ Seed concluído!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
}

main();
```

Salvar: `Ctrl + O` → `Enter` → `Ctrl + X`

### 2. Executar Seed

```bash
node seed-data.js
```

**Resultado esperado:**
- 63 cidades cadastradas
- 12 comodidades cadastradas

---

## 🛠️ Comandos SSH Úteis

### Gerenciamento de Arquivos

```bash
# Listar arquivos
ls -la

# Navegar para pasta
cd ~/htdocs/backend

# Ver conteúdo de arquivo
cat .env

# Editar arquivo
nano server.js

# Criar pasta
mkdir nova-pasta

# Deletar arquivo
rm arquivo.txt

# Deletar pasta
rm -rf pasta/

# Copiar arquivo
cp origem.txt destino.txt

# Mover/Renomear
mv antigo.txt novo.txt
```

### PM2 (Process Manager)

```bash
# Ver processos rodando
pm2 status

# Ver logs em tempo real
pm2 logs backend

# Ver logs específicos (últimas 50 linhas)
pm2 logs backend --lines 50

# Reiniciar processo
pm2 restart backend

# Parar processo
pm2 stop backend

# Deletar processo
pm2 delete backend

# Iniciar novo processo
pm2 start server.js --name backend

# Salvar lista de processos
pm2 save
```

### Banco de Dados MySQL

```bash
# Conectar ao MySQL
mysql -u theo -p ziguealugaProd

# Comandos MySQL
SHOW TABLES;
SELECT * FROM cities LIMIT 10;
SELECT COUNT(*) FROM amenities;
EXIT;
```

### Git

```bash
# Ver status
git status

# Adicionar tudo
git add .

# Commit
git commit -m "Mensagem do commit"

# Push
git push origin main

# Pull (baixar atualizações)
git pull origin main
```

### Nginx

```bash
# Testar configuração
sudo nginx -t

# Recarregar configuração
sudo systemctl reload nginx

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver status
sudo systemctl status nginx
```

---

## 🔧 Troubleshooting

### Problema: Backend retorna 502 Bad Gateway

**Causa**: PM2 não está rodando

**Solução**:
```bash
ssh ziguealuga-api@82.180.136.126
pm2 status
pm2 start server.js --name backend
```

---

### Problema: CORS Error no Frontend

**Causa**: CORS_ORIGIN não configurado corretamente

**Solução**:
```bash
nano .env
```

Adicionar:
```bash
CORS_ORIGIN=https://ziguealuga.com,https://www.ziguealuga.com
```

Reiniciar PM2:
```bash
pm2 restart backend
```

---

### Problema: Imagens não aparecem

**Causa**: URLs das imagens estavam relativas

**Solução**: Já corrigido nos arquivos:
- `backend/controllers/uploadController.js`
- `backend/controllers/propertyController.js`

As URLs agora são completas:
```javascript
url: photo.cloudinary_url || `${backendUrl}/uploads/properties/${photo.filename}`
```

---

### Problema: Frontend mostra página em branco

**Causa**: Rotas do React não estão configuradas no Nginx

**Solução**: Adicionar `try_files` no vhost:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

### Problema: Login do admin não funciona (401)

**Causa**: Senha foi hashada duas vezes

**Solução**: Criar admin passando senha em texto plano:

```javascript
const admin = await User.create({
  email: 'admin@ziguealuga.com',
  password: 'admin123',  // Texto plano - o hook vai criptografar
  role: 'admin_master'
});
```

---

### Problema: Erro "weekend_price must be a number"

**Causa**: Backend exige todos os preços preenchidos

**Solução**: Atualizar textos no frontend para deixar claro que são obrigatórios (já feito em `PropertySteps.jsx`)

---

## 📁 Estrutura Completa do Projeto

```
/home/ziguealuga-api/htdocs/backend/
├── config/
│   └── database.js
├── controllers/
│   ├── propertyController.js
│   └── uploadController.js
├── models/
│   ├── User.js
│   ├── Property.js
│   ├── PropertyPhoto.js
│   ├── City.js
│   └── Amenity.js
├── routes/
│   ├── auth.js
│   ├── properties.js
│   └── utilities.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── uploads/
│   └── properties/
├── server.js
├── package.json
├── .env
└── seed-data.js

/home/ziguealuga/htdocs/
├── index.html
├── assets/
│   ├── index-*.js
│   └── index-*.css
└── vite.svg
```

---

## 🎯 Checklist de Deploy

- [ ] CloudPanel configurado
- [ ] Sites criados (frontend + backend)
- [ ] Banco MySQL criado
- [ ] Backend uploadado via SSH/SCP
- [ ] .env configurado com credenciais
- [ ] npm install executado
- [ ] Migrations rodadas
- [ ] PM2 iniciado e funcionando
- [ ] Frontend buildado localmente
- [ ] Frontend uploadado (dist/)
- [ ] Nginx configurado com try_files
- [ ] SSL instalado (Let's Encrypt)
- [ ] Admin master criado
- [ ] Seed executado (cidades + comodidades)
- [ ] Teste de login funcionando
- [ ] Teste de criação de imóvel funcionando
- [ ] Imagens aparecendo corretamente

---

## 🔗 Links Importantes

- **CloudPanel**: http://82.180.136.126:8443
- **Frontend**: https://ziguealuga.com
- **Backend API**: https://api.ziguealuga.com
- **Admin Panel**: https://ziguealuga.com/admin

---

## 📞 Comandos Rápidos de Emergência

### Reiniciar Tudo

```bash
# Backend
ssh ziguealuga-api@82.180.136.126
pm2 restart backend

# Nginx
sudo systemctl restart nginx
```

### Ver Logs de Erro

```bash
# PM2 logs
pm2 logs backend --err

# Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### Backup do Banco

```bash
mysqldump -u theo -p ziguealugaProd > backup.sql
```

### Restaurar Banco

```bash
mysql -u theo -p ziguealugaProd < backup.sql
```

---

## ✅ Tudo Pronto!

Agora você tem um site full-stack 100% funcional rodando no CloudPanel! 🎉

**Próximos passos opcionais:**
- Configurar Cloudinary (CDN de imagens)
- Configurar Gmail SMTP (emails)
- Configurar Mercado Pago (pagamentos)

---

*Tutorial criado por Claude Code - Deploy CloudPanel 2025*
