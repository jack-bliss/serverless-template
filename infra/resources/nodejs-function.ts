import {
  Duration,
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export const createNodejsFunction = ({
  context,
  id,
  entry,
}: {
  context: Construct;
  id: string;
  entry: string;
}) => {
  const nodejsFunction = new lambda_nodejs.NodejsFunction(
    context,
    `${id}_Lambda`,
    {
      functionName: `${id}HttpService`,
      handler: 'handler',
      entry,
      memorySize: 1024,
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      timeout: Duration.seconds(300),
      bundling: {
        minify: true,
        externalModules: ['aws-sdk'],
      },
    },
  );

  // give it a URL
  const functionUrl = nodejsFunction.addFunctionUrl({
    authType: aws_lambda.FunctionUrlAuthType.NONE,
  });

  return {
    nodejsFunction,
    functionUrl,
  };
};
