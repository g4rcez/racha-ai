import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
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

const Json = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

export default function DebugPage() {
  const [state, setState] = useState({});

  useEffect(() => {
    setState(getStorageJson());
  }, []);

  return (
    <main className="flex flex-col gap-4">
      <p>{Env.version}</p>
      <Suspense fallback={<div />}>
        <Json theme="google" sortKeys src={state} />
      </Suspense>
    </main>
  );
}
