import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Compass,
  LoaderCircle,
  MapPin,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CategoryGrid } from "@/components/CategoryGrid";
import { AttractionMap } from "@/components/AttractionMap";
import { AttractionCard } from "@/components/AttractionCard";
import { Attraction, mapRowToAttraction } from "@/data/attractions";
import { supabase } from "@/integrations/supabase/client";

const USER_LOCATION_STORAGE_KEY = "userLocation";
const LOCATION_TIMEOUT_MS = 15000;

type UserLocation = { lat: number; lon: number };

const heroSlides = [
  {
    image: "/images/home/hero-lajedo-pai-mateus.jpg",
    alt: "Grande bloco de granito no Lajedo de Pai Mateus ao pôr do sol, em Cabaceiras, Paraíba",
    name: "Lajedo de Pai Mateus",
    municipality: "Cabaceiras · PB",
    position: "center 54%",
  },
  {
    image: "/images/home/hero-igreja-nossa-senhora-do-carmo.jpg",
    alt: "Fachada e torres da Igreja de Nossa Senhora do Carmo, em João Pessoa, Paraíba",
    name: "Igreja de Nossa Senhora do Carmo",
    municipality: "João Pessoa · PB",
    position: "center 30%",
  },
  {
    image: "/images/home/hero-piscinas-naturais-do-seixas.jpg",
    alt: "Vista aérea das águas e recifes das Piscinas Naturais do Seixas, em João Pessoa, Paraíba",
    name: "Piscinas Naturais do Seixas",
    municipality: "João Pessoa · PB",
    position: "center 54%",
  },
];

const isValidUserLocation = (location: UserLocation) =>
  Number.isFinite(location.lat) &&
  location.lat >= -90 &&
  location.lat <= 90 &&
  Number.isFinite(location.lon) &&
  location.lon >= -180 &&
  location.lon <= 180;

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

