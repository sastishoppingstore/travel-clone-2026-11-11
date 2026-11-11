/**
 * Matchless Travels — content helper for a custom theme.
 *
 *   const content = require('./content.json');            // or import
 *   const page = content.pages.find(p => p.slug === 'about');
 *
 *   <title>{page.title}</title>
 *   <meta name="description" content={page.metaDescription} />
 *   <div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'content.json'), 'utf8'));

/** index by slug and by url */
const bySlug = {};
const byUrl = {};
for (const p of data.pages) {
  bySlug[p.slug] = p;
  byUrl[p.url.replace(/\/$/, '')] = p;
}

/** read the content HTML fragment for a page */
function contentHtml(slug) {
  const p = bySlug[slug];
  if (!p) return '';
  const f = path.join(ROOT, p.contentFile);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
}

/** read the verbatim server HTML for a page */
function sourceHtml(slug) {
  const p = bySlug[slug];
  if (!p) return '';
  const f = path.join(ROOT, p.sourceFile);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
}

/** local path of an asset, relative to your theme's assets folder */
function assetPath(url) {
  try {
    const p = new URL(url);
    return p.pathname.replace(/^\/+/, '');
  } catch { return url; }
}

module.exports = {
  pages: data.pages,
  bySlug,
  byUrl,
  contentHtml,
  sourceHtml,
  assetPath,
  source: data.source,
  generatedAt: data.generatedAt
};
