import { Fn, App, Stack, StackProps } from 'aws-cdk-lib';
import { join } from 'path';
import { createNodejsFunction } from './resources/nodejs-function';
import { createCloudFront } from './resources/cloudfront';
import { createRoute53 } from './resources/route-53';
import { projectNameToSubdomain } from './helpers/project-name-to-subdomain';

const DOMAIN_VALUES = {
  domain: 'jackbliss.co.uk',
  certificateArn:
    'arn:aws:acm:us-east-1:244824501490:certificate/4ae7e253-1c65-4f76-b016-2d806ed948ee',
  hostedZoneId: 'Z09902761MK1RSNDXH3T0',
} as const satisfies Record<string, string>;

export class CdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // generate the target base URL for this app
    const appSubdomainName = projectNameToSubdomain(
      String(process.env.PROJECT_NAME),
    );
    const appDomainName = `${appSubdomainName}.${DOMAIN_VALUES.domain}`;

    // generate actual lambda function that implements server
    const { functionUrl } = createNodejsFunction({
      context: this,
      id,
      entry: join(__dirname, '../src/lambda.ts'),
    });

    // get domainName required by cloudfront
    const apiUrl = Fn.select(1, Fn.split('://', functionUrl.url));
    const domainName = Fn.select(0, Fn.split('/', apiUrl));

    // create cloudfront distribution
    const { cloudFrontWebDistribution } = createCloudFront({
      context: this,
      id,
      domainName,
      certificateArn: DOMAIN_VALUES.certificateArn,
      aliases: [appDomainName],
    });

    // create a-record for distro
    createRoute53({
      context: this,
      id,
      hostedZoneId: DOMAIN_VALUES.hostedZoneId,
      zoneName: DOMAIN_VALUES.domain,
      recordName: appDomainName,
      cloudFrontWebDistribution,
    });
  }
}

/*
AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
AWS_DEFAULT_REGION: 'eu-west-2'
*/
