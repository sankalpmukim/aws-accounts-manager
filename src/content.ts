import type { PlasmoCSConfig } from "plasmo";

import { WHICH_PAGE_MESSAGE } from "~messaging/constants";
import type {
  FillLoginRequest,
  FillLoginResponse,
  Page,
  WhichPageRequest,
  WhichPageResponse,
} from "~messaging/types";

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

function simulateTyping(element, value) {
  for (let char of value) {
    element.value += char;

    // Create and dispatch the event
    let event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });

    element.dispatchEvent(event);
  }
}

function getPageInfo(): Page {
  const loginContainer = document.getElementById("login_container");
  if (!loginContainer) {
    const accountFields = document.getElementById("accountFields");
    if (accountFields) {
      return "aws-signin-iam";
    } else {
      return "unknown";
    }
  }
  if (!isElementVisible(loginContainer)) {
    return "aws-signin-initial";
  }
  const accountFields = document.getElementById("accountFields");
  if (!accountFields) {
    return "aws-signin-root";
  } else {
    return "aws-signin-iam";
  }
}

// which page listener
chrome.runtime.onMessage.addListener(function (
  request: WhichPageRequest,
  _sender,
  sendResponse: WhichPageResponse,
): void {
  console.log("Content script received message:", request);
  const page = getPageInfo();
  if (request.name === WHICH_PAGE_MESSAGE) {
    sendResponse({ page });
  }
});

/**
 * Type guard for input elements
 */
const isInputElement = (element: Element): element is HTMLInputElement => {
  return element.tagName === "INPUT";
};

/**
 * Type guard for radio input elements
 */
const isRadioElement = (element: Element): element is HTMLInputElement => {
  return isInputElement(element) && element.type === "radio";
};

const isButtonElement = (element: Element): element is HTMLButtonElement => {
  return element.tagName === "BUTTON";
};

// fill login listener
chrome.runtime.onMessage.addListener(function (
  request: FillLoginRequest,
  _sender,
  sendResponse: FillLoginResponse,
): void {
  console.log("Content script received message:", request);
  if (request.name === "fillLogin") {
    // check if a button with id = "next_button_text" exists
    const page = getPageInfo();

    if (page === "aws-signin-initial") {
      // user is on aws-signin-initial page
      const resolvingInputToFill = !!request.data.account
        ? request.data.username
        : request.data.account;

      const radios = document.querySelectorAll(`input[name="userType"]`);

      // select the correct radio button user type
      if (request.data.account === "") {
        // select the iam account radio button
        radios.forEach((radio) => {
          if (isRadioElement(radio) && radio.value === "iamUser") {
            radio.checked = true;
          } else if (isRadioElement(radio)) {
            radio.checked = false;
          } else {
            console.error("Could not find radio buttons.");
            sendResponse({ success: false });
            return;
          }
        });
      } else {
        // select the root account radio button
        radios.forEach((radio) => {
          if (isRadioElement(radio) && radio.value === "rootUser") {
            radio.checked = true;
          } else if (isRadioElement(radio)) {
            radio.checked = false;
          } else {
            console.error("Could not find radio buttons.");
            sendResponse({ success: false });
            return;
          }
        });
      }

      // fill the input and then click "next" button
      const resolvingInput = document.getElementById("resolving_input");
      const nextButton = document.getElementById("next_button");

      if (
        !resolvingInput ||
        isInputElement(resolvingInput) ||
        !nextButton ||
        !isButtonElement(nextButton)
      ) {
        simulateTyping(resolvingInput, resolvingInputToFill);

        nextButton.click();
        sendResponse({ success: true });
        return;
      } else {
        console.error("Could not find resolving input.");
        sendResponse({ success: false });
        return;
      }
    } else {
      const { account, username, password } = request.data;
      const accountField = document.getElementById("account");
      const usernameField = document.getElementById("username");
      const passwordField = document.getElementById("password");
      if (
        accountField &&
        usernameField &&
        passwordField &&
        isInputElement(accountField) &&
        isInputElement(usernameField) &&
        isInputElement(passwordField)
      ) {
        if (account) {
          simulateTyping(accountField, account);
        }
        simulateTyping(usernameField, username);
        simulateTyping(passwordField, password);
        sendResponse({ success: true });
      } else {
        console.error("Could not find login fields.");
        sendResponse({ success: false });
      }
    }
  }
});
