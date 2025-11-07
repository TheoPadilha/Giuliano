# 📧 Configuração SendGrid para Produção

## Por que SendGrid?
- ✅ 100 emails/dia GRÁTIS permanentemente
- ✅ Alta taxa de entrega (não cai no spam)
- ✅ Dashboard com analytics
- ✅ Fácil de configurar
- ✅ Usado por empresas como Uber, Airbnb, Spotify

---

## 🔧 Passo a Passo

### 1. Criar Conta SendGrid

1. Acesse: https://signup.sendgrid.com/
2. Preencha os dados:
   - Email: seu-email@gmail.com
   - Senha forte
   - Confirme email

3. Complete o formulário:
   - Company Name: Zigué Aluga
   - Website: ziguealuga.com
   - Role: Developer
   - Uso: Transactional emails

### 2. Criar API Key

1. No dashboard, vá em: **Settings** > **API Keys**
2. Clique em **Create API Key**
3. Nome: `Zigué Aluga Production`
4. Permissões: **Full Access**
5. Clique em **Create & View**
6. **COPIE A KEY** (você só verá uma vez!)
   - Exemplo: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Verificar Domínio (Opcional mas Recomendado)

#### Opção 1: Usar Email Genérico (Mais Rápido)
- Use: `noreply@sendgrid.net` ou seu email verificado
- **Limitação**: Menos profissional

#### Opção 2: Verificar Domínio Próprio (Profissional)
1. No SendGrid: **Settings** > **Sender Authentication**
2. Clique em **Authenticate Your Domain**
3. Escolha seu provedor DNS (Hostinger, GoDaddy, etc.)
4. Adicione os registros DNS fornecidos:
   - CNAME records (3-4 registros)
5. Aguarde verificação (até 48h)

**Exemplo de registros DNS:**
```
Type: CNAME
Host: s1._domainkey
Value: s1.domainkey.u12345.wl.sendgrid.net

Type: CNAME
Host: s2._domainkey
Value: s2.domainkey.u12345.wl.sendgrid.net
```

### 4. Configurar no .env

Edite `backend/.env`:

```env
# Configurações de Email (SendGrid - PRODUÇÃO)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Sua API Key aqui
SMTP_FROM_EMAIL=noreply@ziguealuga.com  # Ou seu email verificado
SMTP_FROM_NAME=Zigué Aluga
```

### 5. Testar Configuração

```bash
cd backend
node test-email.js seu-email@teste.com
```

Você deve ver:
```
✅ Email enviado com sucesso!
📨 Message ID: <xxxxxxxxxx@sendgrid.net>
```

---

## 📊 Monitorar Envios

### Dashboard SendGrid
Acesse: https://app.sendgrid.com/

**Você pode ver:**
- 📈 Total de emails enviados
- ✅ Taxa de entrega
- 📭 Emails abertos
- 🔗 Links clicados
- ⚠️ Bounces e spam reports

### Alertas
Configure alertas para:
- Quando atingir 80% do limite diário
- Se taxa de bounce for alta
- Se emails forem marcados como spam

---

## 🔒 Segurança

### Variáveis de Ambiente (.env)
```env
# ❌ NUNCA commite a API Key no Git!
SMTP_PASS=SG.sua_api_key_aqui
```

### .gitignore
Certifique-se que `.env` está no .gitignore:
```
.env
.env.production
.env.local
```

### Produção (VPS/CloudPanel)
Configure as variáveis de ambiente no servidor:
```bash
# No CloudPanel, vá em:
# Site > Environment Variables
# Adicione cada variável manualmente
```

---

## 📈 Planos e Limites

### Plano Gratuito (Permanente)
- ✅ 100 emails/dia
- ✅ 2.000 contatos
- ✅ Analytics básico
- ✅ API completa

### Plano Essentials ($19.95/mês)
- ✅ 50.000 emails/mês
- ✅ 5.000 contatos
- ✅ Analytics avançado
- ✅ Suporte por email

### Plano Pro ($89.95/mês)
- ✅ 100.000 emails/mês
- ✅ 100.000 contatos
- ✅ Suporte 24/7
- ✅ Testes A/B

---

## 🚨 Troubleshooting

### Email não chega
1. Verifique spam/lixo eletrônico
2. Confirme API Key correta
3. Verifique dashboard SendGrid para erros
4. Teste com outro email

### "Invalid API Key"
- API Key incorreta
- Recrie a API Key no dashboard
- Verifique se copiou completa (começa com SG.)

### Taxa de delivery baixa
- Verifique domínio autenticado
- Não use palavras spam no assunto
- Adicione link de descadastro
- Use templates HTML bem formatados

---

## 📧 Boas Práticas

### 1. Templates Profissionais
✅ Use HTML responsivo
✅ Inclua logo da empresa
✅ Botões claros de ação
✅ Link de descadastro

### 2. Evite Spam
❌ Não use CAPS LOCK excessivo
❌ Evite palavras como "GRÁTIS", "GANHE"
❌ Não envie sem consentimento
❌ Não compre listas de email

### 3. Monitore Métricas
📊 Taxa de abertura ideal: 15-25%
📊 Taxa de cliques ideal: 2-5%
📊 Taxa de bounce: < 2%
📊 Taxa de spam: < 0.1%

---

## 🔄 Migração Futura

Se crescer muito, considere:

### Amazon SES (Mais Barato)
- $0.10 por 1.000 emails
- 10.000 emails = $1
- 100.000 emails = $10

### Mailgun (Alternativa)
- Similar ao SendGrid
- Bom suporte
- Preços competitivos

---

## ✅ Checklist de Produção

- [ ] Conta SendGrid criada
- [ ] API Key gerada e salva
- [ ] Domínio verificado (opcional)
- [ ] .env configurado corretamente
- [ ] Teste de email realizado
- [ ] .env adicionado ao .gitignore
- [ ] Dashboard SendGrid configurado
- [ ] Alertas configurados

---

## 📞 Suporte

**SendGrid:**
- Documentação: https://docs.sendgrid.com/
- Suporte: https://support.sendgrid.com/

**Problemas?**
- Verifique logs do backend
- Consulte dashboard SendGrid
- Teste com test-email.js
