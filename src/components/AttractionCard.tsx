import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Footprints, Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Attraction,
  categoryLabels,
  trailLevelLabels,
  calculateDistance,
} from "@/data/attractions";

interface AttractionCardProps {
  attraction: Attraction;
  userLocation?: { lat: number; lon: number } | null;
  index?: number;
  variant?: "default" | "editorial";
}

export const AttractionCard = ({
  attraction,
  userLocation,
  index = 0,
  variant = "default",
}: AttractionCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const isEditorial = variant === "editorial";
  const image = isEditorial
    ? attraction.images.find(
        (src) => src && !src.toLowerCase().includes("placeholder.svg")
      )
    : attraction.images[0];
  const distance = userLocation
    ? calculateDistance(
        userLocation.lat,
        userLocation.lon,
        attraction.latitude,
        attraction.longitude
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to={`/ponto/${attraction.slug}`}
        className={
          isEditorial
            ? "block h-full rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
            : undefined
        }
      >
        <Card
          className={
            isEditorial
              ? "group h-full overflow-hidden rounded-sm border border-border bg-card shadow-soft transition-shadow duration-300 hover:shadow-hover"
              : "group overflow-hidden border border-border shadow-soft hover:shadow-md transition-shadow duration-300"
          }
        >
          <div className={`${isEditorial ? "aspect-[4/3]" : "aspect-[16/10]"} overflow-hidden bg-muted`}>
            {image && (!isEditorial || !imageFailed) ? (
              <img
                src={image}
                alt={attraction.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={isEditorial ? () => setImageFailed(true) : undefined}
              />
            ) : isEditorial ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 bg-brand-forest px-6 text-center text-brand-sand">
                <MapPin aria-hidden="true" className="h-6 w-6 text-brand-terracotta" />
                <span className="max-w-[16rem] text-sm leading-relaxed">
                  Fotografia do destino em curadoria
                </span>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-light">
                Sem imagem
              </div>
            )}
          </div>

          <div className={isEditorial ? "p-5 sm:p-6" : "p-5"}>
            {isEditorial && (
              <Badge className="mb-3 border-0 bg-brand-sand text-primary hover:bg-brand-sand">
                {categoryLabels[attraction.category]}
              </Badge>
            )}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className={`${isEditorial ? "text-xl sm:text-2xl" : "text-lg"} font-light text-foreground leading-tight`}>
                {attraction.name}
              </h3>
              {!isEditorial && (
                <Badge variant="outline" className="text-[10px] font-normal shrink-0">
                  {categoryLabels[attraction.category]}
                </Badge>
              )}
            </div>

            {isEditorial && (
              <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {attraction.description}
              </p>
            )}

            <div className="space-y-1.5 text-sm text-muted-foreground font-light">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {attraction.municipality}, {attraction.region}
                </span>
              </div>

              {distance !== null && (
                <div className="flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5" />
                  <span>{distance.toFixed(1)} km de distância</span>
                </div>
              )}

              {attraction.trailLevel !== "none" && (
                <div className="flex items-center gap-1.5">
                  <Footprints className="h-3.5 w-3.5" />
                  <span>Trilha {trailLevelLabels[attraction.trailLevel].toLowerCase()}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
