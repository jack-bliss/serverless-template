import {
  aws_cloudfront_origins as origins,
  aws_cloudfront as cloudfront,
  aws_s3 as s3,
} from 'aws-cdk-lib';
import { createEc2Fleet } from '../resources/ec2-fleet';
import { createLaunchTemplate } from '../resources/launch-template';
import { createVpc } from '../resources/vpc';
import { Construct } from 'constructs';
import { createLoadBalancer } from '../resources/load-balancer';
import { createDistribution } from '../resources/cloudfront';
import { createARecord } from '../resources/route-53';
import { createCodeDeployServerApp } from '../resources/code-deploy';
import { createCodePipeline } from '../resources/code-pipeline';

export function httpEc2Service({
  scope,
  id,
  assetBucket,
  appDomainName,
  usCertificateArn,
  hostedZoneId,
  domain,
  stackName,
}: {
  scope: Construct;
  id: string;
  assetBucket?: s3.IBucket;
  appDomainName: string;
  usCertificateArn: string;
  hostedZoneId: string;
  domain: string;
  stackName: string;
}) {
  const vpc = createVpc({
    scope,
    id,
  });
  const { launchTemplate, securityGroup } = createLaunchTemplate({
    scope,
    id,
    vpc,
  });
  const launchBucketName = `${appDomainName}.${id.toLowerCase()}.launch`;
  const { autoScalingGroup, launchBucket } = createEc2Fleet({
    scope,
    id,
    vpc,
    launchTemplate,
    assetBucket,
    launchBucketName,
    autoScalingGroupName: `${stackName}_${id}`,
  });

  const { applicationLoadBalancer, loadBalancerTargetGroup } =
    createLoadBalancer({
      scope,
      id,
      vpc,
      targets: [autoScalingGroup],
    });

  const { deploymentGroup } = createCodeDeployServerApp({
    scope,
    id,
    applicationName: `${stackName}_${id}`,
    deploymentGroupName: `${stackName}_${id}_DeploymentGroup`,
    autoScalingGroup,
    loadBalancerTargetGroup,
  });

  const { codePipeline } = createCodePipeline({
    scope,
    id,
    sourceBucket: launchBucket.bucket,
    deploymentGroup,
  });

  const { distribution } = createDistribution({
    scope,
    id,
    origin: new origins.LoadBalancerV2Origin(applicationLoadBalancer, {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
    }),
    certificateArn: usCertificateArn,
    aliases: [appDomainName],
    stackName,
  });
  const aRecord = createARecord({
    scope,
    id,
    hostedZoneId,
    zoneName: domain,
    recordName: appDomainName,
    distribution: distribution,
  });

  return {
    vpc,
    launchTemplate,
    autoScalingGroup,
    securityGroup,
    applicationLoadBalancer,
    distribution,
    aRecord,
    deploymentGroup,
    launchBucket,
    codePipeline,
    launchBucketName,
  };
}
