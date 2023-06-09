import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export const createVpc = ({
  scope,
  id,
}: {
  scope: Construct;
  id: string;
}) => {
  return new ec2.Vpc(scope, `${id}_VPC`, {
    ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
    availabilityZones: ['eu-west-2a', 'eu-west-2b', 'eu-west-2c'],
    subnetConfiguration: [
      {
        subnetType: ec2.SubnetType.PUBLIC,
        name: 'PublicSubnet',
      },
    ],
  });
};
