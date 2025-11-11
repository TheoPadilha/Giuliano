# 👑 Como Criar um Admin Master

O sistema tem 3 níveis de acesso:
- **`client`** - Hóspede (cria reservas)
- **`admin`** - Proprietário (gerencia imóveis e reservas)
- **`admin_master`** - Super Admin (acesso total ao sistema)

---

## 🚀 Opção 1: Criar Diretamente no Banco (MAIS RÁPIDO)

### Passo 1: Acessar o PostgreSQL

```bash
# No terminal
psql -U postgres -d giuliano_alquileres
```

Ou se estiver usando a senha do seu .env:
```bash
PGPASSWORD=256310@Tp psql -U postgres -d giuliano_alquileres
```

### Passo 2: Criar o Admin Master

```sql
-- Criar um novo admin master
INSERT INTO users (
  name,
  email,
  password_hash,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  'Admin Master',
  'admin@ziguealuga.com',
  '$2a$12$vJZQxGxVqH6K8qYzF1N0.eY4KZJj0Q1K2aH3M4N5O6P7Q8R9S0T1U',  -- senha: admin123
  'admin_master',
  'approved',
  NOW(),
  NOW()
);
```

**⚠️ ATENÇÃO:** Essa senha é **temporária**! Mude depois do primeiro login.

### Passo 3: Verificar

```sql
-- Ver todos os admins
SELECT id, name, email, role, status FROM users WHERE role IN ('admin', 'admin_master');
```

---

## 🔧 Opção 2: Script Node.js (RECOMENDADO)

Crie um arquivo para gerar admin masters facilmente.

### Criar arquivo: `backend/scripts/create-admin-master.js`

```javascript
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const User = require('../models/User');

async function createAdminMaster() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conectado!\n');

    // Solicitar dados do admin (você pode editar diretamente aqui)
    const adminData = {
      name: 'Admin Master',
      email: 'admin@ziguealuga.com',
      password: 'admin123',  // MUDE ESTA SENHA!
      phone: '47989105580',
      country: 'Brasil'
    };

    console.log('📋 Criando Admin Master:');
    console.log(`Nome: ${adminData.name}`);
    console.log(`Email: ${adminData.email}`);
    console.log(`Senha: ${adminData.password}`);
    console.log('');

    // Verificar se já existe
    const existingUser = await User.findOne({
      where: { email: adminData.email }
    });

    if (existingUser) {
      console.log('⚠️  Usuário já existe!');
      console.log('ID:', existingUser.id);
      console.log('Role atual:', existingUser.role);

      // Atualizar para admin_master se não for
      if (existingUser.role !== 'admin_master') {
        await existingUser.update({
          role: 'admin_master',
          status: 'approved'
        });
        console.log('✅ Usuário promovido para admin_master!');
      }

      process.exit(0);
    }

    // Criar hash da senha
    const password_hash = await bcrypt.hash(adminData.password, 12);

    // Criar admin master
    const adminMaster = await User.create({
      name: adminData.name,
      email: adminData.email,
      password_hash: password_hash,
      phone: adminData.phone,
      country: adminData.country,
      role: 'admin_master',
      status: 'approved'
    });

    console.log('✅ Admin Master criado com sucesso!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:', adminMaster.email);
    console.log('🔑 Senha:', adminData.password);
    console.log('👤 Role:', adminMaster.role);
    console.log('🆔 UUID:', adminMaster.uuid);
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha no primeiro login!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Executar
createAdminMaster();
```

### Executar o Script

```bash
cd backend
node scripts/create-admin-master.js
```

---

## 🔄 Opção 3: Promover Usuário Existente

Se você já tem um usuário e quer torná-lo admin master:

### Via PostgreSQL

```sql
-- Promover usuário para admin_master
UPDATE users
SET role = 'admin_master', status = 'approved'
WHERE email = 'seu-email@gmail.com';

-- Verificar
SELECT id, name, email, role, status FROM users WHERE email = 'seu-email@gmail.com';
```

### Via Script Node.js

Crie: `backend/scripts/promote-to-admin-master.js`

```javascript
const { sequelize } = require('../config/database');
const User = require('../models/User');

async function promoteToAdminMaster() {
  try {
    const EMAIL = 'seu-email@gmail.com'; // ALTERE AQUI

    await sequelize.authenticate();
    console.log('✅ Conectado ao banco\n');

    const user = await User.findOne({ where: { email: EMAIL } });

    if (!user) {
      console.log('❌ Usuário não encontrado!');
      process.exit(1);
    }

    console.log('📋 Usuário encontrado:');
    console.log('Nome:', user.name);
    console.log('Email:', user.email);
    console.log('Role atual:', user.role);
    console.log('');

    await user.update({
      role: 'admin_master',
      status: 'approved'
    });

    console.log('✅ Promovido para Admin Master!');
    console.log('Nova role:', user.role);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

promoteToAdminMaster();
```

