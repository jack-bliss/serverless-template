import express from 'express';
import { handleError } from './middleware/handle-error';
import { serveAssets } from './middleware/serve-assets';
import { blog } from './pages/blog';
import { home } from './pages/home';
import { notFound } from './pages/not-found';
import { getContentfulEntry } from './services/contentful';
import { saveAsset } from './services/save-asset';

export const app = express();

app.use(serveAssets);

app.post('/write', async (_req, res) => {
  await saveAsset('data.json', Buffer.from('{"hello": "world"}'));
  res.sendStatus(201);
});

app.get('/content', async (_req, res) => {
  const result = await getContentfulEntry('2MDTJ4Xo0zdAxw9Z1Xf1o1');
  res.send(result);
});

app.use('/blog', blog);

app.use('/', home);
app.use('*', notFound);

app.use(handleError);
