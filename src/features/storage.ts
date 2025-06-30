export interface StoreInformation {
  name: string;
  account: string;
  username: string;
  password: string;
}

export type StorageAccountType = StoreInformation & {
  dateOfLastUsage: string | null;
};

export interface ReviewRequestData {
  firstInstallDate: string | null;
  lastReviewPromptDate: string | null;
  reviewPreference: "pending" | "later" | "never";
}

export const STORAGE_KEY = "accounts";
export const REVIEW_STORAGE_KEY = "reviewRequest";
