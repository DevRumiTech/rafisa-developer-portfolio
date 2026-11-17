import { useContext } from "react";
import { AppearanceContext } from "./appearanceContext";

export default function useAppearance() {
  const appearance = useContext(AppearanceContext);
  if (!appearance) throw new Error("useAppearance requires AppearanceProvider");
  return appearance;
}
