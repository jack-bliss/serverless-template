#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { CdkStack } from './cdk-stack';
import { PROJECT_NAME } from './app';

const app = new App();

const stack = new CdkStack(app, PROJECT_NAME, {
  description: '',
  env: {
    region: 'eu-west-2',
  },
});
