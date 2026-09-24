import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Attraction,
  AttractionCategory,
  TrailLevel,
  GuideRequirement,
  categoryLabels,
  trailLevelLabels,
  guideRequirementLabels,
} from "@/data/attractions";
import { supabase } from "@/integrations/supabase/client";

interface AttractionFormProps {
  attraction?: Attraction | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const AttractionForm = ({
  attraction,
  open,
  onClose,
  onSaved,
}: AttractionFormProps) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: attraction?.name || "",
    slug: attraction?.slug || "",
    description: attraction?.description || "",
    category: (attraction?.category as AttractionCategory) || "nature",
    municipality: attraction?.municipality || "",
    region: attraction?.region || "",
    latitude: attraction?.latitude.toString() || "",
    longitude: attraction?.longitude.toString() || "",
    trailLevel: (attraction?.trailLevel as TrailLevel) || "none",
    guideRequired: (attraction?.guideRequired as GuideRequirement) || "not_required",
    images: attraction?.images?.join(",") || "",
    featured: attraction?.featured || false,
  });

  useEffect(() => {
    if (!open) return;

    setForm({
      name: attraction?.name || "",
      slug: attraction?.slug || "",
      description: attraction?.description || "",
      category: (attraction?.category as AttractionCategory) || "nature",
      municipality: attraction?.municipality || "",
      region: attraction?.region || "",
      latitude: attraction?.latitude?.toString() || "",
      longitude: attraction?.longitude?.toString() || "",
      trailLevel: (attraction?.trailLevel as TrailLevel) || "none",
      guideRequired:
        (attraction?.guideRequired as GuideRequirement) || "not_required",
      images: attraction?.images?.join(",") || "",
      featured: attraction?.featured || false,
    });
  }, [attraction, open]);

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      category: form.category,
      municipality: form.municipality,
      region: form.region,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      trail_level: form.trailLevel,
      guide_required: form.guideRequired,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
    };

    const { error } = attraction
      ? await supabase.from("attractions").update(payload).eq("id", attraction.id)
      : await supabase.from("attractions").insert(payload);

    if (error) {
      toast.error("Erro ao salvar: " + error.message);
    } else {
      toast.success(attraction ? "Atualizado com sucesso" : "Criado com sucesso");
      onSaved();
    }

    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-light">
            {attraction ? "Editar ponto turístico" : "Novo ponto turístico"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className="rounded-md text-sm font-light"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              required
              className="rounded-md text-sm font-light"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              required
              className="rounded-md text-sm font-light min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={form.category}
                onValueChange={(value) => update("category", value)}
              >
                <SelectTrigger className="rounded-md text-sm font-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(categoryLabels) as AttractionCategory[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {categoryLabels[key]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="region">Região</Label>
              <Input
                id="region"
                value={form.region}
                onChange={(e) => update("region", e.target.value)}
                required
                className="rounded-md text-sm font-light"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="municipality">Município</Label>
            <Input
              id="municipality"
              value={form.municipality}
              onChange={(e) => update("municipality", e.target.value)}
              required
              className="rounded-md text-sm font-light"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => update("latitude", e.target.value)}
                required
                className="rounded-md text-sm font-light"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => update("longitude", e.target.value)}
                required
                className="rounded-md text-sm font-light"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trailLevel">Trilha</Label>
              <Select
                value={form.trailLevel}
                onValueChange={(value) => update("trailLevel", value)}
              >
                <SelectTrigger className="rounded-md text-sm font-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(trailLevelLabels) as TrailLevel[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {trailLevelLabels[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="guideRequired">Guia</Label>
              <Select
                value={form.guideRequired}
                onValueChange={(value) => update("guideRequired", value)}
              >
                <SelectTrigger className="rounded-md text-sm font-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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

          <div>
            <Label htmlFor="images">Imagens (URLs separadas por vírgula)</Label>
            <Input
              id="images"
              value={form.images}
              onChange={(e) => update("images", e.target.value)}
              placeholder="https://exemplo.com/foto1.jpg, https://exemplo.com/foto2.jpg"
              className="rounded-md text-sm font-light"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="featured"
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="rounded border-border"
            />
            <Label htmlFor="featured" className="text-sm font-light cursor-pointer">
              Destaque
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-md text-[11px] uppercase tracking-wider font-normal"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md text-[11px] uppercase tracking-wider font-normal"
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
