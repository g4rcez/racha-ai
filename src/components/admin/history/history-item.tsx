import lazy from "next/dynamic";
import React from "react";
import { Orders } from "~/services/orders/orders.types";

const map = {
  default: lazy(() => import("./default-item")) as any,
  food: lazy(() => import("./default-item")) as any,
} satisfies Record<string, React.FC<{ item: Orders.Shape }>>;

type ItemMap = keyof typeof map;

export const HistoryItem = ({ item }: { item: Orders.Shape }) => {
  const type = item.category;
  if (type! in map) {
    const Component = map[type as ItemMap] || map.default;
    return <Component item={item} />;
  }
  return <map.default item={item} />;
};
