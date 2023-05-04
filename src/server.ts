import express from 'express';

export const app = express();

app.get('/baked-beans', (req, res) => res.send('my favourite food!'));
app.get('*', (req, res) => res.send('catch all route'));
