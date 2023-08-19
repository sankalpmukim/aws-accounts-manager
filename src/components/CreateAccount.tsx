import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";

import { useCreateAccountModelContext } from "~context/CreateAccountModal";
import { classNames } from "~utils";

interface TypeOfAccount {
  name: "Root Account" | "IAM Account";
  description: string;
}

const typesOfAccount = [
  {
    name: "Root Account" as const,
    description:
      "Account owner that performs tasks requiring unrestricted access." as const,
  },
  {
    name: "IAM Account" as const,
    description: "User within an account that performs daily tasks." as const,
  },
] as const;

export default function CreateAccount() {
  const [modalIsOpen, setModalIsOpen] = useCreateAccountModelContext();
  const [typeOfAccount, setTypeOfAccount] = useState<TypeOfAccount>(
    typesOfAccount[0],
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
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setModalIsOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <PlusCircleIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {`Add a new AWS Account`}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {`Add an AWS account to your list of accounts. `}
                      </p>
                      <p className="text-sm text-gray-500">
                        {`It can be both a root account or an IAM user. `}
                      </p>
                    </div>
                  </div>
                </div>
                {/* User Chosen Alias */}
                <div className="mt-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Alias
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="you@example.com"
                      aria-describedby="name-description"
                    />
                  </div>
                  <p
                    className="mt-2 text-sm text-gray-500"
                    id="name-description"
                  >
                    {`Set a familiar name for the account`}
                  </p>
                </div>
                {/* Types of accounts */}
                <div className="mt-4">
                  <label className="text-base font-semibold text-gray-900">
                    {`Type of account`}
                  </label>
                  <RadioGroup
                    value={typeOfAccount}
                    onChange={setTypeOfAccount}
                    className="mt-4"
                  >
                    <RadioGroup.Label className="sr-only">
                      Privacy setting
                    </RadioGroup.Label>
                    <div className="-space-y-px rounded-md bg-white">
                      {typesOfAccount.map((setting, settingIdx) => (
                        <RadioGroup.Option
                          key={setting.name}
                          value={setting}
                          className={({ checked }) =>
                            classNames(
                              settingIdx === 0
                                ? "rounded-tl-md rounded-tr-md"
                                : "",
                              settingIdx === typesOfAccount.length - 1
                                ? "rounded-bl-md rounded-br-md"
                                : "",
                              checked
                                ? "z-10 border-indigo-200 bg-indigo-50"
                                : "border-gray-200",
                              "relative flex cursor-pointer border p-4 focus:outline-none",
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <span
                                className={classNames(
                                  checked
                                    ? "bg-indigo-600 border-transparent"
                                    : "bg-white border-gray-300",
                                  active
                                    ? "ring-2 ring-offset-2 ring-indigo-600"
                                    : "",
                                  "mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center",
                                )}
                                aria-hidden="true"
                              >
                                <span className="rounded-full bg-white w-1.5 h-1.5" />
                              </span>
                              <span className="ml-3 flex flex-col">
                                <RadioGroup.Label
                                  as="span"
                                  className={classNames(
                                    checked
                                      ? "text-indigo-900"
                                      : "text-gray-900",
                                    "block text-sm font-medium",
                                  )}
                                >
                                  {setting.name}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className={classNames(
                                    checked
                                      ? "text-indigo-700"
                                      : "text-gray-500",
                                    "block text-sm",
                                  )}
                                >
                                  {setting.description}
                                </RadioGroup.Description>
                              </span>
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
                {/* IAM User name or Root user email address */}
                <div className="mt-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {typeOfAccount.name === "Root Account"
                      ? `Root user email address`
                      : `IAM user name`}
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder=""
                      aria-describedby="username-description"
                    />
                  </div>
                </div>
                {/* IAM User name or Root user email address */}
                <div className="mt-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {`Password`}
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder=""
                      aria-describedby="password-description"
                    />
                  </div>
                </div>
                {/* Account ID or account alias */}
                {typeOfAccount.name === "IAM Account" && (
                  <div className="mt-4">
                    <label
                      htmlFor="account"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {`Account ID (12 digits) or account alias`}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="account"
                        id="account"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="123456789012 or alias"
                        aria-describedby="account-description"
                      />
                    </div>
                  </div>
                )}
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    onClick={() => setModalIsOpen(false)}
                  >
                    {`Add account`}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setModalIsOpen(false)}
                  >
                    {`Cancel`}
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
