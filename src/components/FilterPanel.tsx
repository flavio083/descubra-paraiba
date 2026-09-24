import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AttractionCategory,
  TrailLevel,
  GuideRequirement,
  categoryLabels,
  trailLevelLabels,
  guideRequirementLabels,
} from "@/data/attractions";

export interface Filters {
  query: string;
  category: AttractionCategory | "all";
  trailLevel: TrailLevel | "all";
  guideRequired: GuideRequirement | "all";
  distanceOrder: "asc" | "desc" | null;
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  locationAvailable: boolean;
  onRequestLocation: () => void;
}

export const FilterPanel = ({
  filters,
  onChange,
  locationAvailable,
  onRequestLocation,
}: FilterPanelProps) => {
  const update = (key: keyof Filters, value: Filters[keyof Filters]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
      <div>
        <Label
          htmlFor="search"
          className="text-[11px] uppercase tracking-wider text-muted-foreground font-normal mb-2 block"
        >
          Buscar
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Nome, cidade, região..."
            value={filters.query}
            onChange={(e) => update("query", e.target.value)}
            className="pl-9 rounded-md text-sm font-light"
          />
        </div>
      </div>

      <div>
        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-normal mb-2 block">
          Distância
        </Label>
        <Select
          value={filters.distanceOrder || "none"}
          onValueChange={(value) =>
            update("distanceOrder", value === "none" ? null : (value as "asc" | "desc"))
          }
        >
          <SelectTrigger className="rounded-md text-sm font-light">
            <SelectValue placeholder="Ordenar por distância" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Padrão</SelectItem>
            <SelectItem value="asc">Mais próximos</SelectItem>
            <SelectItem value="desc">Mais distantes</SelectItem>
          </SelectContent>
        </Select>
        {!locationAvailable && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">
              {filters.distanceOrder
                ? "A ordenação por distância precisa da sua localização."
                : "Use sua localização para ordenar os resultados por distância."}
            </p>
            <Button
              type="button"
              variant="link"
              onClick={onRequestLocation}
              className="h-auto px-0 py-1 text-xs"
            >
              Usar minha localização
            </Button>
          </div>
        )}
      </div>

      <div>
        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-normal mb-2 block">
          Categoria
        </Label>
        <Select
          value={filters.category}
          onValueChange={(value) =>
            update("category", value as AttractionCategory | "all")
          }
        >
          <SelectTrigger className="rounded-md text-sm font-light">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {(
              Object.keys(categoryLabels) as AttractionCategory[]
            ).map((key) => (
              <SelectItem key={key} value={key}>
                {categoryLabels[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-normal mb-2 block">
          Trilha
        </Label>
        <Select
          value={filters.trailLevel}
          onValueChange={(value) =>
            update("trailLevel", value as TrailLevel | "all")
          }
        >
          <SelectTrigger className="rounded-md text-sm font-light">
            <SelectValue placeholder="Nível de trilha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Qualquer</SelectItem>
            {(Object.keys(trailLevelLabels) as TrailLevel[]).map((key) => (
              <SelectItem key={key} value={key}>
                {trailLevelLabels[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-normal mb-2 block">
          Guia
        </Label>
        <Select
          value={filters.guideRequired}
          onValueChange={(value) =>
            update("guideRequired", value as GuideRequirement | "all")
          }
        >
          <SelectTrigger className="rounded-md text-sm font-light">
            <SelectValue placeholder="Necessidade de guia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Qualquer</SelectItem>
            {(
              Object.keys(guideRequirementLabels) as GuideRequirement[]
            ).map((key) => (
              <SelectItem key={key} value={key}>
                {guideRequirementLabels[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
