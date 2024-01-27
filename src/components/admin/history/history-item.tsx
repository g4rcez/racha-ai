import lazy from "next/dynamic";
import React from "react";
import { type HistoryItem as Item } from "~/store/history.store";

export type HistoryItemProps = { item: Item };

const map: Record<string, any> = {
  default: lazy(() => import("./default-item")),
};

export const HistoryItem = ({ item }: { item: Item }) => {
  const type = item.category;
  const Component = map[type] || map.default;
  return <Component item={item} />;
};
