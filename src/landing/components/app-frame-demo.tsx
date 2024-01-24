import { lazy } from "react";
import { AppFrame } from "~/landing/components/app-frame";
import { ScreenContainer } from "~/landing/components/app-screen/app-features";

const WelcomeToApp = lazy(() => import("~/pages/app/app.page"));

export function AppFrameDemo() {
  return (
    <AppFrame>
      <AppFrame.Body>
        <ScreenContainer>
          <WelcomeToApp />
        </ScreenContainer>
      </AppFrame.Body>
    </AppFrame>
  );
}
