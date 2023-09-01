import type { PlasmoCSConfig } from "plasmo";

import { WHICH_PAGE_MESSAGE } from "~messaging/constants";
import type { WhichPageRequest, WhichPageResponse } from "~messaging/types";

console.log("Content script loaded.");

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
};

const isElementVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0"
  );
};

chrome.runtime.onMessage.addListener(function (
  request: WhichPageRequest,
  _sender,
  sendResponse: WhichPageResponse,
): void {
  console.log("Content script received message:", request);
  if (request.name === WHICH_PAGE_MESSAGE) {
    // to check if it's the initial signin page
    const loginContainer = document.getElementById("login_container");
    if (!loginContainer) {
      const accountFields = document.getElementById("accountFields");
      if (accountFields) {
        sendResponse({ page: "aws-signin-iam" });
        return;
      } else {
        sendResponse({ page: "unknown" });
        return;
      }
    }
    if (!isElementVisible(loginContainer)) {
      sendResponse({ page: "aws-signin-initial" });
      return;
    }
    const accountFields = document.getElementById("accountFields");
    if (!accountFields) {
      sendResponse({ page: "aws-signin-root" });
      return;
    } else {
      sendResponse({ page: "aws-signin-iam" });
      return;
    }
  }
});
