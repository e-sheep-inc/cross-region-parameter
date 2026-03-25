import * as crypto from 'crypto';
import { execSync } from 'child_process';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as AWS from 'aws-sdk';
import { CrossRegionParameter } from '../src';

const RUN_E2E = process.env.RUN_E2E === 'true';

const UNIQUE_ID = crypto.randomBytes(4).toString('hex');
const STACK_NAME = `E2eTestCrParam-${UNIQUE_ID}`;
const PARAM_NAME = `/e2e-test/${UNIQUE_ID}/message`;
const PARAM_VALUE = `e2e-test-value-${UNIQUE_ID}`;
const PARAM_DESCRIPTION = 'E2E test parameter for cross-region-parameter';
const SOURCE_REGION = 'us-east-1';
const TARGET_REGION = 'eu-west-1';

/**
 * Resolve AWS credentials from the current environment (supports SSO profiles).
 * Uses `aws configure export-credentials` to get temporary credentials,
 * then injects them into process.env so both AWS SDK v2 and CDK CLI can use them.
 */
function loadCredentials(): void {
  try {
    const output = execSync('aws configure export-credentials --format env', {
      encoding: 'utf-8',
      timeout: 30_000,
    });
    for (const line of output.trim().split('\n')) {
      const match = line.match(/^export (\w+)=(.+)$/);
      if (match) {
        process.env[match[1]] = match[2];
      }
    }
    // Update SDK v2 config with exported credentials
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    });
  } catch (err) {
    throw new Error(`Failed to load AWS credentials. Ensure AWS CLI is configured.\n${err}`);
  }
}

(RUN_E2E ? describe : describe.skip)('E2E: CrossRegionParameter', () => {
  const cdkOutDir = path.join(__dirname, `cdk.out.e2e.${UNIQUE_ID}`);

  beforeAll(async () => {
    loadCredentials();

    // Verify AWS credentials
    const sts = new AWS.STS();
    const identity = await sts.getCallerIdentity().promise();
    const accountId = identity.Account!;
    console.log(`AWS Account: ${accountId}`);
    console.log(`Stack: ${STACK_NAME}`);
    console.log(`Parameter: ${PARAM_NAME}`);

    // Synthesize CDK app
    const app = new cdk.App({ outdir: cdkOutDir });
    const stack = new cdk.Stack(app, STACK_NAME, {
      env: { region: SOURCE_REGION, account: accountId },
    });

    new CrossRegionParameter(stack, 'E2eParam', {
      region: TARGET_REGION,
      name: PARAM_NAME,
      description: PARAM_DESCRIPTION,
      value: PARAM_VALUE,
    });

    app.synth();

    // Deploy
    execSync(
      `npx cdk deploy ${STACK_NAME} --app "${cdkOutDir}" --require-approval never`,
      {
        stdio: 'inherit',
        env: { ...process.env },
        timeout: 5 * 60 * 1000,
      },
    );
  }, 10 * 60 * 1000);

  afterAll(() => {
    try {
      execSync(
        `npx cdk destroy ${STACK_NAME} --app "${cdkOutDir}" --force`,
        {
          stdio: 'inherit',
          env: { ...process.env },
          timeout: 5 * 60 * 1000,
        },
      );
    } catch (err) {
      console.error(`WARNING: Failed to destroy stack ${STACK_NAME}. Manual cleanup may be required.`, err);
    }
  }, 10 * 60 * 1000);

  test('parameter exists in target region with correct value', async () => {
    const ssm = new AWS.SSM({ region: TARGET_REGION });
    const result = await ssm.getParameter({ Name: PARAM_NAME }).promise();

    expect(result.Parameter).toBeDefined();
    expect(result.Parameter!.Name).toBe(PARAM_NAME);
    expect(result.Parameter!.Value).toBe(PARAM_VALUE);
    expect(result.Parameter!.Type).toBe('String');
  });

  test('parameter does NOT exist in source region', async () => {
    const ssm = new AWS.SSM({ region: SOURCE_REGION });

    await expect(
      ssm.getParameter({ Name: PARAM_NAME }).promise(),
    ).rejects.toThrow('ParameterNotFound');
  });
});
