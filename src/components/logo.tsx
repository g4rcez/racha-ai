type Props = {
  type?: "brand" | "raw";
};
export const Logo = ({ type = "brand" }: Props) => (
  <h1
    className={`text-2xl font-bold ${
      type === "brand" ? "text-main-bg" : "text-main"
    }`}
  >
    Racha aí
  </h1>
);

export const AppDescription = () => (
  <p className="mt-1 text-sm">O app pra rachar a conta com a galera</p>
);
