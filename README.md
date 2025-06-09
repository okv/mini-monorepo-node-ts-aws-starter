# mini-monorepo-node-ts-aws-starter

This a minimalistic monorepository template to develop projects in TypeScript and run it using Node.js on AWS.


## Using this repo as a template

Work in progress...


## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) - Node Version Manager.
- Basic Unix commands are in place: [zip](https://infozip.sourceforge.net/Zip.html), `rm`.


## Runtime and dependencies

- [Node.js v22](https://nodejs.org/docs/latest-v22.x/api/index.html) - this repo aims to always support the latest supported [LTS Node.js version](https://nodejs.org/en/about/previous-releases) that is officially supported by the [AWS lambda runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html).
- [ECMAScript modules](https://nodejs.org/docs/latest-v22.x/api/esm.html#introduction) are the official standard format to package JavaScript code for reuse. This repository uses this format for all the modules.
- [pnpm](https://github.com/pnpm/pnpm)(Performant Node Package Manager) - pnpm is used to manage dependencies of all the repository projects using [its workspaces feature](https://pnpm.io/workspaces).


## Installation

Please make sure that prerequisites are met and then run:

```sh
> nvm install
Now using node v22.16.0 (npm v10.9.2)

> npm install -g pnpm

added 1 package in 2s
```


## How to make and manage a lambda

Please make sure that everything is installed first, then run this to create a new lambda from a template:

```sh
> pnpm lambda:create foo-lambda

create.mjs run with args: [ 'templates/lambda', 'lambdas', 'foo-lambda' ]
Copying "templates/lambda" to "lambdas/foo-lambda"
Updating "lambdas/foo-lambda"
Updated: lambdas/foo-lambda/package.json
Updated: lambdas/foo-lambda/README.md
Running "pnpm install" for "foo-lambda"
Done, please manually commit the changes now!
```

You can remove it using the following command:

```sh
> pnpm lambda:remove foo-lambda

remove.mjs run with args: [ 'lambdas', 'foo-lambda' ]
> Removing "lambdas/foo-lambda" recursively
> Running "pnpm install" to clean up dependencies
Scope: all 2 workspace projects
Packages: -1
-

Done in 135ms using pnpm v10.11.1

*** Done, please manually commit the changes now!
```

## Managing lambdas with AWS CLI

This section describes how to use AWS CLI v2 to deploy and manage a locally created lambda to AWS. We will be using a separate AWS CLI settings profile that's called `sbox` in all the commands below. Please make sure that the following prerequisites are met:

- [AWS CLI V2 is installed](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Settings for the AWS CLI are configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)(LTLR: `aws configure --profile sbox`)

Let's create and build a lambda using this repo commands first:

```sh
pnpm lambda:create foo-lambda && pnpm --filter foo-lambda build
```

Then we're going to need a very basic role for our lambda functions:

```sh
aws iam create-role --profile sbox --role-name basic-lambda-role --assume-role-policy-document '{ "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Principal": { "Service": "lambda.amazonaws.com" }, "Action": "sts:AssumeRole" } ] }'
```

By the way, many of the AWS CLI commands could be reversed redone by using their counterparts:

```sh
aws iam delete-role --profile sbox --role-name basic-lambda-role
```

Now we can deploy the function:

```sh
# BASIC_LAMBDA_ROLE_ARN has to be set to an ARN of the role that was create above
aws lambda create-function --profile sbox --function-name foo-lambda --runtime nodejs22.x --zip-file fileb://lambdas/foo-lambda/lambda.zip --handler index.handler --role "$BASIC_LAMBDA_ROLE_ARN"
```

And finally we can call it:

```sh
> aws lambda invoke --profile sbox --function-name foo-lambda --cli-binary-format raw-in-base64-out --payload '{ "key": "value" }' /dev/stdout


{"statusCode":200,"body":"{\"hello\":\"Hello from Lambda!\",\"inputEvent\":{\"key\":\"value\"}}"}
    "StatusCode": 200,
    "ExecutedVersion": "$LATEST"
}
```

The function's code can be updating using the following command:

```sh
aws lambda update-function-code --profile sbox --function-name foo-lambda  --zip-file fileb://lambdas/foo-lambda/lambda.zip
```
