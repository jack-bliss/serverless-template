import { renderTemplate } from '../../services';
import template from '../template.html';
import { Router } from 'express';
import { body } from './body';

export const home = Router();

home.get('/', (req, res) => {
  const bodyResult = body();
  console.log({ bodyResult });
  const page = renderTemplate(template, {
    title: 'Hello, world!',
    body: bodyResult,
    scripts: '<script src="page.js"></script>',
    styles: '<link href="styles.css" rel="stylesheet" />',
  });
  res.send(page);
});
