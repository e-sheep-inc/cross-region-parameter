const { awscdk, TextFile, javascript, release } = require('projen');

const nodejsVersion = '18.18.0';

const project = new awscdk.AwsCdkConstructLibrary({

  // Metadata
  stability: 'experimental',
  authorName: 'Electric Sheep Inc.',
  authorOrganization: true,
  authorAddress: 'https://github.com/e-sheep-inc',
  name: '@e-sheep-inc/cross-region-parameter',
  description: 'Store AWS SSM Parameter Store Parameters into another AWS Region with AWS CDK',
  repositoryUrl: 'https://github.com/e-sheep-inc/cross-region-parameter.git',
  keywords: ['cdk', 'aws-cdk', 'awscdk', 'aws', 'cross-region', 'ssm', 'parameter'],

  // Publish configuration
  defaultReleaseBranch: 'main',
  packageManager: javascript.NodePackageManager.NPM,
  npmAccess: javascript.NpmAccess.PUBLIC,
  releaseToNpm: false,
  releaseTrigger: release.ReleaseTrigger.manual(),
  // python: {
  //   distName: 'e-sheep-inc.cross-region-parameter',
  //   module: 'e_sheep_inc.cross_region_parameter',
  // },
  // publishToGo: {
  //   moduleName: 'github.com/e-sheep-inc/cross-region-parameter-go',
  // },
  majorVersion: 0,
  releaseBranches: {
    beta: {
      majorVersion: 1,
      prerelease: 'beta',
      npmDistTag: 'beta',
    },
  },
  // Dependencies
  minNodeVersion: nodejsVersion,
  cdkVersion: '2.200.0',
  constructsVersion: '10.0.0',
  peerDeps: [
    'constructs',
    'aws-cdk-lib',
  ],
  devDeps: [
    'constructs',
    'aws-cdk-lib',
    'aws-sdk',
    '@types/prettier@2.6.0',
    '@types/change-case',
  ],
  bundledDeps: [
    'aws-sdk',
    'change-case',
  ],

  // Gitignore
  gitignore: [
    '.DS_Store',
    '/examples/**/cdk.context.json',
    '/examples/**/node_modules',
    '/examples/**/cdk.out',
    '/examples/**/.git',
    '/test/cdk.out.e2e.*',
  ],


});

new TextFile(project, '.nvmrc', {
  lines: [nodejsVersion],
});

project.addPackageIgnore('/examples/');


project.synth();
