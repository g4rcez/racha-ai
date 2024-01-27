import { User2Icon } from "lucide-react";
import Link from "next/link";
import { HistoryItemProps } from "~/components/admin/history/history-item";
import { Category } from "~/components/category";
import { i18n } from "~/i18n";
import { Links } from "~/router";

export default function DefaultHistoryItem({ item }: HistoryItemProps) {
  return (
    <li
      key={item.id}
      className="border-b border-card-border first:border-t last:border-b-0"
    >
      <Link
        href={Links.cartId(item.id)}
        className="group py-4 flex flex-col gap-2"
      >
        <header className="flex flex-row gap-6">
          <Category name={item.category as any} />
          <div>
            <h2 className="font-medium text-balance text-lg -mt-1">
              {item.title}
            </h2>
            <time dateTime={item.createdAt.toISOString()} className="text-base">
              {item.createdAt.toLocaleDateString()}
            </time>
          </div>
        </header>
        <div className="flex flex-row gap-2 mt-2 items-center justify-between">
          {item.justMe ? (
            <div className="flex items-center gap-3">
              <User2Icon /> Apenas você
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <User2Icon />
              Você e mais {item.users.size - 1} amigos
            </div>
          )}
          <div className="text-right">
            Total:{" "}
            <span className="text-danger-mask">
              {i18n.format.money(item.total)}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}