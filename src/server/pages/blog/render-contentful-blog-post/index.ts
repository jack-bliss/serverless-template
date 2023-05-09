import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { getAsset, renderTemplate } from '../../../services';
import { BlogPost } from '../../../services/contentful/types';
import { format, parseISO } from 'date-fns';
import { getContentfulEntriesByField } from '../../../services/contentful';

export async function renderContentfulBlogPost(slug: string) {
  const [template, entry] = await Promise.all([
    getAsset('blog-post-template.html'),
    getContentfulEntriesByField<BlogPost>({
      contentType: 'blogPost',
      field: 'slug',
      value: slug,
    }),
  ]);
  return {
    html: renderTemplate(template.toString(), {
      title: entry.items[0].fields.title,
      published: format(
        parseISO(entry.items[0].fields.published),
        'dd/MM/yyyy',
      ),
      body: documentToHtmlString(entry.items[0].fields.body),
    }),
    raw: entry.items[0].fields,
  };
}
