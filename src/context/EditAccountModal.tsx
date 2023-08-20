import React, { createContext, useContext, useState } from "react";

import { type StorageAccountType } from "~features/storage";

export type EditStorageAccountType =
  | (StorageAccountType & { index: number })
  | null;

type EditAccountModalContext = [
  EditStorageAccountType,
  React.Dispatch<React.SetStateAction<EditStorageAccountType>>,
];

const editAccountModalContext = createContext<EditAccountModalContext>(null);

function EditAccountModalProvider({ children }) {
  const [modal, setModal] = useState<EditStorageAccountType>(null);
  return (
    <editAccountModalContext.Provider value={[modal, setModal]}>
      {children}
    </editAccountModalContext.Provider>
  );
}

const useOpenEditAccountModal = () => {
  const setModal = useContext(editAccountModalContext)[1];
  return (val: EditStorageAccountType) => {
    setModal(val);
  };
};

const useEditAccountModelContext = (): EditAccountModalContext => {
  return useContext(editAccountModalContext);
};

export {
  editAccountModalContext,
  EditAccountModalProvider,
  useOpenEditAccountModal,
  useEditAccountModelContext,
};
