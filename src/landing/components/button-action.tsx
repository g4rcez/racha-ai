import { Link } from "brouther";
import clsx from "clsx";

export function ButtonAction({
  color = "black",
}: {
  color?: "black" | "white";
}) {
  return (
    <Link
      href="#"
      aria-label="Download on the App Store"
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
