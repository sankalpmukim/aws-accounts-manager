import React, { createContext, useContext, useState } from "react";

type ReviewRequestModalContext = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
];

const reviewRequestModalContext =
  createContext<ReviewRequestModalContext>(null);

function ReviewRequestModalProvider({ children }) {
  const [modal, setModal] = useState(false);
  return (
    <reviewRequestModalContext.Provider value={[modal, setModal]}>
      {children}
    </reviewRequestModalContext.Provider>
  );
}

const useOpenReviewRequestModal = () => {
  const setModal = useContext(reviewRequestModalContext)[1];
  return () => {
    setModal((_) => true);
  };
};

const useReviewRequestModalContext = (): ReviewRequestModalContext => {
  return useContext(reviewRequestModalContext);
};

export {
  reviewRequestModalContext,
  ReviewRequestModalProvider,
  useOpenReviewRequestModal,
  useReviewRequestModalContext,
};
