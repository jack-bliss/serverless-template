import {
  Fn,
  App,
  Stack,
  StackProps,
  CfnOutput,
  aws_s3,
  aws_s3_deployment,
} from 'aws-cdk-lib';
import { Source } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from 'path';
import { createNodejsFunction } from './resources/lambda';
import { createDistribution } from './resources/cloudfront';
import { createARecord } from './resources/route-53';
import { createBucket } from './resources/s3';
import { projectNameToSubdomain } from './helpers/project-name-to-subdomain';
import { BaseRegion } from './base-region';
import { createEc2Fleet } from './resources/ec2-fleet';
import { httpLambdaService } from './coordinated/http-lambda-service';
import { httpEc2Service } from './coordinated/http-ec2-service';

type RoutingProps = {
  usCertificateArn: string;
  euCertificateArn: string;
  domain: string;
  hostedZoneId: string;
};

export class CdkStack extends Stack {
  constructor(
    scope: App,
    stackName: string,
    routingProps: RoutingProps,
    props?: StackProps,
  ) {
    super(scope, stackName, props);

    // generate the target base URL for this app
    const appSubdomainName = projectNameToSubdomain(stackName);
    const appDomainName = `${appSubdomainName}.${routingProps.domain}`;

    const {
      bucket,
      distribution: lambdaDistribution,
      nodejsFunction,
    } = httpLambdaService({
      scope: this,
      stackName,
      id: 'HttpService',
      appDomainName: `lambda-${appDomainName}`,
      hostedZoneId: routingProps.hostedZoneId,
      certificateArn: routingProps.usCertificateArn,
      domain: routingProps.domain,
    });

    const {
      autoScalingGroup,
      distribution: serverDistribution,
      launchBucketName,
    } = httpEc2Service({
      scope: this,
      id: 'TestFleet',
      appDomainName: `server-${appDomainName}`,
      hostedZoneId: routingProps.hostedZoneId,
      usCertificateArn: routingProps.usCertificateArn,
      stackName,
      domain: routingProps.domain,
      assetBucket: bucket,
    });

    new CfnOutput(this, `AssetsBucketName`, { value: bucket.bucketName });
    new CfnOutput(this, `LambdaPublicUrl`, {
      value: `https://lambda-${appDomainName}`,
    });
    new CfnOutput(this, `ServerPublicUrl`, {
      value: `https://server-${appDomainName}`,
    });
    new CfnOutput(this, `LambdaDistributionID`, {
      value: lambdaDistribution.distributionId,
    });
    new CfnOutput(this, `ServerDistributionID`, {
      value: serverDistribution.distributionId,
    });
    new CfnOutput(this, `LambdaLogGroupUrl`, {
      value: `https://eu-west-2.console.aws.amazon.com/cloudwatch/home?region=${BaseRegion}#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${nodejsFunction.functionName}`,
    });
    new CfnOutput(this, `AutoScalingGroupName`, {
      value: autoScalingGroup.autoScalingGroupName,
    });
    new CfnOutput(this, `TestFleetLaunchBucketName`, {
      value: launchBucketName,
    });
  }
}

/*
AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
AWS_DEFAULT_REGION: 'eu-west-2'
*/
