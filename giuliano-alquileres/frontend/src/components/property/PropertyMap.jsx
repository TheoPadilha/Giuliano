import React, { useMemo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt } from "react-icons/fa";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "1rem",
};

const PropertyMap = ({ lat, lng, address }) => {
  const { t } = useTranslation();
  // A chave da API deve ser definida no .env do frontend como VITE_GOOGLE_MAPS_API_KEY
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  // Memoiza a posição para evitar recálculos desnecessários
  const center = useMemo(
    () => ({ lat: parseFloat(lat), lng: parseFloat(lng) }),
    [lat, lng]
  );

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

  if (loadError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {t("map_load_error")}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-100 rounded-lg rounded-2xl">
        {t("loading_map")}
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      <div className="relative rounded-xlarge overflow-hidden shadow-md border border-airbnb-grey-200">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={center}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker position={center} title={address || t("property_location")} />
        </GoogleMap>
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

export default PropertyMap;
