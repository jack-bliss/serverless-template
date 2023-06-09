import {
  aws_ec2 as ec2,
  aws_autoscaling as autoscaling,
  aws_iam as iam,
  aws_cloudtrail as cloudtrail,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createBucket } from './s3';
import { IBucket } from 'aws-cdk-lib/aws-s3';

export const createEc2Fleet = ({
  scope,
  id,
  vpc,
  launchTemplate,
  assetBucket,
  launchBucketName,
  autoScalingGroupName,
}: {
  scope: Construct;
  id: string;
  launchBucketName: string;
  vpc: ec2.IVpc;
  launchTemplate: ec2.LaunchTemplate;
  assetBucket?: IBucket;
  autoScalingGroupName: string;
}) => {
  // verify that the provided template has a role we can update
  if (!launchTemplate.role) {
    throw new Error(
      `Cannot create an EC2 fleet from a launch template with no role`,
    );
  }

  // if an asset bucket was provided, grant access
  if (assetBucket) {
    launchTemplate.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject', 's3:PutObject'],
        resources: [`${assetBucket.bucketArn}/*`],
      }),
    );
    launchTemplate.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['s3:ListBucket'],
        resources: [assetBucket.bucketArn],
      }),
    );
  }

  // bucket that will store the startup code
  const launchBucket = createBucket({
    scope,
    id: `${id}_LaunchBucket`,
    bucketName: launchBucketName,
    versioned: true,
  });

  const trail = new cloudtrail.Trail(
    scope,
    `${id}_LaunchAsset_CloudTrail`,
  );
  trail.addS3EventSelector(
    [
      {
        bucket: launchBucket.bucket,
        objectPrefix: 'source.zip',
      },
    ],
    {
      readWriteType: cloudtrail.ReadWriteType.WRITE_ONLY,
    },
  );

  // allow the instances to read from the bucket
  launchTemplate.role.addToPrincipalPolicy(
    new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [`${launchBucket.bucket.bucketArn}/*`],
    }),
  );

  // create the group itself using the vpc and launch template
  const autoScalingGroup = new autoscaling.AutoScalingGroup(
    scope,
    `${id}_AutoscalingGroup`,
    {
      vpc,
      launchTemplate,
      autoScalingGroupName,
      minCapacity: 3,
      maxCapacity: 4,
    },
  );

  // some sample scaling rules
  autoScalingGroup.scaleOnSchedule('ScaleUpInMorning', {
    schedule: autoscaling.Schedule.cron({ hour: '16', minute: '0' }),
    minCapacity: 4,
    maxCapacity: 4,
  });

  autoScalingGroup.scaleOnSchedule('ScaleDownAtNight', {
    schedule: autoscaling.Schedule.cron({ hour: '17', minute: '0' }),
    minCapacity: 3,
    maxCapacity: 3,
  });

  return {
    autoScalingGroup,
    launchBucket,
    trail,
  };
};
