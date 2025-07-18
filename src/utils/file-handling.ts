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
  console.log("CSV Parse: Starting to parse CSV content");
  console.log("CSV Parse: Content length:", content.length);
  
  const lines = content.split("\n");
  console.log("CSV Parse: Total lines found:", lines.length);
  console.log("CSV Parse: Lines preview:", lines.slice(0, 5));
  
  const header = lines.shift();
  console.log("CSV Parse: Header:", header);
  
  if (header !== "alias,type,username,password,account") {
    console.error("CSV Parse: Invalid header format. Expected: 'alias,type,username,password,account', Got:", header);
    throw new Error("Invalid CSV file format.");
  }

  const accounts: StorageAccountType[] = [];
  console.log("CSV Parse: Processing", lines.length, "data lines");
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    console.log(`CSV Parse: Processing line ${i}:`, line);
    
    if (line.trim() === "") {
      console.log(`CSV Parse: Skipping empty line ${i}`);
      continue;
    }
    
    const values = line.split(",");
    console.log(`CSV Parse: Line ${i} values:`, values);
    
    if (values.length < 5) {
      console.error(`CSV Parse: Invalid CSV format at line ${i}. Expected 5 values, got ${values.length}:`, values);
      continue;
    }

    const account: StorageAccountType = {
      name: values[0],
      username: values[2],
      password: values[3],
      account: values[4],
      dateOfLastUsage: null,
    };
    
    console.log(`CSV Parse: Created account from line ${i}:`, account);
    accounts.push(account);
  }

  console.log("CSV Parse: Finished parsing. Total accounts created:", accounts.length);
  return accounts;
}
