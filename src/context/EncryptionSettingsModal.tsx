import React, { createContext, useContext, useState } from "react";

type EncryptionSettingsModalContext = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
];

const encryptionSettingsModalContext =
  createContext<EncryptionSettingsModalContext>(null);

function EncryptionSettingsModalProvider({ children }) {
  const [modal, setModal] = useState(false);
  return (
    <encryptionSettingsModalContext.Provider value={[modal, setModal]}>
      {children}
    </encryptionSettingsModalContext.Provider>
  );
}

const useOpenEncryptionSettingsModal = () => {
  const setModal = useContext(encryptionSettingsModalContext)[1];
  return () => {
    console.log(`true hua`);
    setModal((_) => true);
  };
};

const useEncryptionSettingsModelContext =
  (): EncryptionSettingsModalContext => {
    return useContext(encryptionSettingsModalContext);
  };

export {
  encryptionSettingsModalContext,
  EncryptionSettingsModalProvider,
  useOpenEncryptionSettingsModal,
  useEncryptionSettingsModelContext,
};
