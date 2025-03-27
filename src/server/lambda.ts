import serverlessExpress from '@codegenie/serverless-express';
import { app } from './router';

export const handler: unknown = serverlessExpress({
  app,
});
