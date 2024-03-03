import { User2Icon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { Category } from "~/components/category";
import { i18n } from "~/i18n";
import { Links } from "~/router";
import { Orders } from "~/services/orders/orders.types";

export default function DefaultHistoryItem({ item }: { item: Orders.Shape }) {
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
          <div className="flex items-center text-sm gap-1">
            <User2Icon size={16} />{" "}
            <Fragment>Você e mais {item.users.length - 1} amigos</Fragment>
          </div>
          <div className="text-right">
            Total:{" "}
            <span className="text-danger-mask">
              {i18n.format.money(Number(item.total))}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
