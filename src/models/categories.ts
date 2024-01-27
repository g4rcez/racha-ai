import { UtensilsIcon, LucideProps } from "lucide-react";
import React from "react";

type Category = { name: string; icon: React.FC<LucideProps> };

export const Categories = {
  restaurant: { name: "restaurant", icon: UtensilsIcon },
  default: { name: "restaurant", icon: UtensilsIcon },
} satisfies Record<string, Category>;
