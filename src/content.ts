import type { PlasmoCSConfig } from "plasmo";
import myFile from "url:./inject.js";

import { FILL_LOGIN_MESSAGE, WHICH_PAGE_MESSAGE } from "~messaging/constants";
import {
  PAGE_TYPES,
  SIGNIN_PAGE_TYPES,
  type FillLoginRequest,
  type FillLoginResponse,
  type Page,
  type WhichPageRequest,
  type WhichPageResponse,
} from "~messaging/types";

console.log("Content script loaded.");

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_idle",
};

const isElementVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0"
  );
};

function simulateTyping(element: HTMLInputElement, value: string) {
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
      return PAGE_TYPES.AWS_SIGNIN_IAM;
    } else {
      return PAGE_TYPES.UNKNOWN;
    }
  }
  if (!isElementVisible(loginContainer)) {
    return PAGE_TYPES.AWS_SIGNIN_INITIAL;
  }
  const accountFields = document.getElementById("accountFields");
  if (!accountFields) {
    return PAGE_TYPES.AWS_SIGNIN_ROOT;
  } else {
    return PAGE_TYPES.AWS_SIGNIN_IAM;
  }
}

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

/**
 * Type guard for button elements
 */
const isButtonElement = (element: Element): element is HTMLButtonElement => {
  return element.tagName === "BUTTON";
};

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

function triggerAngularSignInClick() {
  // Create a script element
  const scriptEl = document.createElement("script");
  console.log("myFile:", myFile);

  // Set the script source to your inject.js file
  scriptEl.src = myFile.split("?")[0];

  // Append the script to the page's body
  document.body.appendChild(scriptEl);

  // Optionally, remove the script after it runs to keep the DOM clean
  scriptEl.onload = function () {
    scriptEl.remove();
  };
}

// fill login listener
chrome.runtime.onMessage.addListener(function (
  request: FillLoginRequest,
  _sender,
  sendResponse: FillLoginResponse,
): void {
  console.log("Content script received message:", request);
  if (request.name === FILL_LOGIN_MESSAGE) {
    // check if a button with id = "next_button_text" exists
    const page = getPageInfo();

    if (page === PAGE_TYPES.AWS_SIGNIN_INITIAL) {
      // user is on aws-signin-initial page
      const resolvingInputToFill = !!request.body.account
        ? request.body.account
        : request.body.username;

      console.log("resolvingInputToFill:", resolvingInputToFill);

      const radios = document.querySelectorAll(`input[name="userType"]`);

      // select the correct radio button user type
      if (request.body.account === "" || request.body.account === null) {
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
      } else {
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
      }

      // fill the input and then click "next" button
      const resolvingInput = document.getElementById("resolving_input");
      const nextButton = document.getElementById("next_button");

      if (
        typeof resolvingInput === "undefined" ||
        typeof nextButton === "undefined"
      ) {
        console.error("Could not find resolving input.");
        sendResponse({ success: false });
        return;
      }

      if (isInputElement(resolvingInput) && isButtonElement(nextButton)) {
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
      let signInType: "iam-signin" | "root-signin";
      const { account, username, password } = request.body;
      const accountField = document.getElementById("account");
      const usernameField = document.getElementById("username");
      const passwordField = document.getElementById("password");
      if (getPageInfo() === PAGE_TYPES.AWS_SIGNIN_IAM) {
        signInType = SIGNIN_PAGE_TYPES.IAM_SIGNIN;
        if (
          accountField &&
          usernameField &&
          passwordField &&
          isInputElement(accountField) &&
          isInputElement(usernameField) &&
          isInputElement(passwordField)
        ) {
          if (account && accountField.value !== account) {
            simulateTyping(accountField, account);
          }
          simulateTyping(usernameField, username);
          simulateTyping(passwordField, password);
          sendResponse({ success: true });
        } else {
          console.error("Could not find login fields.");
          sendResponse({ success: false });
        }
      } else if (getPageInfo() === PAGE_TYPES.AWS_SIGNIN_ROOT) {
        signInType = SIGNIN_PAGE_TYPES.ROOT_SIGNIN;
        const passwordField = document.getElementById("password");
        if (passwordField && isInputElement(passwordField)) {
          simulateTyping(passwordField, password);
          sendResponse({ success: true });
        } else {
          console.error("Could not find login fields.");
          sendResponse({ success: false });
        }
      }

      setTimeout(() => {
        if (signInType === SIGNIN_PAGE_TYPES.IAM_SIGNIN) {
          triggerAngularSignInClick();
        } else if (signInType === SIGNIN_PAGE_TYPES.ROOT_SIGNIN) {
          const btn = document.getElementById("signin_button");
          btn.click();
        } else {
          console.error(
            "Could not find login fields. Something messy happened.",
          );
        }
      }, 1);
    }
  }
});
