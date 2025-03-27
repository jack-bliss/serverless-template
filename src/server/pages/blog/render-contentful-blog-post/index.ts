import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { format, parseISO } from 'date-fns';
import { getAsset, renderTemplate } from '../../../services';
import { getContentfulEntriesByField } from '../../../services/contentful';
import { BlogPost } from '../../../services/contentful/types';

export async function renderContentfulBlogPost(slug: string) {
  const [template, entry] = await Promise.all([
    getAsset('blog-post-template.html'),
    getContentfulEntriesByField<BlogPost>({
      contentType: 'blogPost',
      field: 'slug',
      value: slug,
    }),
  ]);
  const item = entry.items[0];
  if (!item) {
    throw new Error(`Couldn't get blog item with slug ${slug}`);
  }
  return {
    html: renderTemplate(template.toString(), {
      title: item.fields.title,
      published: format(parseISO(item.fields.published), 'dd/MM/yyyy'),
      body: documentToHtmlString(item.fields.body),
    }),
    raw: item.fields,
  };
}
