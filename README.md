# Template

## Local dev

* Update [infra/app.ts](infra/app.ts) with relevant PROJECT_NAME, PORT, etc
* Use `npm run start` to get [src/server.ts](src/server.ts) to start listening

## Deploy

* Double check you've updated `PROJECT_NAME` in [infra/app.ts](infra/app.ts)
* Update any other values in [infra/app.ts](infra/app.ts) as necessary
* Use `npm run infra:deploy` to deploy the app to a lambda function
* Must have AWS CLI configured with correct credentials etc
* Uses [infra/cdk-stack.ts](infra/cdk-stack.ts) to generate stuff in AWS to power the app
* [infra/launch-cdk.ts](infra/launch-cdk.ts) is what actually invokes CDK to create all the infra defined in code