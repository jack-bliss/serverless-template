import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { renderTemplate } from '../../../services';
import { BlogPost } from '../../../services/contentful/types';
import { format, parseISO } from 'date-fns';

export function renderContentfulBlogPost(
  template: string,
  entry: BlogPost,
) {
  return renderTemplate(template, {
    title: entry.title,
    published: format(parseISO(entry.published), 'dd/MM/yyyy'),
    body: documentToHtmlString(entry.body),
  });
}
