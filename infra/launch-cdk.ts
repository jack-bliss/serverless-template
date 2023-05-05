#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { CdkStack } from './cdk-stack';

const projectName = process.env.PROJECT_NAME;
if (!projectName) {
  throw new Error(`Cannot deploy stack without PROJECT_NAME env variable!`);
}

const app = new App();

const stack = new CdkStack(app, projectName, {
  description: '',
  env: {
    region: 'eu-west-2',
  },
});
