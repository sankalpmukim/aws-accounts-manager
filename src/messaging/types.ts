export type Page =
  | "aws-signin-initial"
  | "aws-signin-root"
  | "aws-signin-iam"
  | "aws-console"
  | "unknown";

export type WhichPageRequest = {
  name: string; // whichPage
};

export type WhichPageResponse = (response: { page: Page }) => void;

type Prettify<T> = {
  [K in keyof T]: T[K];
};

export interface FillLoginRequestData {
  account: string | null;
  username: string;
  password: string;
}

export type FillLoginRequest = {
  name: string; // fillLogin
  data: FillLoginRequestData;
};

export type FillLoginResponse = (response: { success: boolean }) => void;
