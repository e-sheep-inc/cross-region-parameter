<div align="center">
	<br/>
	<br/>
  <h1>
	<img height="140" src="assets/alma-cdk-cross-region-parameter.svg" alt="Cross-Region Parameter" />
  <br/>
  <br/>
  </h1>

  ```sh
  npm i -D github:e-sheep-inc/cross-region-parameter
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

Install directly from GitHub:

```sh
npm i -D github:e-sheep-inc/cross-region-parameter
```

Or pin to a specific commit:

```sh
npm i -D github:e-sheep-inc/cross-region-parameter#abc1234
```

TypeScript is compiled automatically via the `prepare` script on install.

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
