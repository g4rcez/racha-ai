import { Is } from "sidekicker";

const webShareAPI = () =>
  !!Is.function(navigator.share) && !!Is.function(navigator.canShare);

const clipboard = () => navigator.clipboard !== undefined;

export const CanIUse = { webShareAPI, clipboard };
