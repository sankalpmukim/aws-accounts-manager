export type WhichPageRequest = {
  name: string;
};

export type Page =
  | "aws-signin-initial"
  | "aws-signin-root"
  | "aws-signin-iam"
  | "aws-console"
  | "unknown";

export type WhichPageResponse = (response: { page: Page }) => void;
