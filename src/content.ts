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
  matches: ["*://*.aws.amazon.com/*"],
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

function simulateClearing(element: HTMLInputElement) {
  // Set the value of the element to an empty string
  element.value = "";

  // Create and dispatch an input event
  let event = new InputEvent("input", {
    bubbles: true,
    cancelable: true,
    data: "", // Data is an empty string as the field is cleared
    inputType: "deleteContentBackward", // Input type representing clearing action
  });

  // Dispatch the event
  element.dispatchEvent(event);
}

function simulateTyping(element: HTMLInputElement, value: string) {
  // Clear the field first
  simulateClearing(element);

  // Type the value
  for (let char of value) {
    element.value += char;

    // Create and dispatch the event
    // Use InputEvent instead of Event
    let event = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      data: char, // Set data to the current character
      inputType: "insertText", // Use "insertText" instead of "insertReplacementText"
      isComposing: false, // Explicitly set isComposing to false
    });

    // Dispatch the event
    element.dispatchEvent(event);
  }
}

/**
 * Check everywhere to see if the string exists in this page or not.
 */
function checkForSubstringInTags(substring: string, tag: string): boolean {
  // Get all elements of the provided tag type on the page
  const elements = document.querySelectorAll(tag);

  // Iterate through each element and check for the provided substring
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].textContent?.includes(substring)) {
      return true; // Substring found
    }
  }

  return false; // Substring not found
}

function getPageInfo(): Page {
  // new ui checks
  const isNextApp = document.getElementById("__next");
  if (isNextApp !== null) {
    if (checkForSubstringInTags("Access your AWS account by user type.", "p")) {
      return PAGE_TYPES.AWS_NEW_SIGNIN_INITIAL;
    }

    if (checkForSubstringInTags("Enter the password for", "p")) {
      return PAGE_TYPES.AWS_NEW_SIGNIN_ROOT;
    }

    if (checkForSubstringInTags("IAM username", "label")) {
      return PAGE_TYPES.AWS_NEW_SIGNIN_IAM;
    }
  }

  // old UI checks
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
    } else if (page === PAGE_TYPES.AWS_NEW_SIGNIN_INITIAL) {
      // user is on aws-signin-initial page
      const resolvingInputToFill = !!request.body.account
        ? request.body.account
        : request.body.username;

      console.log("resolvingInputToFill:", resolvingInputToFill);

      const radios = document.querySelectorAll(`input[type="radio"]`);
      console.log(radios.length);
      if (request.body.account === "" || request.body.account === null) {
        // select the root account radio button
        radios.forEach((radio) => {
          if (isRadioElement(radio) && radio.value === "ROOT") {
            radio.checked = true;
            radio.click(); // this one happened after 'i am god' level debugging and frontend knowledge'
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
          console.log(`hit`);
          if (isRadioElement(radio) && radio.value === "IAM") {
            console.log(`hit1`);
            radio.checked = true;
            radio.click(); // this one happened after 'i am god' level debugging and frontend knowledge'
          } else if (isRadioElement(radio)) {
            console.log(`hit2`);
            radio.checked = false;
          } else {
            console.log(`hit3`);
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
      const page = getPageInfo();
      if (
        page === PAGE_TYPES.AWS_SIGNIN_IAM ||
        page === PAGE_TYPES.AWS_NEW_SIGNIN_IAM
      ) {
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
      } else if (
        page === PAGE_TYPES.AWS_SIGNIN_ROOT ||
        page === PAGE_TYPES.AWS_NEW_SIGNIN_ROOT
      ) {
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
          const btn = document.getElementById("signin_button");
          btn.click();
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
