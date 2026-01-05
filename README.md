# 🏖️ Zigue Aluga

<div align="center">

![Zigue Aluga](https://img.shields.io/badge/Zigue%20Aluga-Platform-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql)
![Status](https://img.shields.io/badge/Status-Production-success)

**Plataforma completa de aluguel de imóveis para temporada no Litoral Catarinense**

[🌐 Demo](https://ziguealuga.com) · [📋 Documentação](#documentação) · [🐛 Reportar Bug](https://wa.me/5547989105580)

</div>

---

## 📋 Sobre o Projeto

O **Zigue Aluga** é uma plataforma moderna de aluguel de imóveis para temporada, inspirada no modelo de negócio do Airbnb, desenvolvida especificamente para o mercado de locações sazonais no litoral de Santa Catarina. A plataforma conecta proprietários de imóveis a hóspedes que buscam acomodações para férias, oferecendo uma experiência completa de reserva online.

### 🎯 Problema que Resolve

- **Para Proprietários**: Centraliza a gestão de propriedades, automatiza reservas e facilita a comunicação com hóspedes
- **Para Hóspedes**: Oferece uma plataforma intuitiva para buscar, comparar e reservar imóveis de forma segura
- **Para o Mercado**: Profissionaliza o mercado de locações temporárias no litoral catarinense

### ✨ Principais Funcionalidades

#### 🏠 Gestão de Imóveis
- **Cadastro Completo**: Sistema CRUD para propriedades com múltiplas fotos
- **Categorização**: Apartamentos, casas, chalés e mais
- **Localização**: Integração com mapas para visualização da região
- **Comodidades**: Tags para WiFi, piscina, ar-condicionado, etc.

#### 👥 Sistema de Usuários
- **Autenticação JWT**: Login seguro com tokens
- **Perfis Diferenciados**: Proprietários e hóspedes
- **Dashboard Personalizado**: Área administrativa para cada tipo de usuário

#### 📅 Sistema de Reservas
- **Calendário Interativo**: Visualização de disponibilidade em tempo real
- **Cálculo Automático**: Preços por período com regras de temporada
- **Status de Reserva**: Pendente, confirmada, cancelada
- **Histórico**: Registro completo de todas as transações

#### 💬 Comunicação
- **Integração WhatsApp**: Link direto para contato via WhatsApp
- **Notificações**: Alertas por email sobre reservas e mensagens

#### 🔍 Busca e Filtros Avançados
- **Pesquisa por Localização**: Cidades e bairros do litoral
- **Filtros Múltiplos**: Preço, número de quartos, comodidades
- **Ordenação**: Relevância, preço, avaliações
---

## 🛠️ Tecnologias Utilizadas

### Frontend
```
├── React 19                    # Biblioteca principal
├── Vite                        # Build tool e dev server
├── React Router DOM            # Roteamento SPA
├── Tailwind CSS               # Framework CSS utility-first
├── Axios                      # Cliente HTTP
├── React Hook Form            # Gerenciamento de formulários
├── React DatePicker           # Seleção de datas
└── Lucide React              # Biblioteca de ícones
```

### Backend
```
├── Node.js                    # Runtime JavaScript
├── Express.js                 # Framework web
├── PostgreSQL                 # Banco de dados relacional
├── Sequelize ORM             # Object-Relational Mapping
├── JWT                       # Autenticação e autorização
├── Bcrypt                    # Criptografia de senhas
├── Multer                    # Upload de arquivos
├── Nodemailer                # Envio de emails
└── Cors                      # Cross-Origin Resource Sharing
```

### DevOps & Infraestrutura
```
├── Vercel                    # Deploy do frontend
├── Hostinger                 # Hospedagem do backend
├── AWS S3 / Cloudinary       # Armazenamento de imagens
└── GitHub                    # Versionamento de código
```

---

## 🏗️ Arquitetura do Projeto

```
ziguealuga/
│
├── client/                          # Frontend React
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   │
│   ├── src/
│   │   ├── components/              # Componentes reutilizáveis
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Calendar.jsx
│   │   │   └── ImageGallery.jsx
│   │   │
│   │   ├── pages/                   # Páginas principais
│   │   │   ├── Home.jsx
│   │   │   ├── PropertyList.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── context/                 # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   └── PropertyContext.jsx
│   │   │
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   └── useProperties.js
│   │   │
│   │   ├── services/                # Integração com API
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── propertyService.js
│   │   │   └── bookingService.js
│   │   │
│   │   ├── utils/                   # Funções auxiliares
│   │   │   ├── formatDate.js
│   │   │   ├── formatPrice.js
│   │   │   └── validators.js
│   │   │
│   │   ├── styles/                  # Estilos globais
│   │   │   └── globals.css
│   │   │
│   │   ├── App.jsx                  # Componente raiz
│   │   └── main.jsx                 # Entry point
│   │
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                          # Backend Node.js
│   ├── src/
│   │   ├── config/                  # Configurações
│   │   │   ├── database.js
│   │   │   ├── jwt.js
│   │   │   └── upload.js
│   │   │
│   │   ├── controllers/             # Lógica de negócio
│   │   │   ├── authController.js
│   │   │   ├── propertyController.js
│   │   │   ├── bookingController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── models/                  # Models Sequelize
│   │   │   ├── User.js
│   │   │   ├── Property.js
│   │   │   ├── Booking.js
│   │   │   ├── Review.js
│   │   │   └── Message.js
│   │   │
│   │   ├── routes/                  # Definição de rotas
│   │   │   ├── auth.js
│   │   │   ├── properties.js
│   │   │   ├── bookings.js
│   │   │   └── users.js
│   │   │
│   │   ├── middlewares/             # Middlewares
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   ├── errorHandler.js
│   │   │   └── upload.js
│   │   │
│   │   ├── services/                # Serviços
│   │   │   ├── emailService.js
│   │   │   ├── uploadService.js
│   │   │   └── whatsappService.js
│   │   │
│   │   ├── utils/                   # Utilitários
│   │   │   ├── logger.js
│   │   │   └── helpers.js
│   │   │
│   │   └── app.js                   # Configuração do Express
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Entry point
│
├── .gitignore
├── README.md
└── LICENSE
```

## 📊 Modelo de Dados

### Diagrama Entidade-Relacionamento

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    Users     │         │  Properties  │         │   Bookings   │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │────────<│ userId (FK)  │>───────│ propertyId   │
│ name         │         │ id (PK)      │         │ id (PK)      │
│ email        │         │ title        │         │ userId (FK)  │
│ password     │         │ description  │         │ checkIn      │
│ role         │         │ price        │         │ checkOut     │
│ phone        │         │ address      │         │ totalPrice   │
│ createdAt    │         │ city         │         │ status       │
└──────────────┘         │ state        │         │ createdAt    │
                         │ bedrooms     │         └──────────────┘
                         │ bathrooms    │                │
                         │ guests       │                │
                         │ amenities    │                │
                         │ images       │                │
                         │ available    │                │
                         │ createdAt    │                │
                         └──────────────┘                │
                                │                        │
                                │                        │
                                v                        v
                         ┌──────────────┐         ┌──────────────┐
                         │   Reviews    │         │   Messages   │
                         ├──────────────┤         ├──────────────┤
                         │ id (PK)      │         │ id (PK)      │
                         │ propertyId   │         │ bookingId    │
                         │ userId (FK)  │         │ senderId     │
                         │ rating       │         │ receiverId   │
                         │ comment      │         │ content      │
                         │ createdAt    │         │ read         │
                         └──────────────┘         │ createdAt    │
                                                  └──────────────┘
```

---

## 🔐 Autenticação e Segurança

### Sistema de Autenticação JWT

```javascript
// Fluxo de Autenticação
1. Usuário faz login → Credenciais validadas
2. Servidor gera token JWT → Token com payload do usuário
3. Token retornado ao cliente → Armazenado no localStorage
4. Requisições subsequentes → Header Authorization: Bearer <token>
5. Middleware valida token → Acesso concedido ou negado
```

### Medidas de Segurança Implementadas

- ✅ Senhas criptografadas com Bcrypt (salt rounds: 10)
- ✅ Tokens JWT com expiração configurável
- ✅ Validação de inputs (SQL Injection prevention)
- ✅ Rate limiting em endpoints sensíveis
- ✅ CORS configurado adequadamente
- ✅ Sanitização de dados de entrada
- ✅ HTTPS em produção
- ✅ Variáveis sensíveis em .env (não versionadas)

---

## 🎨 Design e UI/UX

### Paleta de Cores

```css
/* Cores Principais */
--primary: #FF385C;        /* Vermelho Airbnb-style */
--primary-dark: #E00B41;   /* Hover state */
--secondary: #00A699;      /* Verde água */

/* Neutros */
--gray-50: #F7F7F7;
--gray-100: #EBEBEB;
--gray-300: #DDDDDD;
--gray-500: #717171;
--gray-900: #222222;

/* Sistema */
--success: #008A05;
--warning: #FFC107;
--error: #C13515;
--info: #1E90FF;
```

### Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints Tailwind**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly**: Botões e áreas clicáveis com tamanho adequado
- **Performance**: Lazy loading de imagens e code splitting

---

## 🧪 Testes

### Estrutura de Testes

```bash
# Testes Unitários
npm run test:unit

# Testes de Integração
npm run test:integration

# Cobertura de Código
npm run test:coverage
```

## 📈 Funcionalidades Futuras

### Roadmap

#### V2.0 - Q1 2026
- [ ] Chat em tempo real (WebSocket)
- [ ] Integração com gateway de pagamento (Stripe/MercadoPago)
- [ ] Verificação de identidade de usuários


#### V2.1 - Q2 2026
- [ ] Notificações push
- [ ] Sistema de cupons e descontos
- [ ] Dashboard de analytics para proprietários

#### V3.0 - Q3 2026
- [ ] Programa de fidelidade
- [ ] API pública para parceiros

---
## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Theo**

- Portfolio: [Theopadilha.com]
- LinkedIn: [linkedin.com/in/theopadilha]
- Email: [theohenriquecp@gmail.com]

---

## 🙏 Agradecimentos

- Design inspirado no [Airbnb](https://www.airbnb.com.br)
- Ícones fornecidos por [Lucide Icons](https://lucide.dev)
- Comunidade React Brasil
- Stack Overflow pela ajuda em momentos críticos

---

## 📞 Suporte

Se você tiver alguma dúvida ou problema, por favor entre em contato:

- **Email**: suporte@ziguealuga.com
- **WhatsApp**: [+55 47 98910-5580](https://wa.me/5547989105580)

---

<div align="center">

**Desenvolvido com ❤️ por Theo**

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>
