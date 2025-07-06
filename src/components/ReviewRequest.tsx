import { Dialog, Transition } from "@headlessui/react";
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { useReviewRequestModalContext } from "~context/ReviewRequestModal";
import { REVIEW_STORAGE_KEY, type ReviewRequestData } from "~features/storage";
import { BROWSER_STORES } from "~utils";

export default function ReviewRequest() {
  const [modalIsOpen, setModalIsOpen] = useReviewRequestModalContext();
  const [currentView, setCurrentView] = useState<
    "initial" | "positive" | "negative"
  >("initial");
  const [reviewData, setReviewData] = useStorage<ReviewRequestData>(
    REVIEW_STORAGE_KEY,
    {
      firstInstallDate: null,
      lastReviewPromptDate: null,
      reviewPreference: "pending",
    },
  );

  const handleThumbsUp = () => {
    setCurrentView("positive");
  };

  const handleThumbsDown = () => {
    setCurrentView("negative");
  };

  const handleReviewStore = () => {
    // Update preference and close modal
    setReviewData((prev) => ({
      ...prev,
      reviewPreference: "never",
      lastReviewPromptDate: new Date().toISOString(),
    }));
    setModalIsOpen(false);

    // Open appropriate browser store
    const browserStore =
      process.env.PLASMO_BROWSER === "firefox"
        ? BROWSER_STORES.FIREFOX
        : BROWSER_STORES.CHROME;
    window.open(browserStore, "_blank");
  };

  const handleNotNow = () => {
    // Update last prompt date and close modal
    setReviewData((prev) => ({
      ...prev,
      reviewPreference: "later",
      lastReviewPromptDate: new Date().toISOString(),
    }));
    setModalIsOpen(false);
  };

  const handleClose = () => {
    // Treat close as "ask later"
    handleNotNow();
  };

  // Reset to initial view when modal opens
  useEffect(() => {
    if (modalIsOpen) {
      setCurrentView("initial");
    }
  }, [modalIsOpen]);

  const renderInitialView = () => (
    <div className="text-center">
      <Dialog.Title
        as="h3"
        className="mb-4 text-lg font-semibold leading-6 text-gray-900"
      >
        Are you finding this extension useful?
      </Dialog.Title>

      <div className="mt-6 flex justify-center gap-6">
        <button
          type="button"
          className="flex flex-col items-center rounded-lg p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleThumbsUp}
        >
          <HandThumbUpIcon className="mb-2 h-8 w-8 text-green-500" />
          <span className="text-sm font-medium text-gray-900">Yes</span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center rounded-lg p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleThumbsDown}
        >
          <HandThumbDownIcon className="mb-2 h-8 w-8 text-red-500" />
          <span className="text-sm font-medium text-gray-900">No</span>
        </button>
      </div>
    </div>
  );

  const renderPositiveView = () => (
    <div className="text-center">
      <Dialog.Title
        as="h3"
        className="mb-4 text-lg font-semibold leading-6 text-gray-900"
      >
        Great! Help us spread the word
      </Dialog.Title>

      <p className="mb-6 text-sm text-gray-500">
        Would you mind leaving a quick review on the browser store? It really
        helps us out!
      </p>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          onClick={handleReviewStore}
        >
          Leave a Review
        </button>

        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          onClick={handleNotNow}
        >
          Not now
        </button>
      </div>
    </div>
  );

  const renderNegativeView = () => (
    <div className="text-center">
      <Dialog.Title
        as="h3"
        className="mb-4 text-lg font-semibold leading-6 text-gray-900"
      >
        Thanks for your feedback
      </Dialog.Title>

      <p className="mb-6 text-sm text-gray-500">
        We appreciate your honesty. If you have suggestions for improvement,
        we'd love to hear them!
      </p>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          onClick={handleReviewStore}
        >
          Share Feedback
        </button>

        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          onClick={handleNotNow}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <Transition.Root show={modalIsOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-6 py-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {currentView === "initial" && renderInitialView()}
                {currentView === "positive" && renderPositiveView()}
                {currentView === "negative" && renderNegativeView()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
