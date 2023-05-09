import { getAsset, renderTemplate } from '../../services';
import { fileNameToTitle } from './file-name-to-title';
import MD from 'markdown-it';

const md = new MD({
  typographer: true,
});

export async function renderMarkdown(name: string, markdown: string) {
  const template = await getAsset('markdown-template.html');
  const result = md.render(markdown);
  return renderTemplate(template.toString(), {
    title: fileNameToTitle(name),
    body: result,
  });
}
