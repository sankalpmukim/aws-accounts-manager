import { Dialog, Transition } from "@headlessui/react";
import {
  AdjustmentsVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { useManageAccountsModelContext } from "../context/ManageAccountModal";
import { STORAGE_KEY, type StorageAccountType } from "../features/storage";
import {
  accountsArrayToCsvContent,
  downloadFile,
  readCsvFileStringToStorage,
} from "../utils/file-handling";

export default function ManageAccounts() {
  const [modalIsOpen, setModalIsOpen] = useManageAccountsModelContext();
  const [accounts, setAccounts] = useStorage<StorageAccountType[]>(
    STORAGE_KEY,
    [],
  );
  return (
    <Transition.Root show={modalIsOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setModalIsOpen}>
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
                    onClick={() => setModalIsOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {/* Top Info */}
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AdjustmentsVerticalIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {`Bulk manage your accounts`}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {`You can export a list of your accounts, import a list of accounts, or delete all accounts.`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      const csvContents = accountsArrayToCsvContent(accounts);
                      downloadFile(csvContents, `accounts.csv`, `text/csv`);
                    }}
                  >
                    {`Export a CSV`}
                  </button>
                  <label className="mt-3 inline-flex w-full cursor-pointer justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                    Import File
                    <input
                      type="file"
                      className="absolute h-0 w-0 opacity-0"
                      accept=".csv, text/csv"
                      onChange={function (event) {
                        const files = event.target.files;
                        if (files.length === 0) {
                          return;
                        }
                        const file = files[0];
                        const reader = new FileReader();
                        reader.onload = function (event) {
                          const newAccounts = readCsvFileStringToStorage(
                            event.target.result.toString(),
                          );
                          setAccounts((oldAccounts) => [
                            ...oldAccounts,
                            ...newAccounts,
                          ]);
                          setModalIsOpen(false);
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setAccounts([]);
                      setModalIsOpen(false);
                    }}
                  >
                    {`Clear all accounts`}
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
