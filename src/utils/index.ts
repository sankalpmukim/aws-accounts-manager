export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export const BROWSER_STORES = {
  CHROME: `https://chromewebstore.google.com/detail/aws-accounts-manager/hkcpaihoknnbgfaehgcihpidbkhmfacj`,
  FIREFOX: `https://addons.mozilla.org/en-US/firefox/addon/aws-accounts-manager`,
} as const;
