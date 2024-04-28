import React, { createContext, useContext, useState } from "react";

type ManageAccountsModalContext = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
];

const manageAccountsModalContext =
  createContext<ManageAccountsModalContext>(null);

function ManageAccountsModalProvider({ children }) {
  const [modal, setModal] = useState(false);
  return (
    <manageAccountsModalContext.Provider value={[modal, setModal]}>
      {children}
    </manageAccountsModalContext.Provider>
  );
}

const useOpenManageAccountsModal = () => {
  const setModal = useContext(manageAccountsModalContext)[1];
  return () => {
    setModal((_) => true);
  };
};

const useManageAccountsModelContext = (): ManageAccountsModalContext => {
  return useContext(manageAccountsModalContext);
};

export {
  manageAccountsModalContext,
  ManageAccountsModalProvider,
  useOpenManageAccountsModal,
  useManageAccountsModelContext,
};
