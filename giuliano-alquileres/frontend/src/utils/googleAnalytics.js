// googleAnalytics.js - Utilitários para Google Analytics 4
// SUBSTITUA 'G-XXXXXXXXXX' pelo seu ID real do Google Analytics

// IDs de medição (IMPORTANTE: Substituir pelos IDs reais)
export const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Seu ID do Google Analytics 4
export const GTM_ID = "GTM-XXXXXXX"; // Seu ID do Google Tag Manager

// Inicializar Google Analytics
export const initGA = () => {
  // Verificar se já foi inicializado
  if (window.gtag) {
    console.log("✅ Google Analytics já inicializado");
    return;
  }

  // Criar script do Google Analytics
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Inicializar gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());

  // Configuração inicial - BLOQUEADO até consentimento
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });

  gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false, // Não enviar automaticamente
  });

  console.log("✅ Google Analytics inicializado (aguardando consentimento)");
};

// Inicializar Google Tag Manager
export const initGTM = () => {
  // Verificar se já foi inicializado
  if (window.google_tag_manager) {
    console.log("✅ Google Tag Manager já inicializado");
    return;
  }

  // GTM Script
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", GTM_ID);

  console.log("✅ Google Tag Manager inicializado");
};

// Rastrear visualização de página
export const trackPageView = (url, title) => {
  if (!window.gtag) {
    console.warn("⚠️ Google Analytics não inicializado");
    return;
  }

  window.gtag("event", "page_view", {
    page_title: title || document.title,
    page_location: url || window.location.href,
    page_path: url || window.location.pathname,
  });

  console.log(`📊 Página rastreada: ${url || window.location.pathname}`);
};

// Rastrear evento customizado
export const trackEvent = (eventName, eventParams = {}) => {
  if (!window.gtag) {
    console.warn("⚠️ Google Analytics não inicializado");
    return;
  }

  window.gtag("event", eventName, eventParams);

  console.log(`📊 Evento rastreado: ${eventName}`, eventParams);
};

// Eventos pré-definidos para o site de aluguel

// Rastrear busca de propriedade
export const trackPropertySearch = (filters) => {
  trackEvent("property_search", {
    search_term: filters.search || "",
    city: filters.city_id || "",
    property_type: filters.type || "",
    guests: filters.max_guests || "",
    price_min: filters.min_price || "",
    price_max: filters.max_price || "",
  });
};

// Rastrear visualização de propriedade
export const trackPropertyView = (property) => {
  trackEvent("view_item", {
    currency: "BRL",
    value: property.price_per_night || 0,
    items: [
      {
        item_id: property.uuid || property.id,
        item_name: property.title,
        item_category: property.type,
        price: property.price_per_night || 0,
      },
    ],
  });
};

// Rastrear clique em "Ver Detalhes"
export const trackPropertyClick = (property, position) => {
  trackEvent("select_item", {
    item_list_name: "Property Search Results",
    items: [
      {
        item_id: property.uuid || property.id,
        item_name: property.title,
        item_category: property.type,
        price: property.price_per_night || 0,
        index: position,
      },
    ],
  });
};

// Rastrear início de reserva
export const trackBeginCheckout = (property, checkIn, checkOut) => {
  trackEvent("begin_checkout", {
    currency: "BRL",
    value: property.price_per_night || 0,
    items: [
      {
        item_id: property.uuid || property.id,
        item_name: property.title,
        item_category: property.type,
        price: property.price_per_night || 0,
      },
    ],
    check_in: checkIn,
    check_out: checkOut,
  });
};

// Rastrear reserva concluída
export const trackPurchase = (booking) => {
  trackEvent("purchase", {
    transaction_id: booking.id || booking.uuid,
    currency: "BRL",
    value: booking.total_price,
    items: [
      {
        item_id: booking.property_uuid || booking.property_id,
        item_name: booking.property_title,
        item_category: booking.property_type,
        price: booking.price_per_night,
        quantity: booking.number_of_nights,
      },
    ],
  });
};

// Rastrear cadastro de usuário
export const trackSignUp = (method = "email") => {
  trackEvent("sign_up", {
    method: method,
  });
};

// Rastrear login
export const trackLogin = (method = "email") => {
  trackEvent("login", {
    method: method,
  });
};

// Rastrear favorito
export const trackAddToWishlist = (property) => {
  trackEvent("add_to_wishlist", {
    currency: "BRL",
    value: property.price_per_night || 0,
    items: [
      {
        item_id: property.uuid || property.id,
        item_name: property.title,
        item_category: property.type,
        price: property.price_per_night || 0,
      },
    ],
  });
};

// Rastrear compartilhamento
export const trackShare = (property, method = "other") => {
  trackEvent("share", {
    method: method,
    content_type: "property",
    item_id: property.uuid || property.id,
  });
};

// Rastrear erro
export const trackError = (errorMessage, errorLocation) => {
  trackEvent("exception", {
    description: errorMessage,
    fatal: false,
    location: errorLocation,
  });
};

// Rastrear tempo na página
export const trackEngagement = () => {
  let startTime = Date.now();

  return () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    trackEvent("user_engagement", {
      engagement_time_msec: timeSpent * 1000,
    });
  };
};

// Rastrear scroll
export const trackScroll = (percentage) => {
  trackEvent("scroll", {
    percent_scrolled: percentage,
  });
};

// Rastrear clique em botão WhatsApp
export const trackWhatsAppClick = (source) => {
  trackEvent("whatsapp_click", {
    source: source,
  });
};

// Rastrear envio de formulário de contato
export const trackContactFormSubmit = (formType) => {
  trackEvent("generate_lead", {
    form_type: formType,
  });
};
