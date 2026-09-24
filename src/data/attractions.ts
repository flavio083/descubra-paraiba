export type AttractionCategory =
  | "beach"
  | "nature"
  | "trail"
  | "history"
  | "culture"
  | "natural_formation"
  | "heritage";

export type TrailLevel = "none" | "easy" | "moderate" | "difficult";
export type GuideRequirement = "not_required" | "recommended" | "required";

export interface Attraction {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: AttractionCategory;
  municipality: string;
  region: string;
  latitude: number;
  longitude: number;
  trailLevel: TrailLevel;
  guideRequired: GuideRequirement;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoryLabels: Record<AttractionCategory, string> = {
  beach: "Praia",
  nature: "Natureza",
  trail: "Trilha",
  history: "História",
  culture: "Cultura",
  natural_formation: "Formação Natural",
  heritage: "Patrimônio Histórico",
};

export const categoryIcons: Record<AttractionCategory, string> = {
  beach: "🏖️",
  nature: "🌳",
  trail: "🥾",
  history: "🏛️",
  culture: "🎭",
  natural_formation: "⛰️",
  heritage: "⛪",
};

export const trailLevelLabels: Record<TrailLevel, string> = {
  none: "Sem trilha",
  easy: "Fácil",
  moderate: "Moderada",
  difficult: "Difícil",
};

export const guideRequirementLabels: Record<GuideRequirement, string> = {
  not_required: "Não necessário",
  recommended: "Recomendado",
  required: "Obrigatório",
};

export const regionLabels: Record<string, string> = {
  "Litoral": "Litoral",
  "Litoral Sul": "Litoral Sul",
  "Serra": "Serra",
  "Sertão": "Sertão",
  "Agreste": "Agreste",
  "Brejo": "Brejo",
};

export function mapRowToAttraction(row: {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: AttractionCategory;
  municipality: string;
  region: string;
  latitude: number;
  longitude: number;
  trail_level: TrailLevel;
  guide_required: GuideRequirement;
  images: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}): Attraction {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    category: row.category,
    municipality: row.municipality,
    region: row.region,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    trailLevel: row.trail_level,
    guideRequired: row.guide_required,
    images: row.images,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function sortAttractionsByDistance(
  attractions: Attraction[],
  userLat: number,
  userLon: number,
  order: "asc" | "desc" = "asc"
): Attraction[] {
  const withDistance = attractions.map((a) => ({
    ...a,
    distance: calculateDistance(userLat, userLon, a.latitude, a.longitude),
  }));
  withDistance.sort((a, b) =>
    order === "asc" ? a.distance - b.distance : b.distance - a.distance
  );
  return withDistance;
}

export interface Filters {
  query: string;
  category: AttractionCategory | "all";
  trailLevel: TrailLevel | "all";
  guideRequired: GuideRequirement | "all";
  distanceOrder: "asc" | "desc" | null;
}

export function filterAttractions(
  attractions: Attraction[],
  filters: Filters,
  userLocation?: { lat: number; lon: number } | null
): Attraction[] {
  let result = [...attractions];

  if (filters.query.trim()) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.municipality.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q)
    );
  }

  if (filters.category !== "all") {
    result = result.filter((a) => a.category === filters.category);
  }

  if (filters.trailLevel !== "all") {
    result = result.filter((a) => a.trailLevel === filters.trailLevel);
  }

  if (filters.guideRequired !== "all") {
    result = result.filter((a) => a.guideRequired === filters.guideRequired);
  }

  if (filters.distanceOrder && userLocation) {
    result = sortAttractionsByDistance(
      result,
      userLocation.lat,
      userLocation.lon,
      filters.distanceOrder
    );
  }

  return result;
}
