// MapView.jsx - Visualização de Propriedades em Mapa
import { useState, useCallback, memo } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { UPLOADS_URL } from "../../services/api";

const MapView = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: -26.9924, // Balneário Camboriú
    lng: -48.6359,
  });

  // Configuração do mapa
  const mapContainerStyle = {
    width: "100%",
    height: "calc(100vh - 250px)",
    minHeight: "500px",
  };

  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };

  // Calcular centro do mapa baseado nas propriedades
  const calculateCenter = useCallback(() => {
    if (properties.length === 0) return mapCenter;

    const validProps = properties.filter(
      (p) => p.latitude && p.longitude
    );

    if (validProps.length === 0) return mapCenter;

    const avgLat =
      validProps.reduce((sum, p) => sum + parseFloat(p.latitude), 0) /
      validProps.length;
    const avgLng =
      validProps.reduce((sum, p) => sum + parseFloat(p.longitude), 0) /
      validProps.length;

    return { lat: avgLat, lng: avgLng };
  }, [properties]);

  // Formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Verificar se tem Google Maps API Key
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-gray-50 rounded-lg">
        <FaMapMarkerAlt className="text-6xl text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Mapa Indisponível
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          A visualização em mapa requer uma chave do Google Maps API.
          Configure VITE_GOOGLE_MAPS_API_KEY no arquivo .env
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={calculateCenter()}
          zoom={12}
          options={options}
        >
          {/* Markers das propriedades */}
          {properties.map((property) => {
            // Só mostrar se tiver coordenadas
            if (!property.latitude || !property.longitude) return null;

            const position = {
              lat: parseFloat(property.latitude),
              lng: parseFloat(property.longitude),
            };

            return (
              <Marker
                key={property.uuid || property.id}
                position={position}
                onClick={() => setSelectedProperty(property)}
                icon={{
                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                  fillColor: property.is_featured ? "#FFA500" : "#E31C5F",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                  scale: 1.5,
                }}
              />
            );
          })}

          {/* InfoWindow ao clicar no marker */}
          {selectedProperty && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedProperty.latitude),
                lng: parseFloat(selectedProperty.longitude),
              }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="max-w-xs">
                <Link
                  to={`/property/${selectedProperty.uuid || selectedProperty.id}`}
                  className="block hover:opacity-90 transition-opacity"
                >
                  {/* Imagem */}
                  <div className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-2">
                    {selectedProperty.photos?.[0] ? (
                      <img
                        src={`${UPLOADS_URL}/properties/${selectedProperty.photos[0].filename}`}
                        alt={selectedProperty.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <FaMapMarkerAlt className="text-3xl text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {selectedProperty.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2">
                    {selectedProperty.city?.name || "Localização"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(selectedProperty.price_per_night)}
                      </span>
                      <span className="text-sm text-gray-600"> / noite</span>
                    </div>

                    {selectedProperty.average_rating > 0 && (
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-500 text-sm" />
                        <span className="text-sm font-semibold">
                          {selectedProperty.average_rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Info de propriedades no mapa */}
      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-gray-700">
          {properties.filter((p) => p.latitude && p.longitude).length} de{" "}
          {properties.length} propriedades no mapa
        </p>
      </div>
    </div>
  );
};

export default memo(MapView);
