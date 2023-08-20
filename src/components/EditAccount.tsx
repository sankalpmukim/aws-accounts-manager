import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import {
  useEditAccountModelContext,
  type EditStorageAccountType,
} from "~context/EditAccountModal";
import { STORAGE_KEY, type StorageAccountType } from "~features/storage";
import { classNames } from "~utils";

interface TypeOfAccount {
  name: "Root Account" | "IAM Account";
  description: string;
}

const typesOfAccount: TypeOfAccount[] = [
  {
    name: "Root Account" as const,
    description:
      "Account owner that performs tasks requiring unrestricted access." as const,
  },
  {
    name: "IAM Account" as const,
    description: "User within an account that performs daily tasks." as const,
  },
];

export default function EditAccount() {
  const [editModalInfo, setEditModalInfo] = useEditAccountModelContext();
  const [typeOfAccount, setTypeOfAccount] = useState<TypeOfAccount>(
    editModalInfo
      ? editModalInfo.account === ""
        ? typesOfAccount[0]
        : typesOfAccount[1]
      : typesOfAccount[0],
  );

  const [storeInformation, setStoreInformation] =
    useState<EditStorageAccountType>(
      !!editModalInfo
        ? {
            account: editModalInfo ? editModalInfo.account : "",
            name: editModalInfo ? editModalInfo.name : "",
            password: editModalInfo ? editModalInfo.password : "",
            username: editModalInfo ? editModalInfo.username : "",
            dateOfLastUsage: editModalInfo
              ? editModalInfo.dateOfLastUsage
              : null,
            index: editModalInfo ? editModalInfo.index : null,
          }
        : null,
    );

  useEffect(() => {
    if (editModalInfo !== null) {
      setStoreInformation((prevState) => ({
        ...prevState,
        account: editModalInfo.account,
        name: editModalInfo.name,
        password: editModalInfo.password,
        username: editModalInfo.username,
      }));
      setTypeOfAccount(
        editModalInfo.account === "" ? typesOfAccount[0] : typesOfAccount[1],
      );
    }
  }, [editModalInfo]);

  console.log(editModalInfo, storeInformation);
  const setStorage = useStorage<StorageAccountType[]>(STORAGE_KEY, [])[1];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setStoreInformation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(
    function () {
      // if modal is closed, reset the store information
      if (editModalInfo === null) {
        setStoreInformation(null);
      }
    },
    [editModalInfo],
  );

  useEffect(() => {
    if (typeOfAccount.name === "Root Account") {
      setStoreInformation((prevState) => ({
        ...prevState,
        account: "",
      }));
    }
  }, [typeOfAccount.name]);

  return (
    <Transition.Root show={!!editModalInfo} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setEditModalInfo(null);
        }}
      >
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
                    onClick={() => setEditModalInfo(null)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {/* Top Info */}
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
                      {`Edit an existing entry`}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {`Edit an AWS account from your list of accounts. `}
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
                      placeholder="My Favourite Account!"
                      aria-describedby="name-description"
                      value={!!storeInformation ? storeInformation.name : ""}
                      onChange={handleInputChange}
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
                                    ? "border-transparent bg-indigo-600"
                                    : "border-gray-300 bg-white",
                                  active
                                    ? "ring-2 ring-indigo-600 ring-offset-2"
                                    : "",
                                  "mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border",
                                )}
                                aria-hidden="true"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
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
                      type={
                        typeOfAccount.name === "Root Account" ? "email" : "text"
                      }
                      name="username"
                      id="username"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder=""
                      aria-describedby="username-description"
                      value={
                        !!storeInformation ? storeInformation.username : ""
                      }
                      onChange={handleInputChange}
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
                      value={
                        !!storeInformation ? storeInformation.password : ""
                      }
                      onChange={handleInputChange}
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
                        value={
                          !!storeInformation ? storeInformation.account : ""
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    onClick={() => {
                      // validate input

                      // name should be >3 characters
                      if (storeInformation.name.length < 3) {
                        alert("Name should be at least 3 characters long.");
                        return;
                      }

                      // if type of account is IAM, account should be 12 digits or contain more than 3 alphabets
                      if (typeOfAccount.name === "IAM Account") {
                        // if it doesn't contain any alphabets, it should be 12 digits
                        if (
                          !storeInformation.account.match(/[a-z]/i) &&
                          storeInformation.account.length !== 12
                        ) {
                          alert(
                            "Account should be 12 digits or contain more than 3 alphabets.",
                          );
                          return;
                        }

                        // check username similarly
                        if (storeInformation.username.length < 3) {
                          alert(
                            "Username should be at least 3 characters long.",
                          );
                          return;
                        }
                      } else {
                        // if type of account is Root, username should be an email address, check
                        if (
                          !storeInformation.username.match(
                            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                          )
                        ) {
                          alert("Please provide a valid email address.");
                          return;
                        }
                      }

                      // if password is less than 8 characters, alert
                      if (storeInformation.password.length < 8) {
                        alert("Password should be at least 8 characters long.");
                        return;
                      }

                      // save to storage
                      setStorage((prevState) => {
                        const newState = [...prevState];
                        console.log("prevState", prevState);
                        newState[editModalInfo.index] = {
                          ...storeInformation,
                        };
                        console.log("newState", newState);

                        return newState;
                      });

                      // close modal
                      setEditModalInfo(null);
                    }}
                  >
                    {`Update information`}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setEditModalInfo(null)}
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
