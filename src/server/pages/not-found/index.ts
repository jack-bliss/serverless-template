import { renderTemplate } from '../../services';
import template from '../template.html';
import { Router } from 'express';

export const notFound = Router();

notFound.get('*', (req, res) => {
  const page = renderTemplate(template, {
    title: 'Hello, world!',
    body: 'File not found!',
    styles: '<link href="styles.css" rel="stylesheet" />',
  });
  res.send(page);
});
