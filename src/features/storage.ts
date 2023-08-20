export interface StoreInformation {
  name: string;
  account: string;
  username: string;
  password: string;
}

export type StorageAccountType = StoreInformation & {
  dateOfLastUsage: string | null;
};

export const STORAGE_KEY = "accounts";
