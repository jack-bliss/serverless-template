import { aws_ec2 as ec2, aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PORT } from '../app';

export const createLaunchTemplate = ({
  scope,
  id,
  vpc,
}: {
  scope: Construct;
  id: string;
  vpc: ec2.IVpc;
}) => {
  // needs a role for interacting with other services
  const role = new iam.Role(scope, `${id}_Ec2FleetRole`, {
    assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  });
  const securityGroup = new ec2.SecurityGroup(
    scope,
    `${id}_SecurityGroup`,
    {
      vpc,
    },
  );
  // allow SSHing into box
  securityGroup.addIngressRule(
    ec2.Peer.anyIpv4(),
    ec2.Port.tcp(22),
    'SSH',
  );
  // user data for installing node
  const installNode = ec2.UserData.forLinux();
  installNode.addCommands(`export HOME=/home/ec2-user
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16`);
  // user data for installing CodeDeploy agent
  const installCodeDeployAgent = ec2.UserData.forLinux();
  installCodeDeployAgent.addCommands(`export HOME=/home/ec2-user
sudo yum -y install ruby
sudo yum -y install wget
cd /home/ec2-user
wget https://aws-codedeploy-eu-west-2.s3.eu-west-2.amazonaws.com/latest/install
sudo chmod +x ./install
sudo ./install auto
`);
  const userData = new ec2.MultipartUserData();
  userData.addPart(ec2.MultipartBody.fromUserData(installNode));
  userData.addPart(ec2.MultipartBody.fromUserData(installCodeDeployAgent));
  // create a minimal launch template
  const launchTemplate = new ec2.LaunchTemplate(
    scope,
    `${id}_LaunchTemplate`,
    {
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.NANO,
      ),
      // use default SSH key
      keyName: 'Default',
      role,
      securityGroup,
      userData,
    },
  );
  return {
    launchTemplate,
    securityGroup,
  };
};
