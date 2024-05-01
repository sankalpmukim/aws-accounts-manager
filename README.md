This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!


Disclaimer: I'm scared of the internet. Please don't roast me and my project too bad. But I want to improve and I am serious about this project so I have to make it bigger than it is right now.

## Links

In case you want to skip the Reading part lol, I built a browser extension. Please check it out!

- https://chromewebstore.google.com/detail/aws-accounts-manager/hkcpaihoknnbgfaehgcihpidbkhmfacj
- https://microsoftedge.microsoft.com/addons/detail/aws-accounts-manager/fllabfdlhlbdafgfagdfccmcamahlpmm
- https://addons.mozilla.org/en-US/firefox/addon/aws-accounts-manager/

&#x200B;

## What  
I made a browser extension that is basically a password manager specifically for AWS. IT IS OPEN SOURCE (for the security freaks). As of now, it stores passwords in plaintext but I'm working on evaluating different approaches for that.  


## Why
AWS accounts are very very difficult to manage. Multiple screens, multiple inputs. My existing password managers felt inadequate. They wouldn't be able to remember all 3 inputs, or links properly. 

At the time, I was freelancing for multiple organizations at once related to AWS and had lots of AWS Accounts to manage (multiple from the same org as well because of IAM enthusiasts lol). Because of my continued interest in AWS, I've always worked with multiple AWS Accounts and realized that a better solution to manage multiple accounts should exist.

## Key features/objectives

- Help with *many* accounts:
  - Custom aliases, reorder the list, tracking last used timestamps
- Help with many clicks
  - Auto submit on every browser on autofill
- Help with power users with multiple browsers/devices and want secure sync
  - Can export and import csv files to share and reduce manual work.

## How

To those who are curious enough, they can always visit the GitHub repository, and contact me if they want to contribute with feature ideas. I used Plasmo framework combined with React. Good simple setup. Used tailwind ui for the styling! Find the link to the GitHub repository at the top of the post!

You can find the Extension on all browsers (I even have a fairly satisfying CI/CD!)!

## What Now?

Good question! I and some of my friends have been using it and enjoying it well over the last few months. It even got several daily active users (~50) total across the three browsers combined quite organically. So I want you guys to try it out, and let me know what you think! Its completely open source so I'd love for more people to get involved if they like! You can also just make feature requests and I'd definitely take them up because I'm desperate for external validation (/s? LoL)