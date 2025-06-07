# mini-monorepo-node-ts-aws-starter

This a minimalistic monorepository template to develop projects in TypeScript and run it using Node.js on AWS.


## Using this repo as a template

Work in progress...


## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) - Node Version Manager.


## Runtime and dependencies

- [Node.js v22](https://nodejs.org/docs/latest-v22.x/api/index.html) - this repo aims to always support the latest supported [LTS Node.js version](https://nodejs.org/en/about/previous-releases) that is officially supported by the [AWS lambda runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html).
- [ECMAScript modules](https://nodejs.org/docs/latest-v22.x/api/esm.html#introduction) are the official standard format to package JavaScript code for reuse. This repository uses this format for all the modules.
- [pnpm](https://github.com/pnpm/pnpm)(Performant Node Package Manager) - pnpm is used to manage dependencies off all the repository projects using [its workspaces feature](https://pnpm.io/workspaces).


## Installation

Please make sure that prerequisites are met and then run:

```sh
> nvm install
Now using node v22.16.0 (npm v10.9.2)

> npm install -g pnpm

added 1 package in 2s
```
