
import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Mountain,
  UserCheck,
  ArrowLeft,
  ExternalLink,
  Compass,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AttractionMap } from "@/components/AttractionMap";
import {
  Attraction,
  categoryLabels,
  trailLevelLabels,
  guideRequirementLabels,
  mapRowToAttraction,
} from "@/data/attractions";
import { supabase } from "@/integrations/supabase/client";

const Ponto = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados da galeria
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const touchStartX = useRef<number | null>(null);

  // Busca os dados da atração
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchAttraction = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("attractions")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!isMounted) return;

      if (error || !data) {
        setAttraction(null);
      } else {
        setAttraction(mapRowToAttraction(data));
      }

      setLoading(false);
    };

    fetchAttraction();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Reinicia a galeria ao trocar de atração
  useEffect(() => {
    setActiveImageIndex(0);
    setIsAutoPlaying(true);
  }, [slug]);

  // Troca automática das fotografias a cada 5 segundos
  useEffect(() => {
    if (
      !isAutoPlaying ||
      !attraction ||
      attraction.images.length <= 1
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => {
        return (current + 1) % attraction.images.length;
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isAutoPlaying, attraction]);

  // Estados de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-28 pb-20 container mx-auto px-6 lg:px-12">
          <div className="h-96 rounded-xl bg-muted animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  // Atração não encontrada
  if (!attraction) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-28 pb-20 container mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-2xl font-light mb-4">
            Ponto não encontrado
          </h1>

          <Button
            onClick={() => navigate("/descobrir")}
            variant="outline"
          >
            Voltar para descoberta
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const images = attraction.images ?? [];

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${attraction.latitude},${attraction.longitude}`;

  // Avança para a próxima fotografia
  const nextImage = () => {
    if (images.length <= 1) return;

    setActiveImageIndex((current) => {
      return (current + 1) % images.length;
    });
  };

  // Volta para a fotografia anterior
  const previousImage = () => {
    if (images.length <= 1) return;

    setActiveImageIndex((current) => {
      return (current - 1 + images.length) % images.length;
    });
  };

  // Detecta o início do gesto no celular
  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  // Detecta o movimento para trocar a fotografia
  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const difference =
      touchStartX.current - event.changedTouches[0].clientX;

    if (difference > 40) {
      nextImage();
    } else if (difference < -40) {
      previousImage();
    }

    touchStartX.current = null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-6 text-[11px] uppercase tracking-wider font-normal"
            >
              <ArrowLeft className="mr-2 h-3 w-3" />
              Voltar
            </Button>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Informações da atração */}
              <div className="space-y-8">
                <div>
                  <Badge
                    variant="outline"
                    className="mb-4 text-xs font-light capitalize"
                  >
                    {categoryLabels[attraction.category]}
                  </Badge>

                  <h1 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">
                    {attraction.name}
                  </h1>

                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {attraction.description}
                  </p>

                  {attraction.history?.trim() && (
                    <section
                      className="mt-6 border-t border-border pt-6"
                      aria-labelledby="history-title"
                    >
                      <h2
                        id="history-title"
                        className="mb-3 text-xl font-light tracking-tight"
                      >
                        História do local
                      </h2>

                      <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                        {attraction.history}
                      </p>
                    </section>
                  )}
                </div>

                {/* Informações complementares */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="p-5 border border-border shadow-soft">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-normal">
                        Localização
                      </span>
                    </div>

                    <p className="text-sm font-light">
                      {attraction.municipality}
                    </p>

                    <p className="text-xs text-muted-foreground font-light">
                      {attraction.region}
                    </p>
                  </Card>

                  <Card className="p-5 border border-border shadow-soft">
                    <div className="flex items-center gap-3 mb-2">
                      <Compass className="h-4 w-4 text-primary" />
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-normal">
                        Categoria
                      </span>
                    </div>

                    <p className="text-sm font-light">
                      {categoryLabels[attraction.category]}
                    </p>
                  </Card>

                  <Card className="p-5 border border-border shadow-soft">
                    <div className="flex items-center gap-3 mb-2">
                      <Mountain className="h-4 w-4 text-primary" />
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-normal">
                        Trilha
                      </span>
                    </div>

                    <p className="text-sm font-light">
                      {trailLevelLabels[attraction.trailLevel]}
                    </p>
                  </Card>

                  <Card className="p-5 border border-border shadow-soft">
                    <div className="flex items-center gap-3 mb-2">
                      <UserCheck className="h-4 w-4 text-primary" />
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-normal">
                        Guia
                      </span>
                    </div>

                    <p className="text-sm font-light">
                      {guideRequirementLabels[attraction.guideRequired]}
                    </p>
                  </Card>
                </div>

                {/* Botão de localização */}
                <Button
                  asChild
                  className="w-full sm:w-auto rounded-full text-[11px] uppercase tracking-wider font-normal"
                >
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Como chegar
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>

              {/* Galeria de fotografias e mapa */}
              <div className="space-y-6">
                {/* Carrossel de imagens */}
                <div
                  className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-soft bg-muted group"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {images.length > 0 ? (
                    <>
                      <img
                        key={images[activeImageIndex]}
                        src={images[activeImageIndex]}
                        alt={`${attraction.name} - Foto ${activeImageIndex + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-500"
                      />

                      {images.length > 1 && (
                        <>
                          {/* Botão anterior */}
                          <button
                            type="button"
                            onClick={previousImage}
                            aria-label="Fotografia anterior"
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm p-2 shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-background"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>

                          {/* Botão próxima */}
                          <button
                            type="button"
                            onClick={nextImage}
                            aria-label="Próxima fotografia"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm p-2 shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-background"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>

                          {/* Controles inferiores */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-background/80 backdrop-blur-sm px-3 py-2">
                            {/* Indicadores das fotografias */}
                            <div className="flex items-center gap-2">
                              {images.map((_, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() =>
                                    setActiveImageIndex(index)
                                  }
                                  aria-label={`Ir para fotografia ${index + 1}`}
                                  aria-current={
                                    activeImageIndex === index
                                      ? "true"
                                      : undefined
                                  }
                                  className={`h-2 rounded-full transition-all ${
                                    activeImageIndex === index
                                      ? "w-6 bg-primary"
                                      : "w-2 bg-muted-foreground/50 hover:bg-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>

                            {/* Contador e controle automático */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium tabular-nums">
                                {activeImageIndex + 1} / {images.length}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  setIsAutoPlaying((playing) => !playing)
                                }
                                aria-label={
                                  isAutoPlaying
                                    ? "Pausar apresentação"
                                    : "Retomar apresentação"
                                }
                                className="rounded-full p-1.5 hover:bg-muted transition-colors"
                              >
                                {isAutoPlaying ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-light">
                      Sem imagem
                    </div>
                  )}
                </div>

                {/* Mapa da atração */}
                <div className="h-[250px] rounded-xl overflow-hidden border border-border shadow-soft">
                  <AttractionMap
                    attractions={[attraction]}
                    center={[
                      attraction.latitude,
                      attraction.longitude,
                    ]}
                    zoom={13}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Ponto;
