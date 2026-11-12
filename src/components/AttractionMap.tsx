import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Attraction } from "@/data/attractions";

interface AttractionMapProps {
  attractions: Attraction[];
  userLocation?: { lat: number; lon: number } | null;
  center?: [number, number];
  zoom?: number;
}

export const AttractionMap = ({
  attractions,
  userLocation,
  center,
  zoom = 8,
}: AttractionMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultCenter: [number, number] = userLocation
      ? [userLocation.lat, userLocation.lon]
      : center || [-7.12, -36.5];
    const initialZoom = userLocation ? 12 : zoom;
    const map = L.map(mapRef.current).setView(defaultCenter, initialZoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const icon = L.divIcon({
      className: "custom-marker",
      html: `<div class="w-6 h-6 rounded-full bg-primary border-2 border-white shadow-md flex items-center justify-center"><div class="w-2 h-2 rounded-full bg-white"></div></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    attractions.forEach((attraction) => {
      const marker = L.marker([attraction.latitude, attraction.longitude], {
        icon,
      }).addTo(map);

      marker.bindPopup(
        `<a href="/ponto/${attraction.slug}" class="font-medium text-foreground hover:text-primary">${attraction.name}</a>`
      );
    });

    if (userLocation) {
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: `<div class="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker([userLocation.lat, userLocation.lon], { icon: userIcon })
        .addTo(map)
        .bindPopup("Sua localização");
    }

    if (!userLocation && !center && attractions.length > 0) {
      const group = L.featureGroup(
        attractions.map((a) => L.marker([a.latitude, a.longitude]))
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [attractions, userLocation, center, zoom]);

  return <div ref={mapRef} className="w-full h-full" />;
};
