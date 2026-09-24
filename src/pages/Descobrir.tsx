import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useSearchParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AttractionCard } from "@/components/AttractionCard";
import { FilterPanel, Filters } from "@/components/FilterPanel";
import { AttractionMap } from "@/components/AttractionMap";
import { Attraction, filterAttractions, mapRowToAttraction } from "@/data/attractions";
import { supabase } from "@/integrations/supabase/client";

const USER_LOCATION_STORAGE_KEY = "userLocation";

const getStoredLocation = () => {
  try {
    const storedLocation = sessionStorage.getItem(USER_LOCATION_STORAGE_KEY);
    if (!storedLocation) return null;

    const location = JSON.parse(storedLocation);
    if (typeof location.lat === "number" && typeof location.lon === "number") {
      return location;
    }
  } catch {
    sessionStorage.removeItem(USER_LOCATION_STORAGE_KEY);
  }

  return null;
};

const Descobrir = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(
    () => location.state?.userLocation ?? getStoredLocation()
  );
  const [locationError, setLocationError] = useState<string | null>(
    () => location.state?.locationError ?? null
  );

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
    if (!navigator.geolocation) {
      setLocationError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        sessionStorage.setItem(
          USER_LOCATION_STORAGE_KEY,
          JSON.stringify(currentLocation)
        );
        setUserLocation(currentLocation);
        setLocationError(null);
      },
      () => {
        sessionStorage.removeItem(USER_LOCATION_STORAGE_KEY);
        setUserLocation(null);
        setLocationError("Não foi possível obter sua localização.");
      }
    );
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
                className="mt-4 text-[11px] uppercase tracking-wider font-normal"
              >
                Usar minha localização
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
