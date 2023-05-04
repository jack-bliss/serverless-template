import express, { NextFunction, Request, Response } from 'express';

export const app = express();

app.get('/baked-beans', (req, res) => res.send('my favourite food!'));
app.get('/', (req, res) => res.send('home page'));
app.get('*', (req, res) => res.send('page not implemented'));
