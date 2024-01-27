import { ErrorInfo, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LocalStorage } from "storage-manager-js";

const key = "@pages/errors";

export const AppBoundary = (props: PropsWithChildren) => {
  const onError = (error: Error, info: ErrorInfo) => {
    const errors = (LocalStorage.get<any[]>(key) as any[]) || [];
    errors.push(JSON.stringify({ ...error, metadata: info }));
    LocalStorage.set(key, errors);
  };

  return (
    <ErrorBoundary fallback={<div>Error</div>} onError={onError}>
      {props.children}
    </ErrorBoundary>
  );
};
