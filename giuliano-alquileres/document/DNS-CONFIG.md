# 🌐 Configuração DNS - ziguealuga.com

Este documento descreve como configurar os registros DNS para o domínio **ziguealuga.com**.

## 📍 Registros DNS Necessários

Configure os seguintes registros no painel do seu provedor de domínio (GoDaddy, Hostinger, Registro.br, etc.):

### Opção 1: Usando Vercel (Recomendado)

```
┌─────────────────────────────────────────────────────────────┐
│ Tipo    │ Nome    │ Valor                                   │
├─────────────────────────────────────────────────────────────┤
│ A       │ @       │ 76.76.21.21                            │
│ CNAME   │ www     │ cname.vercel-dns.com                   │
│ CNAME   │ api     │ [seu-app].onrender.com                 │
└─────────────────────────────────────────────────────────────┘
```

**Explicação**:
- **A (@)**: Aponta o domínio raiz (ziguealuga.com) para o Vercel
- **CNAME (www)**: Redireciona www.ziguealuga.com para o Vercel
- **CNAME (api)**: Aponta api.ziguealuga.com para o backend no Render

### Opção 2: DNS com IPs customizados

```
┌─────────────────────────────────────────────────────────────┐
│ Tipo    │ Nome    │ Valor                           │ TTL  │
├─────────────────────────────────────────────────────────────┤
│ A       │ @       │ [IP do frontend]               │ 3600 │
│ A       │ www     │ [IP do frontend]               │ 3600 │
│ A       │ api     │ [IP do backend]                │ 3600 │
│ TXT     │ @       │ "v=spf1 include:_spf.google... │ 3600 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuração por Provedor

### GoDaddy

1. Acesse: https://dcc.godaddy.com/domains/
2. Clique no domínio **ziguealuga.com**
3. Vá em "DNS" → "Manage DNS"
4. Adicione os registros conforme tabela acima
5. TTL: Use 600 (10 minutos) inicialmente, depois mude para 3600

### Hostinger

1. Acesse: https://hpanel.hostinger.com/
2. Vá em "Domains" → selecione **ziguealuga.com**
3. Clique em "DNS Zone"
4. Adicione os registros
5. Aguarde propagação (até 24h, geralmente 1-2h)

### Registro.br

1. Acesse: https://registro.br/
2. Faça login com sua conta
3. Vá em "Meus Domínios" → **ziguealuga.com.br**
4. Clique em "Editar Zona"
5. Adicione os registros DNS
6. Salve alterações

### Cloudflare (Recomendado para melhor performance)

1. Crie conta: https://dash.cloudflare.com/
2. Adicione o site: **ziguealuga.com**
3. Cloudflare fornecerá nameservers:
   ```
   dante.ns.cloudflare.com
   nora.ns.cloudflare.com
   ```
4. Configure esses nameservers no seu registrador de domínio
5. No painel do Cloudflare, adicione os registros DNS
6. **Vantagens**:
   - SSL gratuito
   - CDN global
   - Proteção DDoS
   - Cache automático
   - Analytics

---

## 📧 Configuração de Email

### Gmail/Google Workspace

Se quiser usar emails profissionais (contato@ziguealuga.com):

```
┌────────────────────────────────────────────────────────────┐
│ Tipo  │ Nome  │ Valor                               │ TTL  │
├────────────────────────────────────────────────────────────┤
│ MX    │ @     │ 1 aspmx.l.google.com              │ 3600 │
│ MX    │ @     │ 5 alt1.aspmx.l.google.com         │ 3600 │
│ MX    │ @     │ 5 alt2.aspmx.l.google.com         │ 3600 │
│ TXT   │ @     │ v=spf1 include:_spf.google.com ~all│ 3600│
│ CNAME │ mail  │ ghs.google.com                     │ 3600 │
└────────────────────────────────────────────────────────────┘
```

### SendGrid (para emails transacionais)

```
┌────────────────────────────────────────────────────────────┐
│ Tipo  │ Nome            │ Valor                      │ TTL  │
├────────────────────────────────────────────────────────────┤
│ CNAME │ em123           │ u123456.wl.sendgrid.net   │ 3600 │
│ CNAME │ s1._domainkey   │ s1.domainkey.u123456...   │ 3600 │
│ CNAME │ s2._domainkey   │ s2.domainkey.u123456...   │ 3600 │
└────────────────────────────────────────────────────────────┘
```

---

## ✅ Verificação da Configuração

### Verificar Propagação DNS

```bash
# Verificar domínio principal
nslookup ziguealuga.com

