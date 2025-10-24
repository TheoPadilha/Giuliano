// PropertyMap - Componente para exibir localização do imóvel
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px'
};

const PropertyMap = ({ latitude, longitude, address, propertyTitle, apiKey }) => {
  const center = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude)
  };

  if (!apiKey) {
    return (
      <div className="bg-airbnb-grey-50 border border-airbnb-grey-200 rounded-xlarge p-6 text-center">
        <FaMapMarkerAlt className="text-airbnb-grey-400 text-4xl mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-airbnb-black mb-2">
          Localização não disponível
        </h3>
        <p className="text-sm text-airbnb-grey-400">
          {address || 'Endereço não informado'}
        </p>
      </div>
    );
  }

  if (!latitude || !longitude) {
    return (
      <div className="bg-airbnb-grey-50 border border-airbnb-grey-200 rounded-xlarge p-6 text-center">
        <FaMapMarkerAlt className="text-airbnb-grey-400 text-4xl mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-airbnb-black mb-2">
          Localização não definida
        </h3>
        <p className="text-sm text-airbnb-grey-400">
          Este imóvel ainda não possui localização no mapa
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-airbnb-black mb-2">
          Onde você vai ficar
        </h3>
        {address && (
          <p className="text-airbnb-grey-400 text-base mb-4">
            {address}
          </p>
        )}
      </div>

      <LoadScript googleMapsApiKey={apiKey}>
        <div className="relative rounded-xlarge overflow-hidden shadow-md border border-airbnb-grey-200">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            options={{
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
              zoomControl: true,
              disableDefaultUI: false
            }}
          >
            <Marker
              position={center}
              title={propertyTitle || 'Localização do imóvel'}
            />
          </GoogleMap>
        </div>
      </LoadScript>

      {/* Informações adicionais */}
      <div className="bg-airbnb-grey-50 rounded-xlarge p-4">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-rausch text-xl mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-airbnb-black mb-1">
              Localização exata fornecida após a reserva
            </h4>
            <p className="text-sm text-airbnb-grey-400">
              Por questões de privacidade, mostramos a área aproximada no mapa.
              Você receberá o endereço exato após confirmar sua reserva.
            </p>
          </div>
        </div>
      </div>

      {/* Link para abrir no Google Maps */}
      <div className="flex justify-center">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-airbnb-black rounded-xlarge text-airbnb-black font-semibold hover:bg-airbnb-grey-50 transition-colors"
        >
          <FaMapMarkerAlt />
          <span>Abrir no Google Maps</span>
        </a>
      </div>
    </div>
  );
};

export default PropertyMap;
