# mini-monorepo-node-ts-aws-starter

This a minimalistic monorepository template to develop projects in TypeScript and run it using Node.js on AWS. This template is built with the following things in mind:

1. It uses the standard Node.js library when possible and the API is stable enough :smiley:. For example, the default [Node.js tests runner and assertion library](https://nodejs.org/docs/latest-v22.x/api/test.html) has been used in the lambda templates.
2. It doesn't introduce unnecessary dependencies (neither dev no prod ones) to keep the dev setup and lambda builds fast :rocket:.
3. It doesn't aim to be a comprehensive monorepo solution but rather provides a useful base to develop maintainable (you may expect to find some tools for linting, testing, running projects locally there) TypeScript Node.js projects that are meant to be run on AWS.
4. It focuses on AWS lambda for now, but more AWS services could be added later.
5. After all, it's just a starting point for your repository, so you can tailor it to your needs.


## Using this repo as a template

To use the latest commit of the main branch as a base for a new repository you can do the following:

```sh
git clone https://github.com/okv/mini-monorepo-node-ts-aws-starter.git &&
cd mini-monorepo-node-ts-aws-starter/ &&
git checkout-index --prefix=../my-new-monorepo/ -a &&
cd ../my-new-monorepo &&
git init &&
rm -rf ../mini-monorepo-node-ts-aws-starter/ &&
echo " *** Now you can adjust any of the files, commit the changes and push it to your remote ***" &&
git status;
```

Alternatively, you can click "Use this template" button on GitHub :octocat:.


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

You can delete it using the following command:

```sh
> pnpm lambda:delete foo-lambda

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

This section describes how to use AWS CLI v2 to deploy and manage a locally created lambda to AWS. We will be using a separate AWS CLI settings profile that's called `sbox` in all the commands below. To avoid passing `--profile sbox` to all the commands we can do the following:

```sh
export AWS_PROFILE="sbox"
```

Before getting started, please make sure that the following prerequisites are met:

- [AWS CLI V2 is installed](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)(TLTR: `brew install awscli`)
- [Settings for the AWS CLI are configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)(TLTR: `aws configure`)

Let's create and build a lambda using this repo commands first:

```sh
pnpm lambda:create foo-lambda && pnpm --filter foo-lambda build
```

Then we're going to need a very basic role with an [AssumeRole action](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) for our lambda function:

```sh
aws iam create-role \
  --role-name basic-lambda-role \
  --assume-role-policy-document '{ "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Principal": { "Service": "lambda.amazonaws.com" }, "Action": "sts:AssumeRole" } ] }'
```

Let's remember the role's ARN from the command's output as we'll need it later:

```sh
export BASIC_LAMBDA_ROLE_ARN="YOUR ROLE's ARN GOES HERE"
```

By the way, many of the AWS CLI commands could be reversed redone by using their counterparts:

```sh
aws iam delete-role --role-name basic-lambda-role
```

Now we can deploy the function:

```sh
aws lambda create-function --function-name foo-lambda --runtime nodejs22.x --zip-file fileb://lambdas/foo-lambda/lambda.zip --handler index.handler --role "$BASIC_LAMBDA_ROLE_ARN"
```

And finally we can call the function:

```sh
> aws lambda invoke --function-name foo-lambda --cli-binary-format raw-in-base64-out --payload '{ "key": "value" }' /dev/stdout


{"statusCode":200,"body":"{\"hello\":\"Hello from Lambda!\",\"inputEvent\":{\"key\":\"value\"}}"}
    "StatusCode": 200,
    "ExecutedVersion": "$LATEST"
}
```

The function's code can be updating using the following command:

```sh
aws lambda update-function-code --function-name foo-lambda  --zip-file fileb://lambdas/foo-lambda/lambda.zip
```

Permissions could be granted to our lambda via the created IAM role. For example, to grant full access to the CloudWatch service to our lambda we can do the following:

```sh
aws iam attach-role-policy --role-name basic-lambda-role --policy-arn "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
```

You can find more information about the above AWS CLI commands in the AWS docs:

- [aws iam attach-role-policy](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/iam/attach-role-policy.html)
- [aws iam create-role](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/iam/create-role.html)
- [aws iam delete-role](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/iam/delete-role.html)
- [aws iam detach-role-policy](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/iam/detach-role-policy.html)
- [aws lambda create-function](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/lambda/create-function.html)
- [aws lambda delete-function](https://docs.aws.amazon.com/cli/latest/reference/lambda/delete-function.html)
- [aws lambda update-function-code](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/lambda/update-function-code.html)
