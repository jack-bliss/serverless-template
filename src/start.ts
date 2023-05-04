import { app } from './server';

const PORT = parseInt(process.env.PORT || '0', 10) || 9000;

app.listen(PORT, () =>
  console.info(`${process.env.PROJECT_NAME} listening on port ${PORT}`),
);
