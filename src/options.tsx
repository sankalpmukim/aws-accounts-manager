import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { STORAGE_KEY, type StorageAccountType } from "~features/storage";
import {
  accountsArrayToCsvContent,
  downloadFile,
  readCsvFileStringToStorage,
} from "~utils/file-handling";

import "~style.css";

export default function OptionsIndex() {
  const [accounts, setAccounts] = useStorage<StorageAccountType[]>(
    STORAGE_KEY,
    [],
  );
  const [importStatus, setImportStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const fileContent = event.target.result.toString();
        const newAccounts = readCsvFileStringToStorage(fileContent);
        setAccounts((oldAccounts) => [...oldAccounts, ...newAccounts]);
        setImportStatus(`Successfully imported ${newAccounts.length} accounts`);
        setTimeout(() => setImportStatus(""), 3000);
      } catch (error) {
        console.error("Error parsing CSV file:", error);
        setImportStatus("Error reading CSV file. Please check the format.");
        setTimeout(() => setImportStatus(""), 3000);
      }
    };
    reader.onerror = function () {
      setImportStatus("Error reading file. Please try again.");
      setTimeout(() => setImportStatus(""), 3000);
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const csvContents = accountsArrayToCsvContent(accounts);
    downloadFile(csvContents, `accounts.csv`, `text/csv`);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all accounts? This action cannot be undone.")) {
      setAccounts([]);
      setImportStatus("All accounts have been cleared");
      setTimeout(() => setImportStatus(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <AdjustmentsVerticalIcon
                    className="h-6 w-6 text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-4">
                  <h1 className="text-lg font-medium text-gray-900">
                    AWS Accounts Manager Settings
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage your AWS accounts with bulk import/export operations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {importStatus && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{importStatus}</div>
            </div>
          )}

          {/* Account Summary */}
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Account Summary
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                You currently have {accounts.length} account{accounts.length !== 1 ? 's' : ''} configured
              </p>
            </div>
          </div>

          {/* Bulk Operations */}
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Bulk Operations
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Import accounts from a CSV file, export your current accounts, or clear all accounts
              </p>
              
              <div className="mt-5 space-y-4">
                {/* Export Button */}
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
                  onClick={handleExport}
                >
                  Export Accounts to CSV
                </button>

                {/* Import Button */}
                <label className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer sm:w-auto sm:ml-3">
                  Import CSV File
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv, text/csv"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files?.length) {
                        handleFile(files[0]);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>

                {/* Clear All Button */}
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:w-auto sm:ml-3"
                  onClick={handleClearAll}
                >
                  Clear All Accounts
                </button>
              </div>
            </div>
          </div>

          {/* CSV Format Information */}
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">
                CSV Format Information
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Your CSV file should have the following format:
              </p>
              <div className="mt-3 bg-gray-50 p-3 rounded-md">
                <code className="text-sm font-mono text-gray-700">
                  alias,type,username,password,account<br/>
                  My Account,root,myuser,mypass,123456789012<br/>
                  Dev Account,iam,devuser,devpass,dev-account-id
                </code>
              </div>
              <ul className="mt-3 text-sm text-gray-600 list-disc pl-5">
                <li><strong>alias</strong>: A friendly name for the account</li>
                <li><strong>type</strong>: Either "root" or "iam"</li>
                <li><strong>username</strong>: The username for login</li>
                <li><strong>password</strong>: The password for login</li>
                <li><strong>account</strong>: The AWS account ID (for root accounts, this can be the account ID)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}