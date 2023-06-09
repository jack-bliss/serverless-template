import {
  aws_autoscaling as autoscaling,
  aws_elasticloadbalancingv2 as elb,
  aws_codedeploy as codedeploy,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export const createCodeDeployServerApp = ({
  scope,
  id,
  applicationName,
  deploymentGroupName,
  autoScalingGroup,
  loadBalancerTargetGroup,
  installAgent = false,
}: {
  scope: Construct;
  id: string;
  applicationName: string;
  deploymentGroupName: string;
  autoScalingGroup: autoscaling.IAutoScalingGroup;
  loadBalancerTargetGroup: elb.IApplicationTargetGroup;
  installAgent?: boolean;
}) => {
  const application = new codedeploy.ServerApplication(
    scope,
    `${id}_CodeDeployApplication`,
    {
      applicationName,
    },
  );
  const deploymentGroup = new codedeploy.ServerDeploymentGroup(
    scope,
    `${id}_DeploymentGroup`,
    {
      application,
      deploymentGroupName,
      autoScalingGroups: [autoScalingGroup],
      installAgent: Boolean(installAgent),
      loadBalancer: codedeploy.LoadBalancer.application(
        loadBalancerTargetGroup,
      ),
      deploymentConfig: codedeploy.ServerDeploymentConfig.HALF_AT_A_TIME,
    },
  );
  return {
    application,
    deploymentGroup,
  };
};
