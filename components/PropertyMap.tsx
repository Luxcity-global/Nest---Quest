
import React, { useState, useEffect, useRef } from 'react';
import { MatchResult } from '../types';

interface PropertyMapProps {
  properties: MatchResult[];
  onBook: (id: string) => void;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ properties, onBook }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  // Using any to bypass missing google maps types in this environment
  const googleMap = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    // Access google from window to avoid compilation errors for the global google object
    const google = (window as any).google;
    if (!mapRef.current || !google) return;

    // Initialize map if not already done
    if (!googleMap.current) {
      googleMap.current = new google.maps.Map(mapRef.current, {
        center: properties.length > 0 
          ? { lat: properties[0].location.lat, lng: properties[0].location.lng }
          : { lat: 51.5074, lng: -0.1278 },
        zoom: 14,
        styles: [
          { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] },
          { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] },
          { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] },
          { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] },
          { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] },
          { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] },
          { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] },
          { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] },
          { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] },
          { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] },
          { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
          { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] },
          { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] },
          { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }
        ],
        disableDefaultUI: true,
        zoomControl: false,
        gestureHandling: 'greedy'
      });
    }

    // Update markers when properties change
    // First clear old markers
    // Fix: Explicitly cast marker values to any to resolve 'unknown' type error on setMap
    Object.values(markersRef.current).forEach((m: any) => m.setMap(null));
    markersRef.current = {};

    const bounds = new google.maps.LatLngBounds();

    properties.forEach(prop => {
      const position = { lat: prop.location.lat, lng: prop.location.lng };
      
      // Creating a custom marker label (price tag)
      const marker = new google.maps.Marker({
        position,
        map: googleMap.current,
        title: prop.name,
        icon: {
          path: 'M0,0 L40,0 L40,25 L20,35 L0,25 Z',
          fillColor: '#DC5F12',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 1,
          labelOrigin: new google.maps.Point(20, 12)
        },
        label: {
          text: `£${prop.price}`,
          color: 'white',
          fontSize: '12px',
          fontWeight: '900'
        }
      });

      marker.addListener('click', () => {
        setSelectedId(prop.id);
        googleMap.current?.panTo(position);
      });

      markersRef.current[prop.id] = marker;
      bounds.extend(position);
    });

    if (properties.length > 0) {
      googleMap.current.fitBounds(bounds, 50);
    }
  }, [properties]);

  // Sync marker selection appearance
  useEffect(() => {
    // Access google from window to ensure we use the dynamic global object
    const google = (window as any).google;
    if (!google) return;

    Object.keys(markersRef.current).forEach(id => {
      const marker = markersRef.current[id];
      const isActive = id === selectedId;
      marker.setIcon({
        path: 'M0,0 L40,0 L40,25 L20,35 L0,25 Z',
        fillColor: isActive ? '#136C9E' : '#DC5F12', // Change color if selected
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: isActive ? 4 : 2,
        scale: isActive ? 1.2 : 1,
        labelOrigin: new google.maps.Point(20, 12)
      });
      if (isActive) marker.setZIndex(1000);
      else marker.setZIndex(1);
    });
  }, [selectedId]);

  const selectedProperty = properties.find(p => p.id === selectedId);

  const zoomIn = () => googleMap.current?.setZoom((googleMap.current.getZoom() || 14) + 1);
  const zoomOut = () => googleMap.current?.setZoom((googleMap.current.getZoom() || 14) - 1);
  const centerOnUser = () => {
    if (navigator.geolocation && googleMap.current) {
      navigator.geolocation.getCurrentPosition((pos) => {
        googleMap.current?.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        googleMap.current?.setZoom(15);
      });
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-100 rounded-3xl overflow-hidden border border-gray-200 shadow-inner group">
      {/* Real Map Container */}
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />

      {/* Mini Listing Popup */}
      {selectedProperty && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[320px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-3 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="relative">
            <img 
              src={selectedProperty.imageUrl} 
              className="w-full h-40 object-cover rounded-2xl" 
              alt={selectedProperty.name}
            />
            <button 
              onClick={() => setSelectedId(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-black/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/40 transition-all"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="absolute bottom-2 left-2">
              <div className="bg-brand-orange text-white px-2 py-1 rounded-lg text-[10px] font-black shadow-lg flex items-center gap-1">
                <i className="fa-solid fa-sparkles"></i>
                {selectedProperty.matchScore}% Match
              </div>
            </div>
          </div>
          
          <div className="mt-3 px-1 pb-1">
            <h4 className="font-black text-gray-900 text-lg leading-tight line-clamp-1">
              {selectedProperty.name}
            </h4>
            <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">
              {selectedProperty.area}, {selectedProperty.city}
            </p>
            
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="text-lg font-black text-gray-900">£{selectedProperty.price}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase ml-1">per week</span>
              </div>
              <button 
                onClick={() => onBook(selectedProperty.id)}
                className="bg-brand-orange text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-brand-orange-hover transition-all shadow-lg shadow-orange-100"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Map Controls */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-white shadow-lg flex flex-col gap-2">
           <button onClick={zoomIn} className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-gray-600 hover:text-brand-orange transition-all">
             <i className="fa-solid fa-plus"></i>
           </button>
           <button onClick={zoomOut} className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-gray-600 hover:text-brand-orange transition-all">
             <i className="fa-solid fa-minus"></i>
           </button>
        </div>
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-white shadow-lg flex items-center justify-center">
           <button onClick={centerOnUser} className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-gray-600 hover:text-brand-blue transition-all">
             <i className="fa-solid fa-location-crosshairs"></i>
           </button>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <div className="bg-brand-blue text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 border border-white/20">
          <i className="fa-solid fa-graduation-cap"></i>
          University Hub
        </div>
      </div>
    </div>
  );
};
