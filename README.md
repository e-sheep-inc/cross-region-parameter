<div align="center">
	<br/>
	<br/>
  <h1>
	<img height="140" src="assets/alma-cdk-cross-region-parameter.svg" alt="Cross-Region Parameter" />
  <br/>
  <br/>
  </h1>

  ```sh
  npm i -D @e-sheep-inc/cross-region-parameter
  ```

  <div align="left">

  Store [AWS SSM Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) Parameters into another AWS Region with AWS CDK.

  </div>
  <br/>
</div>


<br/>

<div align="center">

![diagram](assets/diagram.svg)

</div>

<br/>

## Setup

This package is published to [GitHub Packages](https://github.com/e-sheep-inc/cross-region-parameter/packages). Add the following to your project's `.npmrc`:

```
@e-sheep-inc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Set the `GITHUB_TOKEN` environment variable to a [personal access token](https://github.com/settings/tokens) with `read:packages` scope, then install:

```sh
npm i -D @e-sheep-inc/cross-region-parameter
```

<br/>

## Why this fork?

AWS CDK's built-in cross-region parameter support (e.g. `aws_ssm.StringParameter` with cross-region references) internally generates Lambda functions via Custom Resources. This conflicts with SAM (Serverless Application Model) workflows, where SAM needs full control over Lambda function definitions and packaging. This construct uses `AwsCustomResource` with direct SDK calls instead, making it compatible with SAM-based projects.


<br/>

## Getting Started

```ts
import { CrossRegionParameter } from "@e-sheep-inc/cross-region-parameter";

new CrossRegionParameter(this, 'SayHiToSweden', {
  region: 'eu-north-1',
  name: '/parameter/path/message',
  description: 'Some message for the Swedes',
  value: 'Hej då!',
});
```

> Forked from [alma-cdk/cross-region-parameter](https://github.com/alma-cdk/cross-region-parameter) (Apache-2.0)
