import { AppFrame } from "~/landing/components/app-frame";
import { ScreenContainer } from "~/landing/components/app-screen/app-features";
import dynamic from "next/dynamic";

const WelcomeToApp = dynamic(() => import("~/app/app/page"));

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
