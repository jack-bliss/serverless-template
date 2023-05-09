import { NextFunction, Request, Response, Router } from 'express';
import { getContentfulEntriesByField } from '../../services/contentful';
import { BlogPost } from '../../services/contentful/types';
import { renderContentfulBlogPost } from './render-contentful-blog-post';
import { getAsset } from '../../services';

export const blog = Router();

blog.get(
  '/:post',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { raw, html } = await renderContentfulBlogPost(
        req.params.post,
      );
      if (req.query.raw === 'true') {
        res.type('application/json').send(raw);
        return;
      }
      res.type('text/html').send(html);
    } catch (error) {
      next(error);
    }
  },
);
