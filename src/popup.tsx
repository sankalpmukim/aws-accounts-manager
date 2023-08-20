import CreateAccount from "~components/CreateAccount";
import EditAccount from "~components/EditAccount";
import List from "~components/List";
import {
  CreateAccountModalProvider,
  useOpenCreateAccountModal,
} from "~context/CreateAccountModal";
import { EditAccountModalProvider } from "~context/EditAccountModal";

import "~style.css";

function Popup() {
  const openAddAccountModal = useOpenCreateAccountModal();

  return (
    <div className="m-3 rounded-lg border-2 px-3">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-4">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {`AWS Accounts Manager`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {`Currently not on AWS signin page.`}
            </p>
          </div>
          <div className="ml-4 mt-4 flex-shrink-0">
            <button
              type="button"
              className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={openAddAccountModal}
            >
              {`Add account`}
            </button>
          </div>
        </div>
      </div>
      <List />
    </div>
  );
}

function IndexPopup() {
  return (
    <CreateAccountModalProvider>
      <EditAccountModalProvider>
        <Popup />
        <CreateAccount />
        <EditAccount />
      </EditAccountModalProvider>
    </CreateAccountModalProvider>
  );
}

export default IndexPopup;
