import {
  aws_codedeploy,
  aws_codepipeline_actions as actions,
  aws_s3,
  aws_codepipeline as codepipeline,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export const createCodePipeline = ({
  scope,
  id,
  sourceBucket,
  deploymentGroup,
}: {
  scope: Construct;
  id: string;
  sourceBucket: aws_s3.IBucket;
  deploymentGroup: aws_codedeploy.IServerDeploymentGroup;
}) => {
  const source = new codepipeline.Artifact();
  const codePipeline = new codepipeline.Pipeline(scope, `${id}_Pipeline`, {
    stages: [
      {
        stageName: 'GetSource',
        actions: [
          new actions.S3SourceAction({
            actionName: 'S3Source',
            bucket: sourceBucket,
            bucketKey: 'source.zip',
            output: source,
            trigger: actions.S3Trigger.EVENTS,
          }),
        ],
      },
      {
        stageName: 'Deploy',
        actions: [
          new actions.CodeDeployServerDeployAction({
            actionName: 'CodeDeploy',
            input: source,
            deploymentGroup,
          }),
        ],
      },
    ],
  });

  return { codePipeline };
};
