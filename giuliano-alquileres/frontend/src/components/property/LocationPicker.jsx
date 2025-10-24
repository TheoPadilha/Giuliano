// LocationPicker - Componente para selecionar localização no mapa
import { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px'
};

// Centro padrão: Balneário Camboriú, SC
const defaultCenter = {
  lat: -26.9906,
  lng: -48.6356
};

const LocationPicker = ({
  onLocationSelect,
  initialLocation = null,
  apiKey
}) => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(
    initialLocation || defaultCenter
  );
  const [address, setAddress] = useState('');
  const autocompleteRef = useRef(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onMapClick = useCallback((e) => {
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setMarkerPosition(newPosition);

    // Reverse geocoding para obter endereço
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newPosition }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
        if (onLocationSelect) {
          onLocationSelect({
            latitude: newPosition.lat,
            longitude: newPosition.lng,
            address: results[0].formatted_address,
            fullAddressData: results[0]
          });
        }
      }
    });
  }, [onLocationSelect]);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry) {
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };

        setMarkerPosition(newPosition);
        setAddress(place.formatted_address);

        // Centralizar mapa na nova posição
        if (map) {
          map.panTo(newPosition);
          map.setZoom(15);
        }

        if (onLocationSelect) {
          onLocationSelect({
            latitude: newPosition.lat,
            longitude: newPosition.lng,
            address: place.formatted_address,
            fullAddressData: place
          });
        }
      }
    }
  };

  const onAutocompleteLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  if (!apiKey) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xlarge p-6 text-center">
        <FaMapMarkerAlt className="text-yellow-600 text-4xl mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          Google Maps API Key não configurada
        </h3>
        <p className="text-sm text-yellow-700">
          Configure a chave da API do Google Maps nas variáveis de ambiente para habilitar esta funcionalidade.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        {/* Campo de busca de endereço */}
        <div className="relative">
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceChanged}
            options={{
              componentRestrictions: { country: 'br' },
              fields: ['formatted_address', 'geometry', 'name']
            }}
          >
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-airbnb-grey-400" />
              <input
                type="text"
                placeholder="Buscar endereço no mapa..."
                className="w-full pl-12 pr-4 py-3 border border-airbnb-grey-200 rounded-xlarge focus:outline-none focus:ring-2 focus:ring-rausch focus:border-transparent text-airbnb-black"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </Autocomplete>
        </div>

        {/* Mapa */}
        <div className="relative rounded-xlarge overflow-hidden shadow-md border border-airbnb-grey-200">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={markerPosition}
            zoom={15}
            onLoad={onLoad}
            onClick={onMapClick}
            options={{
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true,
              zoomControl: true
            }}
          >
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={onMapClick}
            />
          </GoogleMap>
        </div>

        {/* Instruções */}
        <div className="bg-airbnb-grey-50 rounded-xlarge p-4">
          <p className="text-sm text-airbnb-grey-400 flex items-start gap-2">
            <FaMapMarkerAlt className="text-rausch mt-1 flex-shrink-0" />
            <span>
              <strong className="text-airbnb-black">Dica:</strong> Clique no mapa para marcar a localização exata do imóvel ou busque o endereço no campo acima. Você também pode arrastar o marcador.
            </span>
          </p>
        </div>

        {/* Coordenadas selecionadas */}
        {markerPosition && (
          <div className="text-xs text-airbnb-grey-400 bg-white border border-airbnb-grey-200 rounded-medium p-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-semibold text-airbnb-black">Latitude:</span> {markerPosition.lat.toFixed(6)}
              </div>
              <div>
                <span className="font-semibold text-airbnb-black">Longitude:</span> {markerPosition.lng.toFixed(6)}
              </div>
            </div>
            {address && (
              <div className="mt-2 pt-2 border-t border-airbnb-grey-200">
                <span className="font-semibold text-airbnb-black">Endereço:</span> {address}
              </div>
            )}
          </div>
        )}
      </LoadScript>
    </div>
  );
};

export default LocationPicker;
