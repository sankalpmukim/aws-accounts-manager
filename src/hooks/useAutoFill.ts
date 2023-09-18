/**
 * Send to content script using Plasmo's message passing
 * Send fillLogin message with data
 *
 * This hook "useAutoFill" provides a function that accepts a FillLoginRequestData object
 * and sends a message to the content script with that data.
 * Log the success boolean response from the content script.
 */
import { sendToContentScript } from "@plasmohq/messaging";

import { FILL_LOGIN_MESSAGE } from "~messaging/constants";
import type { FillLoginRequestData } from "~messaging/types";

export const useAutoFill = () => {
  return (data: FillLoginRequestData) => {
    sendToContentScript<FillLoginRequestData, { success: boolean }>({
      name: FILL_LOGIN_MESSAGE,
      body: data,
    }).then((response) => {
      console.log("Response from content script:", response);
    });
  };
};
