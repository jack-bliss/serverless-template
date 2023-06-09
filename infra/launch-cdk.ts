#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { CdkStack } from './cdk-stack';
import {
  US_EAST_CERTIFICATE_ARN,
  EU_WEST_CERTIFICATE_ARN,
  DOMAIN,
  HOSTED_ZONE_ID,
  PROJECT_NAME,
} from './app';
import { BaseRegion } from './base-region';

const app = new App();

new CdkStack(
  app,
  PROJECT_NAME,
  {
    hostedZoneId: HOSTED_ZONE_ID,
    usCertificateArn: US_EAST_CERTIFICATE_ARN,
    euCertificateArn: EU_WEST_CERTIFICATE_ARN,
    domain: DOMAIN,
  },
  {
    description: '',
    env: {
      region: BaseRegion,
    },
  },
);
