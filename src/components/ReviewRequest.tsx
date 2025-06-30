import { Dialog, Transition } from "@headlessui/react";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { useReviewRequestModalContext } from "~context/ReviewRequestModal";
import { REVIEW_STORAGE_KEY, type ReviewRequestData } from "~features/storage";

export default function ReviewRequest() {
  const [modalIsOpen, setModalIsOpen] = useReviewRequestModalContext();
  const [reviewData, setReviewData] = useStorage<ReviewRequestData>(
    REVIEW_STORAGE_KEY,
    {
      firstInstallDate: null,
      lastReviewPromptDate: null,
      reviewPreference: "pending",
    },
  );

  const handleRateUs = () => {
    // Update preference and close modal
    setReviewData((prev) => ({
      ...prev,
      reviewPreference: "never",
      lastReviewPromptDate: new Date().toISOString(),
    }));
    setModalIsOpen(false);
    // Open review link
    console.log(`process.env.PLASMO_BROWSER`, process.env.PLASMO_BROWSER);
    window.open("https://example.com", "_blank");
  };

  const handleAskLater = () => {
    // Update last prompt date and close modal
    setReviewData((prev) => ({
      ...prev,
      reviewPreference: "later",
      lastReviewPromptDate: new Date().toISOString(),
    }));
    setModalIsOpen(false);
  };

  const handleNeverAsk = () => {
    // Set preference to never and close modal
    setReviewData((prev) => ({
      ...prev,
      reviewPreference: "never",
      lastReviewPromptDate: new Date().toISOString(),
    }));
    setModalIsOpen(false);
  };

  const handleClose = () => {
    // Treat close as "ask later"
    handleAskLater();
  };

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Top Info */}
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <StarSolidIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Enjoying AWS Accounts Manager?
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        If you're finding this extension helpful, we'd love to
                        hear from you!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Your review helps us improve and reach more users.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Star Rating Visual */}
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarSolidIcon
                        key={star}
                        className="h-8 w-8 text-yellow-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-col sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                    onClick={handleRateUs}
                  >
                    Rate Us ⭐
                  </button>

                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                    onClick={handleAskLater}
                  >
                    {`Ask Me Later`}
                  </button>

                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                    onClick={handleNeverAsk}
                  >
                    Don't Ask Again
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
