import { LocalStorage } from "storage-manager-js";
import Json from "@microlink/react-json-view";

const getStorageJson = () =>
  Object.keys(LocalStorage.json()).reduce(
    (acc, el) => ({
      ...acc,
      [el]: LocalStorage.get(el),
    }),
    {},
  );

export default function DebugPage() {
  return (
    <main>
      <Json theme="google" sortKeys src={getStorageJson()} />
    </main>
  );
}
