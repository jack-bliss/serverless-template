import { program } from 'commander';
import { writeFile } from 'fs/promises';
import { renderContentfulBlogPost } from '../src/server/pages/blog/render-contentful-blog-post';

program.requiredOption('--slug <slug>', 'Blog post slug');

program.parse();

const { slug } = program.opts() as {
  slug: string;
};

console.info({ slug });

async function main() {
  const { html } = await renderContentfulBlogPost(slug);
  await writeFile(`./bucket/blog/${slug}.html`, html);
}

main()
  .then(() => console.info('done!'))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