# Verificar www
nslookup www.ziguealuga.com

# Verificar API
nslookup api.ziguealuga.com

# Verificar com DNS específico (Google)
nslookup ziguealuga.com 8.8.8.8
```

### Ferramentas Online

- **WhatsMyDNS**: https://whatsmydns.net/
  - Digite: `ziguealuga.com`
  - Tipo: `A`
  - Veja a propagação global

- **DNS Checker**: https://dnschecker.org/
  - Verifica DNS em múltiplos servidores mundialmente

- **MXToolbox**: https://mxtoolbox.com/
  - Verifica configurações de email (MX records)

### Testar SSL/HTTPS

```bash
# Verificar certificado SSL
openssl s_client -connect ziguealuga.com:443 -servername ziguealuga.com

# Verificar via curl
curl -I https://ziguealuga.com
curl -I https://api.ziguealuga.com
```

---

## ⏱️ Tempo de Propagação

| Provedor | Tempo Médio | Tempo Máximo |
|----------|-------------|--------------|
| GoDaddy | 1-2 horas | 24 horas |
| Hostinger | 30-60 min | 24 horas |
| Registro.br | 2-4 horas | 48 horas |
| Cloudflare | 2-5 min | 5 min |

**Dica**: Use TTL baixo (600) durante configuração inicial, depois aumente para 3600 ou 86400.

---

## 🔐 Certificado SSL

### Vercel (Automático)

O Vercel gera certificado SSL automaticamente após:
1. DNS configurado corretamente
2. Domínio verificado
3. Propagação DNS completa

### Render (Automático)

O Render também gera SSL automaticamente:
1. Configure o domínio customizado
2. Adicione registro CNAME
3. Aguarde verificação (5-10 min)

### Let's Encrypt (Manual)

Se hospedar em servidor próprio:

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot --nginx -d ziguealuga.com -d www.ziguealuga.com -d api.ziguealuga.com

# Renovação automática
sudo certbot renew --dry-run
```

---

## 🔍 Troubleshooting

### Problema: DNS não resolve

**Solução**:
1. Verifique se os nameservers estão corretos
2. Aguarde propagação (até 48h)
3. Limpe cache DNS local:
   ```bash
   # Windows
   ipconfig /flushdns

   # macOS
   sudo dscacheutil -flushcache

   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Problema: www funciona mas @ não

**Solução**:
- Adicione registro A para @ (raiz)
- Configure redirect de @ para www (ou vice-versa)

### Problema: API não resolve

**Solução**:
1. Verifique CNAME do subdomínio `api`
2. Confirme que aponta para o hostname correto do Render
3. Aguarde propagação DNS

### Problema: SSL não funciona

**Solução**:
1. Verifique se DNS está propagado
2. Force renovação no painel do provedor
3. Aguarde 10-30 minutos após configurar DNS
4. Verifique se não há erro de configuração no certificado

---

## 📊 Configuração Recomendada Final

```dns
; ziguealuga.com - Configuração DNS Completa
; Última atualização: 05/11/2025

; Frontend (Vercel)
@           3600  IN  A       76.76.21.21
www         3600  IN  CNAME   cname.vercel-dns.com.

; Backend (Render)
api         3600  IN  CNAME   ziguealuga-api.onrender.com.

; Email (Google Workspace)
@           3600  IN  MX      1 aspmx.l.google.com.
@           3600  IN  MX      5 alt1.aspmx.l.google.com.
@           3600  IN  TXT     "v=spf1 include:_spf.google.com ~all"

; Verificação
_vercel     3600  IN  TXT     "vercel-token-123..."
```

---

## 🎯 Checklist de Configuração

Antes de lançar em produção:

- [ ] Registros A configurados
- [ ] CNAME para www configurado
- [ ] CNAME para api configurado
- [ ] DNS propagado globalmente (verificar em whatsmydns.net)
- [ ] SSL/HTTPS funcionando em todos os domínios
- [ ] Redirect HTTP → HTTPS ativo
- [ ] MX records configurados (se usar email)
- [ ] SPF/DKIM configurados (se usar email)
- [ ] Teste completo de todas as URLs:
  - https://ziguealuga.com
  - https://www.ziguealuga.com
  - https://api.ziguealuga.com
  - https://api.ziguealuga.com/health

---

**Última atualização**: 05/11/2025
**Domínio**: ziguealuga.com
