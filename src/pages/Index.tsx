import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CategoryGrid } from "@/components/CategoryGrid";
import { AttractionMap } from "@/components/AttractionMap";
import { AttractionCard } from "@/components/AttractionCard";
import { Attraction, mapRowToAttraction } from "@/data/attractions";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttractions = async () => {
      const { data, error } = await supabase.from("attractions").select("*");
      if (!error && data) {
        setAttractions(data.map(mapRowToAttraction));
      }
      setLoading(false);
    };

    fetchAttractions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/descobrir?q=${encodeURIComponent(query)}`);
  };

  const handleExploreNearby = () => {
    if (!navigator.geolocation) {
      navigate("/descobrir", {
        state: {
          locationError: "Geolocalização não é suportada pelo seu navegador.",
        },
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        sessionStorage.setItem("userLocation", JSON.stringify(location));
        setUserLocation(location);
        navigate("/descobrir", { state: { userLocation: location } });
      },
      () => {
        sessionStorage.removeItem("userLocation");
        navigate("/descobrir", {
          state: {
            locationError: "Não foi possível obter sua localização.",
          },
        });
      }
    );
  };

  const featured = attractions.filter((a) => a.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(195_60%_92%/0.4),hsl(45_50%_92%/0.3))]" />
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto text-center"
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 block">
                Descubra a Paraíba
              </span>
              <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight text-foreground">
                Encontre lugares incríveis
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light mb-10 leading-relaxed">
                Conheça a cultura paraibana, explore praias, trilhas, formações
                naturais e patrimônios históricos perto de você.
              </p>

              <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="O que você gostaria de conhecer?"
                    className="pl-11 pr-32 py-6 rounded-full text-sm font-light shadow-soft border-border bg-card"
                  />
                  <Button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full text-[11px] uppercase tracking-wider font-normal px-5"
                  >
                    Buscar
                  </Button>
                </div>
              </form>

              <Button
                variant="outline"
                onClick={handleExploreNearby}
                className="rounded-full text-[11px] uppercase tracking-wider font-normal px-6"
              >
                <MapPin className="mr-2 h-3.5 w-3.5" />
                Explorar perto de mim
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3 block">
                Categorias
              </span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                O que você quer conhecer?
              </h2>
            </motion.div>
            <CategoryGrid />
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-accent/30">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3 block">
                Mapa
              </span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-3">
                Explore a Paraíba
              </h2>
              <p className="text-sm text-muted-foreground font-light max-w-md mx-auto">
                Clique nos marcadores para ver os pontos turísticos de cada região.
              </p>
            </motion.div>

            <div className="h-[450px] md:h-[550px] rounded-xl overflow-hidden border border-border shadow-soft bg-card">
              {loading ? (
                <div className="w-full h-full animate-pulse bg-muted" />
              ) : (
                <AttractionMap attractions={attractions} userLocation={userLocation} />
              )}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3 block">
                  Destaques
                </span>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                  Lugares em destaque
                </h2>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate("/descobrir")}
                className="hidden sm:flex items-center text-[11px] uppercase tracking-wider font-normal"
              >
                Ver todos
                <Compass className="ml-2 h-3.5 w-3.5" />
              </Button>
            </motion.div>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {featured.map((attraction, index) => (
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
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
