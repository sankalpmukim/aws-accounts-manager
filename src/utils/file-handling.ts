import type { StorageAccountType } from "../features/storage";

export function downloadFile(
  content: string,
  filename: string,
  contentType: string,
) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href); // Clean up the URL object
}

export function accountsArrayToCsvContent(accounts: StorageAccountType[]) {
  const header = "alias,type,username,password,account\n";
  const rows = accounts.map(
    (account) =>
      `${account.name},${account.account === `` ? `root` : `iam`},${
        account.username
      },${account.password},${account.account}\n`,
  );

  return header + rows.join("");
}

export function readCsvFileStringToStorage(
  content: string,
): StorageAccountType[] {
  const lines = content.split("\n");
  const header = lines.shift();
  if (header !== "alias,type,username,password,account") {
    throw new Error("Invalid CSV file format.");
  }

  const accounts: StorageAccountType[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const values = line.split(",");
    if (values.length < 5) {
      console.error("Invalid CSV file format.", i);
      continue;
    }

    const account: StorageAccountType = {
      name: values[0],
      username: values[2],
      password: values[3],
      account: values[4],
      dateOfLastUsage: null,
    };

    accounts.push(account);
  }

  return accounts;
}
