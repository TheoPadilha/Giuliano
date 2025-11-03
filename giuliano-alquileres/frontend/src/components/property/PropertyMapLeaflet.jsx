import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para o ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PropertyMapLeaflet = ({ lat, lng, address }) => {
  const { t } = useTranslation();

  if (!lat || !lng) {
    return (
      <div className="bg-airbnb-grey-50 border border-airbnb-grey-200 rounded-xlarge p-6 text-center">
        <FaMapMarkerAlt className="text-airbnb-grey-400 text-4xl mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-airbnb-black mb-2">
          {t("location_not_defined")}
        </h3>
        <p className="text-sm text-airbnb-grey-400">
          {t("property_map_not_set")}
        </p>
      </div>
    );
  }

  const position = [parseFloat(lat), parseFloat(lng)];

  return (
    <div className="relative space-y-4">
      {/* Mapa Leaflet */}
      <div
        className="relative rounded-xlarge overflow-hidden shadow-md border border-airbnb-grey-200"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '12px',
          zIndex: 1
        }}
      >
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%", borderRadius: "12px" }}
        >
          {/* OpenStreetMap Tiles - 100% Gratuito */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcador */}
          <Marker position={position}>
            <Popup>{address || t("property_location")}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Informações adicionais */}
      <div className="bg-airbnb-grey-50 rounded-xlarge p-4">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-rausch text-xl mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-airbnb-black mb-1">
              {t("exact_location_after_booking")}
            </h4>
            <p className="text-sm text-airbnb-grey-400">
              {t("privacy_policy_map")}
            </p>
          </div>
        </div>
      </div>

      {/* Link para abrir no Google Maps */}
      <div className="flex justify-center">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-airbnb-black rounded-xlarge text-airbnb-black font-semibold hover:bg-airbnb-grey-50 transition-colors"
        >
          <FaMapMarkerAlt />
          <span>{t("open_in_google_maps")}</span>
        </a>
      </div>
    </div>
  );
};

export default PropertyMapLeaflet;
