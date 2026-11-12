import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Church,
  Drama,
  Footprints,
  Landmark,
  Mountain,
  Trees,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { AttractionCategory, categoryLabels } from "@/data/attractions";

const categoryIcons: Record<AttractionCategory, LucideIcon> = {
  beach: Waves,
  nature: Trees,
  trail: Footprints,
  history: Landmark,
  culture: Drama,
  natural_formation: Mountain,
  heritage: Church,
};

const categories: AttractionCategory[] = [
  "beach",
  "nature",
  "trail",
  "history",
  "culture",
  "natural_formation",
  "heritage",
];

export const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <Card
            onClick={() => navigate(`/descobrir?categoria=${category}`)}
            className="p-5 text-center border border-border shadow-soft hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer"
          >
            <div className="mb-2 flex justify-center text-primary">
              {(() => {
                const Icon = categoryIcons[category];
                return <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={1.75} />;
              })()}
            </div>
            <p className="text-xs font-light text-foreground">
              {categoryLabels[category]}
            </p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
