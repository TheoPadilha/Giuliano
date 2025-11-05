# 🏠 Ziguealuga - Sistema de Aluguel de Imóveis

Sistema completo de aluguel de imóveis desenvolvido com React (Frontend) e Node.js (Backend).

## 🌐 URLs de Produção

- **Frontend**: https://ziguealuga.com
- **Backend API**: https://api.ziguealuga.com
- **Painel Admin**: https://ziguealuga.com/admin

## 📁 Estrutura do Projeto

```
giuliano-alquileres/
├── frontend/           # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── services/
│   ├── .env.production
│   └── vercel.json
│
├── backend/            # Node.js + Express + PostgreSQL
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── .env.production.example
│   ├── render.yaml
│   └── Dockerfile
│
├── DEPLOY.md          # Guia completo de deploy
└── README.md          # Este arquivo
```

## 🚀 Início Rápido

### Desenvolvimento Local

1. **Clone o repositório**:
   ```bash
   git clone [url-do-repositorio]
   cd giuliano-alquileres
   ```

2. **Configure o Backend**:
   ```bash
   cd backend
   cp .env.example .env
   # Edite o .env com suas credenciais
   npm install
   npm run dev
   ```

3. **Configure o Frontend**:
   ```bash
   cd frontend
   cp .env.example .env
   # Edite o .env com as URLs locais
   npm install
   npm run dev
   ```

4. **Acesse a aplicação**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

### Deploy para Produção

Consulte o arquivo **[DEPLOY.md](./DEPLOY.md)** para instruções completas de deploy no domínio **ziguealuga.com**.

## 🛠️ Tecnologias

### Frontend
- **React 19** - Framework UI
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **React Query** - Gerenciamento de estado
- **Leaflet** - Mapas interativos
- **i18next** - Internacionalização
- **Framer Motion** - Animações

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **Sequelize** - ORM
- **JWT** - Autenticação
- **Mercado Pago** - Pagamentos
- **Multer** - Upload de arquivos
- **Nodemailer** - Envio de emails
- **Helmet** - Segurança

## 📦 Funcionalidades Principais

### Para Hóspedes
- ✅ Busca avançada de imóveis com filtros
- ✅ Visualização de detalhes e fotos
- ✅ Sistema de reservas com calendário
- ✅ Pagamento online via Mercado Pago
- ✅ Gestão de reservas (Minhas Reservas)
- ✅ Sistema de reviews e avaliações
- ✅ Favoritos
- ✅ Perfil do usuário

### Para Proprietários/Admins
- ✅ Painel administrativo completo
- ✅ CRUD de imóveis com upload de fotos
- ✅ Gestão de reservas
- ✅ Controle de disponibilidade
- ✅ Dashboard com estatísticas
- ✅ Gestão de usuários (admin_master)
- ✅ Sistema de reviews

### Funcionalidades Técnicas
- ✅ Autenticação JWT
- ✅ Autorização baseada em roles
- ✅ Upload de múltiplas imagens
- ✅ Integração com Google Maps
- ✅ Sistema de notificações por email
- ✅ Rate limiting
- ✅ Responsivo (mobile-first)
- ✅ Dark mode
- ✅ Internacionalização (PT/EN)
- ✅ SEO otimizado

## 🔐 Roles e Permissões

| Role | Permissões |
|------|-----------|
| **client** | Fazer reservas, avaliar imóveis, gerenciar perfil |
| **admin** | Todas de client + gerenciar próprios imóveis e reservas |
| **admin_master** | Todas as permissões do sistema, incluindo gestão de usuários |

## 🗃️ Banco de Dados

### Principais Tabelas
- `users` - Usuários do sistema
- `properties` - Imóveis cadastrados
- `property_photos` - Fotos dos imóveis
- `bookings` - Reservas
- `reviews` - Avaliações
- `favorites` - Favoritos dos usuários
- `cities` - Cidades disponíveis
- `amenities` - Comodidades

## 📊 Status do Projeto

- **Versão**: 1.0.0
- **Status**: ✅ Produção
- **Última atualização**: Novembro 2025

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é proprietário e confidencial.

## 📧 Contato

- **Website**: https://ziguealuga.com
- **Email**: contato@ziguealuga.com
- **Suporte**: suporte@ziguealuga.com

## 📋 To-Do / Próximas Features

- [ ] Sistema de chat em tempo real
- [ ] Integração com WhatsApp Business API
- [ ] App mobile (React Native)
- [ ] Sistema de pontos e fidelidade
- [ ] Recomendações personalizadas com IA
- [ ] Integração com mais gateways de pagamento
- [ ] Sistema de cupons e promoções
- [ ] Multi-idioma completo (ES, EN)

## 🐛 Bugs Conhecidos

Consulte o arquivo [ANOTAÇÕES.txt](./ANOTAÇÕES.txt) para ver a lista de bugs e melhorias planejadas.

## 📚 Documentação Adicional

- [Guia de Deploy](./DEPLOY.md) - Instruções completas de deploy
- [API Docs](./backend/API.md) - Documentação da API
- [Configuração de Email](./backend/docs/EMAIL.md) - Setup de emails
- [Mercado Pago](./backend/docs/MERCADOPAGO.md) - Integração de pagamentos

---

**Desenvolvido com ❤️ para ziguealuga.com**