const Index = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isHeroFocused, setIsHeroFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (isHeroHovered || isHeroFocused || prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(intervalId);
  }, [isHeroHovered, isHeroFocused, prefersReducedMotion]);

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
    if (isRequestingLocation) return;
    setIsRequestingLocation(true);

    const failLocationRequest = (message: string) => {
      try {
        sessionStorage.removeItem(USER_LOCATION_STORAGE_KEY);
      } catch {
        // The navigation state still carries the error if storage is unavailable.
      }
      setIsRequestingLocation(false);
      navigate("/descobrir", { state: { locationError: message } });
    };

    if (!navigator.geolocation) {
      failLocationRequest("Este navegador não oferece suporte à geolocalização.");
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };

          if (!isValidUserLocation(location)) {
            failLocationRequest("O navegador retornou coordenadas inválidas. Tente novamente.");
            return;
          }

          try {
            sessionStorage.setItem(
              USER_LOCATION_STORAGE_KEY,
              JSON.stringify(location)
            );
          } catch {
            // React Router state carries the fresh coordinates for this navigation.
          }
          setUserLocation(location);
          setIsRequestingLocation(false);
          navigate("/descobrir", { state: { userLocation: location } });
        },
        (error) => failLocationRequest(getLocationErrorMessage(error)),
        { enableHighAccuracy: false, maximumAge: 0, timeout: LOCATION_TIMEOUT_MS }
      );
    } catch {
      failLocationRequest("Não foi possível acessar a localização. Verifique as permissões do navegador.");
    }
  };

  const featured = attractions.filter((attraction) => attraction.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <section
          aria-labelledby="home-hero-title"
          className="px-4 pb-16 pt-24 sm:px-6 lg:min-h-[calc(100svh-4.5rem)] lg:px-12 lg:pb-20 lg:pt-28"
        >
          <div className="container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="max-w-2xl"
            >
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                Caderno de viagem · Paraíba
              </p>
              <h1
                id="home-hero-title"
                className="text-balance font-editorial text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                A Paraíba tem histórias que merecem ser descobertas.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Encontre paisagens, cultura e patrimônio para conhecer o estado no seu próprio ritmo.
              </p>

              <form onSubmit={handleSearch} className="mt-8 max-w-xl">
                <label htmlFor="home-search" className="sr-only">
                  Buscar destinos, cidades ou regiões
                </label>
                <div className="relative">
                  <Search
                    aria-hidden="true"
                    className="absolute left-4 top-4 h-4 w-4 text-muted-foreground"
                  />
                  <Input
                    id="home-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="O que você gostaria de conhecer?"
                    className="h-12 rounded-md border-border bg-card pl-11 pr-4 text-sm shadow-soft sm:pr-28"
                  />
                  <Button
                    type="submit"
                    className="mt-3 h-11 w-full rounded-md text-sm font-medium sm:absolute sm:right-1 sm:top-1 sm:mt-0 sm:h-10 sm:w-auto"
                  >
                    Buscar
                  </Button>
                </div>
              </form>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("/descobrir")}
                  className="h-11 rounded-md px-5 text-sm font-medium"
                >
                  Explorar destinos
                  <ArrowRight aria-hidden="true" className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExploreNearby}
                  disabled={isRequestingLocation}
                  aria-live="polite"
                  className="h-11 rounded-md border-primary/30 bg-transparent px-5 text-sm text-primary hover:bg-primary/5 hover:text-primary disabled:cursor-wait"
                >
                  {isRequestingLocation ? (
                    <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin aria-hidden="true" className="h-4 w-4" />
                  )}
                  {isRequestingLocation ? "Obtendo localização..." : "Explorar perto de mim"}
                </Button>
              </div>
            </motion.div>

            <motion.figure
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              role="region"
              aria-roledescription="carrossel"
              aria-label="Destinos paraibanos em destaque"
              onMouseEnter={() => setIsHeroHovered(true)}
              onMouseLeave={() => setIsHeroHovered(false)}
              onFocusCapture={() => setIsHeroFocused(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setIsHeroFocused(false);
                }
              }}
              className="group relative isolate min-h-[360px] overflow-hidden rounded-sm bg-brand-forest sm:min-h-[480px] lg:min-h-[660px]"
            >
              {heroSlides.map((slide, index) => (
                <img
                  key={slide.image}
                  src={slide.image}
                  alt={slide.alt}
                  aria-hidden={index !== activeHeroSlide}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  style={{ objectPosition: slide.position }}
                  className={`absolute inset-0 h-full w-full object-cover ${
                    prefersReducedMotion ? "" : "transition-opacity duration-700 motion-reduce:transition-none"
                  } ${index === activeHeroSlide ? "opacity-100" : "pointer-events-none opacity-0"}`}
                />
              ))}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute left-5 top-5 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white sm:left-8 sm:top-8">
                <span className="h-px w-7 bg-brand-terracotta" />
                Paraíba · em descoberta
              </div>

              <div
                key={activeHeroSlide}
                aria-live="polite"
                className="absolute inset-x-5 bottom-20 border-l border-brand-terracotta pl-4 text-white sm:inset-x-8 sm:bottom-24 sm:pl-5"
              >
                <Camera aria-hidden="true" className="mb-3 h-5 w-5" />
                <p className="font-editorial text-2xl sm:text-3xl">{heroSlides[activeHeroSlide].name}</p>
                <p className="mt-1 text-sm text-white/90">{heroSlides[activeHeroSlide].municipality}</p>
              </div>

              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 sm:inset-x-8 sm:bottom-7">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Fotografia anterior"
                    onClick={() => setActiveHeroSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/25 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Próxima fotografia"
                    onClick={() => setActiveHeroSlide((current) => (current + 1) % heroSlides.length)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/25 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ChevronRight aria-hidden="true" className="h-5 w-5" />
                  </button>
                  <span className="ml-1 text-xs font-medium text-white" aria-live="polite">
                    {activeHeroSlide + 1} / {heroSlides.length}
                  </span>
                </div>

                <div className="flex items-center gap-2" aria-label="Selecionar fotografia">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.image}
                      type="button"
                      aria-label={`Exibir ${slide.name}`}
                      aria-current={index === activeHeroSlide ? "true" : undefined}
                      onClick={() => setActiveHeroSlide(index)}
                      className={`h-2.5 rounded-full border border-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 ${
                        index === activeHeroSlide ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.figure>
          </div>
          <div className="container mx-auto mt-5 hidden max-w-7xl justify-end lg:flex">
            <a
              href="#paraiba-intro"
              className="inline-flex items-center gap-2 rounded-sm py-2 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Continue a descoberta <ChevronDown aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section id="paraiba-intro" aria-labelledby="paraiba-intro-title" className="scroll-mt-24 border-y border-border bg-card px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
          <div className="container mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.7fr_1.3fr] md:items-start md:gap-16">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-terracotta">
                Território e cultura
              </p>
              <h2 id="paraiba-intro-title" className="mt-3 font-editorial text-3xl leading-tight text-foreground sm:text-4xl">
                Um estado, muitos caminhos.
              </h2>
            </div>
            <div className="max-w-3xl">
              <p className="text-lg leading-relaxed text-foreground sm:text-xl">
                Praias, trilhas, formações naturais, espaços culturais e patrimônio ajudam a revelar diferentes paisagens da Paraíba.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                O Descubra Paraíba reúne lugares, informações e localização para apoiar uma descoberta mais próxima e consciente do estado.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="featured-title" className="px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-terracotta">
                  Seleção do projeto
                </p>
                <h2 id="featured-title" className="mt-3 font-editorial text-3xl leading-tight text-foreground sm:text-4xl">
                  Destinos em destaque
                </h2>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate("/descobrir")}
                className="h-11 w-fit rounded-md px-3 text-sm text-primary hover:bg-primary/5 hover:text-primary"
              >
                Ver todos os destinos
                <ArrowRight aria-hidden="true" className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-[26rem] animate-pulse bg-muted" />
                ))}
              </div>
            ) : featured.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {featured.map((attraction, index) => (
                  <AttractionCard
                    key={attraction.id}
                    attraction={attraction}
                    userLocation={userLocation}
                    index={index}
                    variant="editorial"
                  />
                ))}
              </div>
            ) : (
              <p className="border-y border-border py-8 text-sm text-muted-foreground">
                Os destinos em destaque aparecerão aqui quando forem selecionados.
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="stories-title" className="bg-brand-forest px-4 py-16 text-white sm:px-6 lg:px-12 lg:py-24">
          <div className="container mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-sand">
                Memória · patrimônio · cultura
              </p>
              <h2 id="stories-title" className="mt-4 font-editorial text-3xl leading-tight text-white sm:text-5xl">
                Histórias que atravessam gerações.
              </h2>
            </div>
            <div className="max-w-2xl border-l border-brand-terracotta pl-5 sm:pl-8">
              <p className="text-base leading-relaxed text-white/90 sm:text-lg">
                Conhecer um lugar também é abrir espaço para as memórias, referências culturais e patrimônios que fazem parte do território.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-brand-sand/80 sm:text-base">
                A plataforma organiza os destinos cadastrados e está preparada para receber mais conteúdo histórico e cultural verificado.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/descobrir?categoria=heritage")}
                className="mt-7 h-11 rounded-md border-white/60 bg-transparent px-5 text-sm text-white hover:border-white hover:bg-white/10 hover:text-white focus-visible:ring-brand-sand"
              >
                Explorar patrimônio
                <ArrowRight aria-hidden="true" className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section aria-labelledby="categories-title" className="px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 max-w-2xl sm:mb-10">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-terracotta">
                Escolha seu caminho
              </p>
              <h2 id="categories-title" className="mt-3 font-editorial text-3xl leading-tight text-foreground sm:text-4xl">
                O que você quer descobrir?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Explore os lugares por categoria e encontre uma experiência que combine com seu interesse.
              </p>
            </div>
            <CategoryGrid />
          </div>
        </section>

        <section aria-labelledby="map-title" className="bg-secondary px-4 py-16 sm:px-6 lg:px-12 lg:py-24">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end lg:mb-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-terracotta">
                  Explore pelo território
                </p>
                <h2 id="map-title" className="mt-3 font-editorial text-3xl leading-tight text-foreground sm:text-4xl">
                  Veja a Paraíba no mapa.
                </h2>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Localize os pontos cadastrados, explore as regiões e abra os detalhes de cada destino.
                </p>
                <Button
                  onClick={() => navigate("/descobrir")}
                  className="h-11 w-fit shrink-0 rounded-md px-5 text-sm"
                >
                  Abrir descoberta
                  <Compass aria-hidden="true" className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="h-[320px] overflow-hidden rounded-sm border border-border bg-card shadow-soft sm:h-[420px] lg:h-[500px]">
              {loading ? (
                <div className="h-full w-full animate-pulse bg-muted" />
              ) : (
                <AttractionMap attractions={attractions} userLocation={userLocation} />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
