import {
  aws_s3 as s3,
  RemovalPolicy,
  aws_s3_deployment as s3_deployment,
} from 'aws-cdk-lib';
import { ISource } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

type CreateBucketProps = {
  scope: Construct;
  id: string;
  bucketName: string;
  versioned?: boolean;
  sources?: ISource[];
};

export function createBucket(
  props: Omit<CreateBucketProps, 'sources'> & {
    sources: ISource[];
  },
): {
  bucket: s3.Bucket;
  deployment: s3_deployment.BucketDeployment;
};

export function createBucket(props: Omit<CreateBucketProps, 'sources'>): {
  bucket: s3.Bucket;
};

export function createBucket({
  scope,
  id,
  bucketName,
  sources,
  versioned = false,
}: CreateBucketProps) {
  const bucket = new s3.Bucket(scope, `${id}_Bucket`, {
    bucketName,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    enforceSSL: true,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    versioned: Boolean(versioned),
  });

  const deployment =
    typeof sources === 'undefined'
      ? undefined
      : new s3_deployment.BucketDeployment(
          scope,
          `${id}_BucketDeployment`,
          {
            destinationBucket: bucket,
            sources,
            prune: false,
          },
        );

  return {
    bucket,
    deployment,
  };
}
