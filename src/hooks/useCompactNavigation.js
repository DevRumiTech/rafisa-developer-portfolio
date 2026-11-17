import { useSyncExternalStore } from "react";
import { subscribeMedia } from "../utils/mediaQuery";

const query = '(max-width: 600px)';
const subscribe = (notify) => {
  if (!window.matchMedia) return () => {};
  const media = window.matchMedia(query);
  return subscribeMedia(media, notify);
};
const snapshot = () => window.matchMedia?.(query).matches ?? false;

export default function useCompactNavigation() {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
