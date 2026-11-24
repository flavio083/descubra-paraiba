import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Mountain,
  UserCheck,
  ArrowLeft,
  ExternalLink,
  Compass,
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

  useEffect(() => {
    if (!slug) return;

    const fetchAttraction = async () => {
      const { data, error } = await supabase
        .from("attractions")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setAttraction(null);
      } else {
        setAttraction(mapRowToAttraction(data));
      }
      setLoading(false);
    };

    fetchAttraction();
  }, [slug]);

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

  if (!attraction) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-28 pb-20 container mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-2xl font-light mb-4">Ponto não encontrado</h1>
          <Button onClick={() => navigate("/descobrir")} variant="outline">
            Voltar para descoberta
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${attraction.latitude},${attraction.longitude}`;

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
                    <section className="mt-6 border-t border-border pt-6" aria-labelledby="history-title">
                      <h2 id="history-title" className="mb-3 text-xl font-light tracking-tight">
                        História do local
                      </h2>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                        {attraction.history}
                      </p>
                    </section>
                  )}
                </div>

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

              <div className="space-y-6">
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-soft bg-muted">
                  {attraction.images[0] ? (
                    <img
                      src={attraction.images[0]}
                      alt={attraction.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-light">
                      Sem imagem
                    </div>
                  )}
                </div>

                <div className="h-[250px] rounded-xl overflow-hidden border border-border shadow-soft">
                  <AttractionMap attractions={[attraction]} center={[attraction.latitude, attraction.longitude]} zoom={13} />
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
