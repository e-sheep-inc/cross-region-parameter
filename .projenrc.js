const { typescript, TextFile, javascript } = require('projen');

const nodejsVersion = '22.16.0';

const project = new typescript.TypeScriptProject({

  // Metadata
  name: '@e-sheep-inc/cross-region-parameter',
  description: 'Store AWS SSM Parameter Store Parameters into another AWS Region with AWS CDK',
  repositoryUrl: 'https://github.com/e-sheep-inc/cross-region-parameter.git',
  authorName: 'Electric Sheep Inc.',
  authorOrganization: true,
  authorUrl: 'https://github.com/e-sheep-inc',
  license: 'Apache-2.0',
  keywords: ['cdk', 'aws-cdk', 'awscdk', 'aws', 'cross-region', 'ssm', 'parameter'],

  packageManager: javascript.NodePackageManager.NPM,
  minNodeVersion: nodejsVersion,
  defaultReleaseBranch: 'main',

  // リリース・公開なし
  release: false,
  depsUpgrade: false,

  // Dependencies
  peerDeps: ['aws-cdk-lib@^2.244.0', 'constructs@^10.5.0'],
  devDeps: ['aws-cdk-lib@2.244.0', 'constructs@10.5.0', '@aws-sdk/client-ssm', '@aws-sdk/client-sts'],
  bundledDeps: ['change-case'],

  typescriptVersion: '^5',
  tsconfig: {
    compilerOptions: {
      lib: ['es2020'],
      target: 'es2020',
    },
  },

  srcdir: 'src',
  testdir: 'test',
  libdir: 'lib',

  jestOptions: {
    jestVersion: '^29',
  },

  // Gitignore
  gitignore: [
    '.DS_Store',
    '/examples/**/cdk.context.json',
    '/examples/**/node_modules',
    '/examples/**/cdk.out',
    '/examples/**/.git',
  ],

});

// git-based install 時に tsc コンパイルを実行
project.addTask('prepare', {
  description: 'Compile TypeScript for git-based installs',
  steps: [{ spawn: 'compile' }],
});

new TextFile(project, '.nvmrc', {
  lines: [nodejsVersion],
});

project.addPackageIgnore('/examples/');
project.gitignore.addPatterns('/test/cdk.out.e2e.*/');

project.synth();
