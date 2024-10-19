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

export interface EncryptionMetadataStorageType {
  passwordHash: string;
  lastModified: string; // good to have in future, basically a TODO.
}

export const ENCRYPTION_METADATA_STORAGE_KEY = "enc-metadata";
