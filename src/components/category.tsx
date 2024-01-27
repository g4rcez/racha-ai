import { LucideProps } from "lucide-react";
import { Categories } from "~/models/categories";

export const Category = ({
  name,
  ...props
}: { name: keyof typeof Categories } & LucideProps) => {
  const category = Categories[name] || Categories.default;
  const Component = category.icon;
  return (
    <span>
      <span className="sr-only">{category.name}</span>
      <Component absoluteStrokeWidth strokeWidth={2} size={32} {...props} />
    </span>
  );
};
