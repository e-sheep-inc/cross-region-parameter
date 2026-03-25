# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AWS CDK construct library (`@e-sheep-inc/cross-region-parameter`) that stores SSM Parameter Store parameters into a different AWS region using `AwsCustomResource`. Forked from [alma-cdk/cross-region-parameter](https://github.com/alma-cdk/cross-region-parameter). Built with [projen](https://projen.io/) as a `TypeScriptProject` — project configuration lives in `.projenrc.js` and most config files are generated (do not edit them directly; edit `.projenrc.js` and run `npx projen`).

Consumers install directly from GitHub: `npm i -D github:e-sheep-inc/cross-region-parameter`. The `prepare` script runs `tsc` automatically on install.

## Build & Test Commands

```bash
npx projen build      # Full build: compile + lint + test + package
npx projen compile    # TypeScript compilation via tsc
npx projen test       # Run Jest tests with coverage
npx projen test:watch # Run tests in watch mode
npx projen eslint     # Lint only
```

Run a single test:
```bash
npx jest test/parameter.test.ts
npx jest -t "Basic usage"   # by test name
```

E2E test (actually deploys to AWS):
```bash
RUN_E2E=true AWS_PROFILE=<profile> NODE_OPTIONS="--experimental-vm-modules" npx jest test/parameter.e2e.test.ts --no-coverage --testTimeout=600000
```

## CI/CD

- **build.yml** — Runs `npx projen build` on PRs
- **pull-request-lint.yml** — Validates PR title format
- **Dependabot** — Weekly PRs for npm and GitHub Actions updates

## Architecture

The library exports a single construct: `CrossRegionParameter` (src/parameter.ts).

- **`CrossRegionParameter`** — CDK Construct that uses `AwsCustomResource` to call the SSM SDK (`putParameter`/`deleteParameter`) in a target region. It creates an IAM Role + Policy scoped to the specific parameter ARN in the target region, and wires up onCreate/onUpdate/onDelete lifecycle hooks.
- **`CrossRegionParameterProps`** (src/props.ts) — Input properties including target `region`, parameter `name`, `value`, and optional SSM settings (tier, type, KMS key, tags, policies).
- **Validation** — The construct errors (via CDK Annotations) if the target region matches the current stack's region.

## Key Constraints

- `change-case` is a **bundled dependency** (shipped with the package).
- Peer dependencies: `aws-cdk-lib ^2.244.0`, `constructs ^10.5.0`.
- Node >= 22.16.0.
