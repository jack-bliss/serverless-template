import { Source } from 'aws-cdk-lib/aws-s3-deployment';
import { createBucket } from '../resources/s3';
import { Construct } from 'constructs';
import { createNodejsFunction } from '../resources/lambda';
import { join } from 'path';
import { Fn, aws_cloudfront_origins as origins } from 'aws-cdk-lib';
import { createDistribution } from '../resources/cloudfront';
import { createARecord } from '../resources/route-53';

export const httpLambdaService = ({
  scope,
  id,
  appDomainName,
  stackName,
  certificateArn,
  hostedZoneId,
  domain,
}: {
  scope: Construct;
  id: string;
  appDomainName: string;
  stackName: string;
  certificateArn: string;
  hostedZoneId: string;
  domain: string;
}) => {
  // create storage bucket that can be read from and written to
  const { bucket } = createBucket({
    scope,
    id,
    bucketName: `${appDomainName}.assets`,
    sources: [Source.asset('./bucket')],
  });

  // create actual lambda function that implements server (HttpService)
  const { nodejsFunction, functionUrl } = createNodejsFunction({
    scope,
    id,
    stackName,
    entry: join(__dirname, '../../src/server/lambda.ts'),
    bucket,
    environment: {
      NODE_ENV: 'production',
      BUCKET: bucket.bucketName,
    },
  });

  // get domainName required by cloudfront
  const functionApiUrl = Fn.select(1, Fn.split('://', functionUrl.url));
  const functionDomainName = Fn.select(0, Fn.split('/', functionApiUrl));

  // create cloudfront distribution
  const { distribution } = createDistribution({
    scope,
    id,
    origin: new origins.HttpOrigin(functionDomainName),
    certificateArn,
    aliases: [appDomainName],
    stackName,
  });

  // create a-record cloudfront distribution
  const { aRecord } = createARecord({
    scope,
    id,
    hostedZoneId: hostedZoneId,
    zoneName: domain,
    recordName: appDomainName,
    distribution: distribution,
  });

  return {
    bucket,
    nodejsFunction,
    functionUrl,
    distribution,
    aRecord,
  };
};