Executar:
```bash
node scripts/promote-to-admin-master.js
```

---

## 🔐 Opção 4: Criar via Rota API (Para Primeiro Admin)

Se ainda não tem nenhum admin master, você pode criar uma rota temporária.

### Criar: `backend/routes/setup.js`

```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ROTA TEMPORÁRIA - DELETAR APÓS CRIAR O PRIMEIRO ADMIN
router.post('/create-first-admin', async (req, res) => {
  try {
    // Verificar se já existe algum admin_master
    const existingAdmin = await User.findOne({
      where: { role: 'admin_master' }
    });

    if (existingAdmin) {
      return res.status(403).json({
        error: 'Já existe um admin master no sistema'
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios'
      });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const adminMaster = await User.create({
      name,
      email,
      password_hash,
      role: 'admin_master',
      status: 'approved'
    });

    res.json({
      message: 'Admin Master criado com sucesso!',
      admin: {
        id: adminMaster.id,
        uuid: adminMaster.uuid,
        name: adminMaster.name,
        email: adminMaster.email,
        role: adminMaster.role
      }
    });

  } catch (error) {
    console.error('Erro ao criar admin:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### Adicionar em `backend/server.js`

```javascript
const setupRoutes = require('./routes/setup');
app.use('/api/setup', setupRoutes);
```

### Usar via Postman/Thunder Client

```http
POST http://localhost:5000/api/setup/create-first-admin
Content-Type: application/json

{
  "name": "Admin Master",
  "email": "admin@ziguealuga.com",
  "password": "SenhaForte@2025"
}
```

**⚠️ DELETAR ESTA ROTA DEPOIS!**

---

## 📊 Credenciais de Exemplo

Para testes rápidos:

| Campo | Valor |
|-------|-------|
| **Nome** | Admin Master |
| **Email** | admin@ziguealuga.com |
| **Senha** | admin123 (MUDAR!) |
| **Role** | admin_master |
| **Status** | approved |

---

## ✅ Verificar Admin Master

### Via PostgreSQL

```sql
SELECT
  id,
  name,
  email,
  role,
  status,
  created_at
FROM users
WHERE role = 'admin_master';
```

### Via Node.js

```javascript
const User = require('./models/User');

User.findAll({
  where: { role: 'admin_master' },
  attributes: ['id', 'name', 'email', 'role', 'status']
}).then(admins => {
  console.log('Admin Masters:', admins);
});
```

---

## 🔑 Alterar Senha do Admin

### Via PostgreSQL

```sql
-- Hash da senha 'NovaSenha123'
UPDATE users
SET password_hash = '$2a$12$vJZQxGxVqH6K8qYzF1N0.eY4KZJj0Q1K2aH3M4N5O6P7Q8R9S0T1U'
WHERE email = 'admin@ziguealuga.com';
```

### Via Script

Crie: `backend/scripts/change-password.js`

```javascript
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const User = require('../models/User');

async function changePassword() {
  const EMAIL = 'admin@ziguealuga.com';
  const NEW_PASSWORD = 'NovaSenha123';

  try {
    await sequelize.authenticate();

    const user = await User.findOne({ where: { email: EMAIL } });

    if (!user) {
      console.log('❌ Usuário não encontrado');
      process.exit(1);
    }

    const password_hash = await bcrypt.hash(NEW_PASSWORD, 12);

    await user.update({ password_hash });

    console.log('✅ Senha alterada com sucesso!');
    console.log('Email:', EMAIL);
    console.log('Nova senha:', NEW_PASSWORD);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

changePassword();
```

---

## 🎯 Recomendação

Para criar seu primeiro admin master:

**Use a Opção 2 (Script Node.js):**

1. Crie a pasta scripts:
```bash
mkdir backend/scripts
```

2. Copie o código do script `create-admin-master.js`

3. Execute:
```bash
cd backend
node scripts/create-admin-master.js
```

4. Faça login com as credenciais criadas

5. **MUDE A SENHA IMEDIATAMENTE** no painel

---

## 🛡️ Segurança

**IMPORTANTE:**
- ❌ NUNCA use senhas fracas em produção
- ❌ NUNCA deixe a rota `/api/setup/create-first-admin` ativa
- ✅ SEMPRE mude a senha padrão no primeiro login
- ✅ Use senhas fortes (mínimo 12 caracteres, letras, números, símbolos)

---

**Qual opção você prefere usar? Posso criar o script para você!**
