import { Fn, App, Stack, StackProps, aws_iam as iam } from 'aws-cdk-lib';
import { join } from 'path';
import { createNodejsFunction } from './resources/nodejs-function';
import { createCloudFront } from './resources/cloudfront';
import { createRoute53 } from './resources/route-53';
import { projectNameToSubdomain } from './helpers/project-name-to-subdomain';
import { createS3 } from './resources/s3';
import { Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as esbuild from 'esbuild';
import { exec } from 'child_process';
import { promisify } from 'util';

type RoutingProps = {
  certificateArn: string;
  domain: string;
  hostedZoneId: string;
};

export class CdkStack extends Stack {
  constructor(
    scope: App,
    id: string,
    routingProps: RoutingProps,
    props?: StackProps,
  ) {
    super(scope, id, props);

    // generate the target base URL for this app
    const appSubdomainName = projectNameToSubdomain(id);
    const appDomainName = `${appSubdomainName}.${routingProps.domain}`;

    const { bucket } = createS3({
      context: this,
      id,
      appDomainName,
      sources: [Source.asset('./bucket')],
    });

    // generate actual lambda function that implements server
    const { nodejsFunction, functionUrl } = createNodejsFunction({
      context: this,
      id,
      entry: join(__dirname, '../src/server/lambda.ts'),
      bucket,
    });

    // get domainName required by cloudfront
    const functionApiUrl = Fn.select(1, Fn.split('://', functionUrl.url));
    const functionDomainName = Fn.select(0, Fn.split('/', functionApiUrl));

    // create cloudfront distribution
    const { cloudFrontWebDistribution } = createCloudFront({
      context: this,
      id,
      domainName: functionDomainName,
      certificateArn: routingProps.certificateArn,
      aliases: [appDomainName],
    });

    // create a-record for distro
    createRoute53({
      context: this,
      id,
      hostedZoneId: routingProps.hostedZoneId,
      zoneName: routingProps.domain,
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
