import { Router } from 'express';
import { renderTemplate } from '../../services';
import template from '../template.html';

export const notFound = Router();

notFound.get('*', (_req, res) => {
  const page = renderTemplate(template, {
    title: '404',
    body: 'File not found!',
    styles: '<link rel="stylesheet" href="/bundles/splash.css" />',
  });
  res.type('text/html').status(404).send(page);
});
