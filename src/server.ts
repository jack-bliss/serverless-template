import express from 'express';
import splash from './splash.html';

export const app = express();

app.get('/baked-beans', (req, res) => res.send('my favourite food!'));
app.get('*', (req, res) => res.send(splash));
