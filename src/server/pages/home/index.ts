import { renderTemplate } from '../../services';
import template from '../template.html';
import { Router } from 'express';
import { body } from './body';

export const home = Router();

home.get('/', (req, res) => {
  const page = renderTemplate(template, {
    title: 'Hello, world!',
    body: body(),
    scripts: '<script src="page.js"></script>',
    styles: '<link href="styles.css" rel="stylesheet" />',
  });
  res.send(page);
});
