# Template

## Local dev

* Set `PROJECT_NAME` (and optionally `PORT`) in [environment.sh](environment.sh)
* Use `npm run start` to get [src/server.ts](src/server.ts) to start listening

## Deploy

* Double check you've updated `PROJECT_NAME` in [environment.sh](environment.sh)
* Update `DOMAIN_VALUES` in [infra/cdk-stack.ts](infra/cdk-stack.ts) as necessary
* Use `npm run infra-deploy` to deploy the app to a lambda function
* Must have AWS CLI configured with correct credentials etc
* Uses [infra/cdk-stack.ts](infra/cdk-stack.ts) to generate stuff in AWS to power the app
* [infra/launch-cdk.ts](infra/launch-cdk.ts) is what actually invokes CDK to create all the infra defined in code