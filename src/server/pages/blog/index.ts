import { NextFunction, Request, Response, Router } from 'express';
import { renderContentfulBlogPost } from './render-contentful-blog-post';

export const blog = Router();

blog.get(
  '/:post',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { raw, html } = await renderContentfulBlogPost(
        req.params.post ?? '',
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
