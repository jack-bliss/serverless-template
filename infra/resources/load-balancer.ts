import {
  Duration,
  aws_elasticloadbalancingv2 as elbv2,
} from 'aws-cdk-lib';
import { ISecurityGroup, IVpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

type CreateLoadBalancerProps = {
  scope: Construct;
  id: string;
  vpc: IVpc;
  targets: elbv2.IApplicationLoadBalancerTarget[];
};

export const createLoadBalancer = ({
  scope,
  id,
  vpc,
  targets,
}: CreateLoadBalancerProps) => {
  const applicationLoadBalancer = new elbv2.ApplicationLoadBalancer(
    scope,
    `${id}_LoadBalancer`,
    {
      vpc,
      internetFacing: true,
    },
  );
  const listener = applicationLoadBalancer.addListener(
    `${id}_ALB_Listener`,
    {
      port: 80,
      open: true,
    },
  );
  const loadBalancerTargetGroup = listener.addTargets(`${id}_Ec2Fleet`, {
    port: 3000,
    targets,
    protocol: elbv2.ApplicationProtocol.HTTP,
    deregistrationDelay: Duration.seconds(10),
    healthCheck: {
      interval: Duration.seconds(10),
      healthyThresholdCount: 2,
    },
  });
  return {
    applicationLoadBalancer,
    listener,
    loadBalancerTargetGroup,
  };
};
