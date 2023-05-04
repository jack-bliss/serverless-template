import {
  App,
  Stack,
  StackProps,
  Duration,
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda,
} from 'aws-cdk-lib';
import { join } from 'path';

export class CdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda_nodejs.NodejsFunction(
      this,
      `${id}Lambda`,
      {
        functionName: `${id}_lambda`,
        handler: 'handler',
        entry: join(__dirname, '../src/lambda.ts'),
        memorySize: 1024,
        runtime: lambda.Runtime.NODEJS_18_X,
        timeout: Duration.seconds(300),
        bundling: {
          minify: false,
          externalModules: ['aws-sdk'],
        },
      },
    );

    lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
  }
}

/*
AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
AWS_DEFAULT_REGION: 'eu-west-2'
*/
