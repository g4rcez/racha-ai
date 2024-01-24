import { lazy } from "react";
import { AppFrame } from "~/landing/components/app-frame";

const WelcomeToApp = lazy(() => import("~/pages/app/app.page"));

export function AppFrameDemo() {
  return (
    <AppFrame>
      <AppFrame.Body>
        <div className="w-full h-full pt-8 p-4">
          <WelcomeToApp />
        </div>
      </AppFrame.Body>
    </AppFrame>
  );
}
