import "~style.css";

import React from "react";

import CreateAccount from "~components/CreateAccount";
import EditAccount from "~components/EditAccount";
import List from "~components/List";
import ReviewRequest from "~components/ReviewRequest";
import {
  CreateAccountModalProvider,
  useOpenCreateAccountModal,
} from "~context/CreateAccountModal";
import { EditAccountModalProvider } from "~context/EditAccountModal";
import {
  ReviewRequestModalProvider,
  useOpenReviewRequestModal,
} from "~context/ReviewRequestModal";
import { useReviewRequest } from "~hooks/useReviewRequest";
import { useWhichPage } from "~hooks/useWhichPage";
import { PAGE_TYPES } from "~messaging/types";

import ManageAccounts from "./components/ManageAccounts";
import {
  ManageAccountsModalProvider,
  useOpenManageAccountsModal,
} from "./context/ManageAccountModal";

const SHOW_STATUS = {
  unknown: "Currently not on AWS signin page.",
  [PAGE_TYPES.AWS_SIGNIN_INITIAL]: "Currently on AWS signin page.",
  [PAGE_TYPES.AWS_SIGNIN_ROOT]: "Currently on AWS root login screen.",
  [PAGE_TYPES.AWS_SIGNIN_IAM]: "Currently on AWS IAM login screen.",
  [PAGE_TYPES.AWS_NEW_SIGNIN_INITIAL]: "Currently on AWS signin page.",
  [PAGE_TYPES.AWS_NEW_SIGNIN_ROOT]: "Currently on AWS root login screen.",
  [PAGE_TYPES.AWS_NEW_SIGNIN_IAM]: "Currently on AWS IAM login screen.",
} as const;

function Popup() {
  const openAddAccountModal = useOpenCreateAccountModal();
  const openManageAccountsModal = useOpenManageAccountsModal();
  const openReviewRequestModal = useOpenReviewRequestModal();
  const [page, loading] = useWhichPage();
  const shouldShowReview = useReviewRequest();

  // Show review request modal when conditions are met
  React.useEffect(() => {
    if (shouldShowReview) {
      openReviewRequestModal();
    }
  }, [shouldShowReview, openReviewRequestModal]);

  return (
    <div className="m-3 rounded-lg border border-gray-200 shadow">
      <div className="flex flex-col items-start justify-between bg-white p-4 md:flex-row md:items-center md:p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 md:text-xl">
            AWS Accounts Manager
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {`${SHOW_STATUS[page] ?? SHOW_STATUS["unknown"]}${
              loading ? ", Loading..." : ""
            }`}
          </p>
        </div>
        <div className="mt-4 flex gap-4 md:mt-0">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            onClick={openAddAccountModal}
          >
            Add Account
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 ring-1 ring-gray-300 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            onClick={openManageAccountsModal}
          >
            Manage Accounts
          </button>
        </div>
      </div>
      <hr className="border-t border-gray-200" />
      <List />
    </div>
  );
}

function IndexPopup() {
  return (
    <CreateAccountModalProvider>
      <EditAccountModalProvider>
        <ManageAccountsModalProvider>
          <ReviewRequestModalProvider>
            <Popup />
            <CreateAccount />
            <EditAccount />
            <ManageAccounts />
            <ReviewRequest />
          </ReviewRequestModalProvider>
        </ManageAccountsModalProvider>
      </EditAccountModalProvider>
    </CreateAccountModalProvider>
  );
}

export default IndexPopup;
