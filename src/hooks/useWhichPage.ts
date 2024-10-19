import { useEffect, useState } from "react";

import { sendToContentScript } from "@plasmohq/messaging";

import {
  GO_TO_ROOT_SIGNIN_MESSAGE,
  WHICH_PAGE_MESSAGE,
} from "~messaging/constants";
import type { GoToRootSigninRequestData, Page } from "~messaging/types";

/**
 * React hook `useWhichPage` that makes sends a message to Content Script to
 * determine which page the user is on.
 * The returned answer can be one of the following:
 * - "aws-signin-initial"
 * - "aws-signin-root"
 * - "aws-signin-iam"
 * - "aws-console"
 * - "unknown"
 *
 * Implement using a combination of 2 useState and useEffect.
 * 1 useState contains the answer to the question.
 * 1 useState contains the status of loading.(boolean)
 * useEffect sends a message (using plasmoHq api) from popup to Content Script to determine which page the user is on.
 * and then updates the answer and loading status.
 */

export const useWhichPage = (): [Page, boolean, () => void] => {
  const [page, setPage] = useState<Page>("unknown");
  const [loading, setLoading] = useState<boolean>(true);

  // TODO add a refresh info trigger function
  useEffect(() => {
    sendToContentScript<never, { page: Page }>({
      name: WHICH_PAGE_MESSAGE,
    }).then((response) => {
      console.log("Content script responded with:", response);
      if (typeof response === "undefined") {
        console.warn("Content script did not respond.");
        console.log(chrome.runtime.lastError);
        return;
      }
      setPage(response.page);
      console.log("Page is", response.page);
      setLoading(false);
    });
  }, []);

  return [
    page,
    loading,
    () => {
      sendToContentScript<GoToRootSigninRequestData, {}>({
        name: GO_TO_ROOT_SIGNIN_MESSAGE,
        body: {},
      }).then(() => {
        console.log("Sent go to root signin message.");
      });
    },
  ];
};
