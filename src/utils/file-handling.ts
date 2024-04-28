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
