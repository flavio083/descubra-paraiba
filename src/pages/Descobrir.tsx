import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useSearchParams } from "react-router-dom";
import { LoaderCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AttractionCard } from "@/components/AttractionCard";
import { FilterPanel, Filters } from "@/components/FilterPanel";
import { AttractionMap } from "@/components/AttractionMap";
import { Attraction, filterAttractions, mapRowToAttraction } from "@/data/attractions";
import { supabase } from "@/integrations/supabase/client";

const USER_LOCATION_STORAGE_KEY = "userLocation";
const LOCATION_TIMEOUT_MS = 15000;

type UserLocation = { lat: number; lon: number };

const isValidUserLocation = (location: unknown): location is UserLocation => {
  if (typeof location !== "object" || location === null) return false;

  const coordinates = location as Partial<UserLocation>;
  return (
    typeof coordinates.lat === "number" &&
    Number.isFinite(coordinates.lat) &&
    coordinates.lat >= -90 &&
    coordinates.lat <= 90 &&
    typeof coordinates.lon === "number" &&
    Number.isFinite(coordinates.lon) &&
    coordinates.lon >= -180 &&
    coordinates.lon <= 180
  );
};

const clearStoredLocation = () => {
  try {
    sessionStorage.removeItem(USER_LOCATION_STORAGE_KEY);
  } catch {
    // Location state remains usable even if browser storage is unavailable.
  }
};

const getStoredLocation = () => {
  try {
    const storedLocation = sessionStorage.getItem(USER_LOCATION_STORAGE_KEY);
    if (!storedLocation) return null;

    const location = JSON.parse(storedLocation);
    if (isValidUserLocation(location)) {
      return location;
    }
  } catch {
    clearStoredLocation();
  }

  clearStoredLocation();
  return null;
};

const getInitialLocation = (navigationState: unknown): UserLocation | null => {
  if (typeof navigationState === "object" && navigationState !== null) {
    const state = navigationState as {
      userLocation?: unknown;
      locationError?: unknown;
    };

    if (state.locationError) {
      clearStoredLocation();
      return null;
    }

    if (state.userLocation !== undefined) {
      if (isValidUserLocation(state.userLocation)) return state.userLocation;
      clearStoredLocation();
      return null;
    }
  }

  return getStoredLocation();
};

const getLocationErrorMessage = (error: GeolocationPositionError) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "A permissão de localização foi negada. Verifique as permissões do navegador e tente novamente.";
    case error.POSITION_UNAVAILABLE:
      return "Sua posição não está disponível no momento. Tente novamente em alguns instantes.";
    case error.TIMEOUT:
      return "A localização demorou mais que o esperado. Tente novamente.";
    default:
      return "Não foi possível obter sua localização. Tente novamente.";
  }
};

const Descobrir = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() =>
    getInitialLocation(location.state)
  );
  const [locationError, setLocationError] = useState<string | null>(
    () =>
      typeof location.state?.locationError === "string"
        ? location.state.locationError
        : null
  );
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const locationRequestInProgress = useRef(false);

  const initialCategory = searchParams.get("categoria") as Attraction["category"] | "all" | null;

  const [filters, setFilters] = useState<Filters>({
    query: searchParams.get("q") || "",
    category: initialCategory || "all",
    trailLevel: "all",
    guideRequired: "all",
    distanceOrder: null,
  });

  useEffect(() => {
    const fetchAttractions = async () => {
      const { data, error } = await supabase.from("attractions").select("*");
      if (error) {
        setAttractions([]);
      } else {
        setAttractions(data.map(mapRowToAttraction));
      }
      setLoading(false);
    };

    fetchAttractions();
  }, []);

  const requestLocation = () => {
    if (locationRequestInProgress.current) return;
    locationRequestInProgress.current = true;
    setIsRequestingLocation(true);

    const failLocationRequest = (message: string) => {
      clearStoredLocation();
      setUserLocation(null);
      setLocationError(message);
      locationRequestInProgress.current = false;
      setIsRequestingLocation(false);
    };

    if (!navigator.geolocation) {
      failLocationRequest("Este navegador não oferece suporte à geolocalização.");
      return;
    }

    clearStoredLocation();
    setUserLocation(null);

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };

          if (!isValidUserLocation(currentLocation)) {
            failLocationRequest("O navegador retornou coordenadas inválidas. Tente novamente.");
            return;
          }

          try {
            sessionStorage.setItem(
              USER_LOCATION_STORAGE_KEY,
              JSON.stringify(currentLocation)
            );
          } catch {
            // In-memory state remains available for this page session.
          }
          setUserLocation(currentLocation);
          setLocationError(null);
          locationRequestInProgress.current = false;
          setIsRequestingLocation(false);
        },
        (error) => failLocationRequest(getLocationErrorMessage(error)),
        { enableHighAccuracy: false, maximumAge: 0, timeout: LOCATION_TIMEOUT_MS }
      );
    } catch {
      failLocationRequest("Não foi possível acessar a localização. Verifique as permissões do navegador.");
    }
  };

  const filtered = useMemo(
    () => filterAttractions(attractions, filters, userLocation),
    [attractions, filters, userLocation]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-light mb-3 tracking-tight">
              Descubra a Paraíba
            </h1>
            <p className="text-sm text-muted-foreground font-light flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {loading
                ? "Carregando pontos turísticos..."
                : `${filtered.length} ponto${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
            </p>
            {locationError && (
              <p className="text-xs text-muted-foreground mt-2">{locationError}</p>
            )}
            {!userLocation && (
              <Button
                variant="outline"
                size="sm"
                onClick={requestLocation}
                disabled={isRequestingLocation}
                aria-live="polite"
                className="mt-4 text-[11px] uppercase tracking-wider font-normal disabled:cursor-wait"
              >
                {isRequestingLocation ? (
                  <LoaderCircle aria-hidden="true" className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <MapPin aria-hidden="true" className="mr-2 h-3.5 w-3.5" />
                )}
                {isRequestingLocation ? "Obtendo localização..." : "Usar minha localização"}
              </Button>
            )}
          </motion.div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              locationAvailable={Boolean(userLocation)}
              onRequestLocation={requestLocation}
            />

            <div className="space-y-8">
              <div className="h-[300px] md:h-[400px] rounded-xl overflow-hidden border border-border shadow-soft">
                <AttractionMap attractions={filtered} userLocation={userLocation} />
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-48 rounded-xl bg-muted animate-pulse"
                    />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground font-light">
                    Nenhum ponto turístico encontrado com os filtros selecionados.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filtered.map((attraction, index) => (
                    <AttractionCard
                      key={attraction.id}
                      attraction={attraction}
                      userLocation={userLocation}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Descobrir;
