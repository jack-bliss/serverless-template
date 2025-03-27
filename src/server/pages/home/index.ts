import { Router } from 'express';
import { renderTemplate } from '../../services';
import template from '../template.html';
import { body } from './body';

export const home = Router();

home.get('/', (_req, res) => {
  const page = renderTemplate(template, {
    title: `jackbliss.co.uk`,
    body: body(),
    scripts: '<script src="/bundles/page.js"></script>',
    styles: '<link href="/bundles/splash.css" rel="stylesheet" />',
  });
  res.type('text/html').send(page);
});
