import Link from "next/link";
import clsx from "clsx";
import { Links } from "~/router";

export function ButtonAction({
  color = "black",
}: {
  color?: "black" | "white";
}) {
  return (
    <Link
      href={Links.app}
      className={clsx(
        "rounded transition-colors py-2 px-4",
        color === "black"
          ? "bg-gray-800 text-white hover:bg-gray-900"
          : "bg-white text-gray-900 hover:bg-gray-50",
      )}
    >
      Criar minha conta
    </Link>
  );
}
