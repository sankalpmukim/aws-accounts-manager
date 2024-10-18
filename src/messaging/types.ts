export type Page =
  | "aws-signin-initial"
  | "aws-signin-root"
  | "aws-signin-iam"
  | "aws-new-signin-initial"
  | "aws-new-signin-root"
  | "aws-new-signin-iam"
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
  body: FillLoginRequestData;
};

export type FillLoginResponse = (response: { success: boolean }) => void;

export const PAGE_TYPES = {
  AWS_SIGNIN_INITIAL: "aws-signin-initial",
  AWS_SIGNIN_ROOT: "aws-signin-root",
  AWS_SIGNIN_IAM: "aws-signin-iam",
  AWS_NEW_SIGNIN_INITIAL: "aws-new-signin-initial",
  AWS_NEW_SIGNIN_ROOT: "aws-new-signin-root",
  AWS_NEW_SIGNIN_IAM: "aws-new-signin-iam",
  AWS_CONSOLE: "aws-console",
  UNKNOWN: "unknown",
} as const;

export const SIGNIN_PAGE_TYPES = {
  IAM_SIGNIN: "iam-signin",
  ROOT_SIGNIN: "root-signin",
} as const;
