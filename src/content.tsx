import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";

import { CountButton } from "~features/count-button";

export const config: PlasmoCSConfig = {
  matches: ["https://www.plasmo.com/*"],
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

const PlasmoOverlay = () => {
  return (
    <div className="fixed right-8 top-32 z-50 flex">
      <CountButton />
    </div>
  );
};

export default PlasmoOverlay;
