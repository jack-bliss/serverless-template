import { NextFunction, Request, Response, Router } from 'express';
import { getContentfulEntryByField } from '../../services/contentful';
import { BlogPost } from '../../services/contentful/types';
import { renderContentfulBlogPost } from './render-contentful-blog-post';
import { getAsset } from '../../services';

export const blog = Router();

blog.get(
  '/:post',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [template, entry] = await Promise.all([
        getAsset('blog-post-template.html'),
        getContentfulEntryByField<BlogPost>({
          contentType: 'blogPost',
          field: 'slug',
          value: req.params.post,
        }),
      ]);
      if (req.query.raw === 'true') {
        res.type('application/json').send(entry);
        return;
      }
      res
        .type('text/html')
        .send(renderContentfulBlogPost(template.toString(), entry.fields));
    } catch (error) {
      next(error);
    }
  },
);
