import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { UPLOADS_URL } from "../../services/api";

// Criar ícone customizado estilo Airbnb (marcador de preço)
const createPriceIcon = (price, isHovered = false) => {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  const bgColor = isHovered ? "#222222" : "white";
  const textColor = isHovered ? "white" : "#222222";
  const borderColor = isHovered ? "#222222" : "rgba(0,0,0,0.08)";
  const boxShadow = isHovered
    ? "0 8px 24px rgba(0,0,0,0.3), 0 0 0 4px rgba(34,34,34,0.1)"
    : "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)";
  const scale = isHovered ? "scale(1.15)" : "scale(1)";
  const zIndex = isHovered ? "1000" : "500";

  return L.divIcon({
    className: "custom-price-marker",
    html: `
      <div class="price-marker ${isHovered ? 'hovered' : ''}" style="
        background: ${bgColor};
        color: ${textColor};
        padding: 8px 16px;
        border-radius: 24px;
        font-weight: 700;
        font-size: 14px;
        border: 2px solid ${borderColor};
        box-shadow: ${boxShadow};
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        transform: ${scale};
        z-index: ${zIndex};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        letter-spacing: -0.02em;
      ">
        ${formattedPrice}
      </div>
    `,
    iconSize: [70, 36],
    iconAnchor: [35, 18],
  });
};

const MapViewLeaflet = ({
  properties,
  hoveredPropertyId,
  onPropertyHover,
  onPropertyClick
}) => {
  // Filtrar apenas propriedades com coordenadas
  const propertiesWithCoords = properties.filter(
    (p) => p.latitude && p.longitude
  );

  if (propertiesWithCoords.length === 0) {
    return (
      <div className="bg-airbnb-grey-50 border border-airbnb-grey-200 rounded-xlarge p-12 text-center h-full flex items-center justify-center">
        <p className="text-lg text-airbnb-grey-600">
          Nenhuma propriedade com localização disponível para exibir no mapa.
        </p>
      </div>
    );
  }

  // Calcular centro do mapa (média das coordenadas)
  const avgLat =
    propertiesWithCoords.reduce((sum, p) => sum + parseFloat(p.latitude), 0) /
    propertiesWithCoords.length;
  const avgLng =
    propertiesWithCoords.reduce((sum, p) => sum + parseFloat(p.longitude), 0) /
    propertiesWithCoords.length;

  const center = [avgLat, avgLng];

  return (
    <div
      className="h-full w-full"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        zIndex: 1
      }}
    >
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={true}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      >
        {/* OpenStreetMap Tiles - 100% Gratuito */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcadores para cada propriedade */}
        {propertiesWithCoords.map((property) => {
          const propertyId = property.uuid || property.id;
          const isHovered = hoveredPropertyId === propertyId;
          const price = property.price_per_night || property.price || 0;

          return (
            <Marker
              key={propertyId}
              position={[parseFloat(property.latitude), parseFloat(property.longitude)]}
              icon={createPriceIcon(price, isHovered)}
              eventHandlers={{
                mouseover: () => onPropertyHover?.(propertyId),
                mouseout: () => onPropertyHover?.(null),
                click: () => {
                  // Se callback de click foi fornecido, chama ele (mobile scroll)
                  if (onPropertyClick) {
                    onPropertyClick(propertyId);
                  } else {
                    // Senão, navega para detalhes (comportamento padrão)
                    window.location.href = `/property/${propertyId}`;
                  }
                },
              }}
            />
          );
        })}
      </MapContainer>

      {/* Estilos CSS customizados para os marcadores */}
      <style>{`
        .custom-price-marker {
          background: transparent !important;
          border: none !important;
        }

        .price-marker {
          position: relative;
          backdrop-filter: blur(10px);
        }

        .price-marker::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: radial-gradient(circle at center, rgba(34, 34, 34, 0.1), transparent 70%);
          border-radius: 28px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .price-marker.hovered::before {
          opacity: 1;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .price-marker:hover {
          background: #222222 !important;
          color: white !important;
          transform: scale(1.15) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3), 0 0 0 4px rgba(34,34,34,0.1) !important;
          z-index: 1000 !important;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
        }

        .leaflet-marker-icon.custom-price-marker {
          margin-left: -35px !important;
          margin-top: -18px !important;
        }

        /* Smooth zoom controls */
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }

        .leaflet-control-zoom a:hover {
          background: #222222 !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default MapViewLeaflet;
