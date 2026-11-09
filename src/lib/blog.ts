// Blog posts: Markdown files in src/content/blog/<lang>/<slug>.md.
//
// A post is public only when both the blog (src/site.ts) and the post itself
// (`published: true` in its frontmatter) are published. Otherwise it's built at
// /preview/<lang>/blog/<slug>/, so drafts can be read without going public.

import type { MarkdownInstance } from 'astro';
import type { Lang } from '../i18n';
import { livePaths, previewPath, published } from '../site';

type PostModule = MarkdownInstance<{
  title: string;
  description: string;
  /** Publication date, YYYY-MM-DD. */
  date: string;
  published?: boolean;
}>;

export interface Post {
  slug: string;
  lang: Lang;
  title: string;
  description: string;
  date: Date;
  published: boolean;
  Content: PostModule['Content'];
}

const modules = import.meta.glob<PostModule>('../content/blog/*/*.md', { eager: true });

export const posts: Post[] = Object.entries(modules)
  .map(([file, mod]) => {
    const match = file.match(/blog\/(ro|en)\/([^/]+)\.md$/);
    if (!match) throw new Error(`Blog post in an unexpected place: ${file}`);
    const { title, description, date, published: isPublished = false } = mod.frontmatter;
    return {
      slug: match[2]!,
      lang: match[1] as Lang,
      title,
      description,
      date: new Date(`${date}T12:00:00Z`),
      published: isPublished,
      Content: mod.Content,
    };
  })
  .sort((a, b) => b.date.getTime() - a.date.getTime());

export const isPostPublic = (post: Post) => published.blog && post.published;

export const postPath = (post: Post) =>
  `${isPostPublic(post) ? livePaths.blog[post.lang] : previewPath('blog', post.lang)}${post.slug}/`;

/** Same article in both languages: [ro slug, en slug]. */
const translationPairs: [string, string][] = [
  ['lansare', 'launch'],
  ['program-proiectare-mobila-gratuit', 'free-furniture-design-software'],
  ['cutlist-cnc-fara-calcule-manuale', 'cutlist-without-manual-calculations'],
  ['polyboard-vs-proiectare-din-browser', 'polyboard-vs-browser-design'],
  ['prima-sesiune-in-mobilcab', 'first-session-in-mobilcab'],
  ['comparatie-cad-mobila', 'furniture-cad-comparison'],
  ['de-la-proiect-la-lista-de-debitare', 'from-project-to-cut-list'],
  ['corp-600-mobilcab-vs-manual', '600mm-cabinet-paper-vs-mobilcab'],
];

/** The other-language version of a post, if both sides exist. */
export const translationOf = (post: Post): Post | undefined => {
  const pair = translationPairs.find(
    ([ro, en]) => (post.lang === 'ro' && post.slug === ro) || (post.lang === 'en' && post.slug === en),
  );
  if (!pair) return undefined;
  const otherLang: Lang = post.lang === 'ro' ? 'en' : 'ro';
  const otherSlug = post.lang === 'ro' ? pair[1] : pair[0];
  return posts.find((p) => p.lang === otherLang && p.slug === otherSlug);
};

/** Posts to list on a blog index page; a preview index also lists drafts. */
export const postsToList = (lang: Lang, fromPreview: boolean) =>
  posts.filter((post) => post.lang === lang && (fromPreview || isPostPublic(post)));
