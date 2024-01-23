import { lazy, Suspense } from "react";
import { LocalStorage } from "storage-manager-js";
import { Env } from "~/lib/Env";

const getStorageJson = () =>
  Object.keys(LocalStorage.json()).reduce(
    (acc, el) => ({
      ...acc,
      [el]: LocalStorage.get(el),
    }),
    {},
  );

export default function DebugPage() {
  const Json = lazy(() => import("@microlink/react-json-view"));
  return (
    <main className="flex flex-col gap-4">
      <p>{Env.version}</p>
      <Suspense fallback={<div />}>
        <Json theme="google" sortKeys src={getStorageJson()} />
      </Suspense>
    </main>
  );
}
