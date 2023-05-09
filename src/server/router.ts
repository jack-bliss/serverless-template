import express from 'express';
import { serveAssets } from './middleware/serve-assets';
import { handleError } from './middleware/handle-error';
import { home } from './pages/home';
import { notFound } from './pages/not-found';
import { saveAsset } from './services/save-asset';
import { getContentfulEntry } from './services/contentful';
import { blog } from './pages/blog';

export const app = express();

app.use(serveAssets);

app.post('/write', async (req, res) => {
  await saveAsset('data.json', Buffer.from('{"hello": "world"}'));
  return res.sendStatus(201);
});

app.get('/content', async (req, res) => {
  const result = await getContentfulEntry('2MDTJ4Xo0zdAxw9Z1Xf1o1');
  return res.send(result);
});

app.use('/blog', blog);

app.use('/', home);
app.use('*', notFound);

app.use(handleError);
