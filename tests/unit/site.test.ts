// The launch switch (src/site.ts): unpublished pages must never be linked from
// public pages, and publishing a page must move it to its real address.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { languages } from '../../src/i18n';
import { isPostPublic, postPath, posts, postsToList } from '../../src/lib/blog';
import {
  confirmedPaths,
  hasStandIn,
  joinFreeHref,
  linkFor,
  livePaths,
  pathFor,
  pathsFor,
  previewPath,
  published,
  type PageKey,
} from '../../src/site';

const keys = Object.keys(livePaths) as PageKey[];
let saved: typeof published;

// `published` is a plain object, so tests can flip pages and restore them.
beforeEach(() => {
  saved = { ...published };
});
afterEach(() => {
  Object.assign(published, saved);
});
const unpublishAll = () => keys.forEach((k) => (published[k] = false));

describe('addresses', () => {
  it('every page has a distinct address in both languages, starting with the language', () => {
    const all = keys.flatMap((k) => languages.map((l) => livePaths[k][l]));
    expect(new Set(all).size).toBe(all.length);
    for (const k of keys) for (const l of languages) expect(livePaths[k][l]).toMatch(new RegExp(`^/${l}/`));
  });

  it('preview addresses are the real ones under /preview', () => {
    for (const k of keys) for (const l of languages) expect(previewPath(k, l)).toBe(`/preview${livePaths[k][l]}`);
  });

  it('the confirmation page lives outside the launch switch', () => {
    for (const l of languages) expect(keys.map((k) => livePaths[k][l])).not.toContain(confirmedPaths[l]);
  });

  it('only Home and Privacy have stand-ins', () => {
    expect(keys.filter(hasStandIn).sort()).toEqual(['home', 'privacy']);
  });
});

describe('currently published', () => {
  it('puts terms and privacy at their real addresses, not preview', () => {
    expect(pathFor('terms', 'ro')).toBe('/ro/termeni/');
    expect(pathFor('privacy', 'en')).toBe('/en/privacy/');
    expect(linkFor('terms', 'ro', false)).toBe('/ro/termeni/');
    expect(linkFor('privacy', 'ro', false)).toBe('/ro/confidentialitate/');
  });
});

describe('with nothing published (today)', () => {
  beforeEach(unpublishAll);

  it('builds every page under /preview', () => {
    for (const k of keys) for (const l of languages) expect(pathFor(k, l)).toBe(previewPath(k, l));
  });

  it('never links a public page to a page without a stand-in', () => {
    for (const k of keys.filter((k) => !hasStandIn(k))) {
      for (const l of languages) expect(linkFor(k, l, false), `${k}/${l}`).toBeNull();
    }
  });

  it('links public pages to the stand-ins at the real addresses', () => {
    expect(linkFor('home', 'ro', false)).toBe('/ro/');
    expect(linkFor('privacy', 'en', false)).toBe('/en/privacy/');
  });

  it('links preview pages to other previews', () => {
    expect(linkFor('pricing', 'ro', true)).toBe('/preview/ro/preturi/');
    expect(linkFor('home', 'en', true)).toBe('/preview/en/');
  });

  it('points "join free" at the coming-soon form from public pages', () => {
    expect(joinFreeHref('ro', false)).toBe('/ro/#inscriere');
    expect(joinFreeHref('en', true)).toBe('/preview/en/#join');
  });
});

describe('publishing a page', () => {
  beforeEach(unpublishAll);

  it('moves it to its real address and makes it linkable everywhere', () => {
    published.demo = true;
    expect(pathFor('demo', 'ro')).toBe('/ro/cum-functioneaza/');
    expect(linkFor('demo', 'ro', false)).toBe('/ro/cum-functioneaza/');
    expect(linkFor('demo', 'ro', true)).toBe('/ro/cum-functioneaza/');
    expect(pathsFor('demo')).toEqual(livePaths.demo);
  });

  it('leaves the other pages unpublished', () => {
    published.demo = true;
    expect(linkFor('pricing', 'ro', false)).toBeNull();
  });

  it('does not expose the refund policy on public pages until billing', () => {
    expect(pathFor('refund', 'ro')).toBe('/preview/ro/rambursare/');
    expect(linkFor('refund', 'ro', false)).toBeNull();
    expect(linkFor('refund', 'ro', true)).toBe('/preview/ro/rambursare/');
  });
});

describe('blog posts', () => {
  beforeEach(unpublishAll);

  it('loads the posts from src/content/blog', () => {
    expect(posts.length).toBeGreaterThanOrEqual(3);
    for (const post of posts) {
      expect(post.title).not.toBe('');
      expect(post.description).not.toBe('');
      expect(Number.isNaN(post.date.getTime())).toBe(false);
    }
  });

  it('keeps every draft in preview, even when the blog is published', () => {
    published.blog = true;
    for (const post of posts.filter((p) => !p.published)) {
      expect(isPostPublic(post)).toBe(false);
      expect(postPath(post)).toMatch(/^\/preview\//);
    }
    expect(postsToList('ro', false).every((p) => p.published)).toBe(true);
  });

  it('needs both the blog and the post published to go public', () => {
    const post = posts[0]!;
    const original = post.published;
    try {
      post.published = true;
      expect(isPostPublic(post)).toBe(false);
      published.blog = true;
      expect(isPostPublic(post)).toBe(true);
      expect(postPath(post)).toBe(`/${post.lang}/blog/${post.slug}/`);
      expect(postsToList(post.lang, false)).toContain(post);
    } finally {
      post.published = original;
    }
  });

  it('lists drafts on preview index pages only', () => {
    const drafts = posts.filter((p) => p.lang === 'ro' && !p.published);
    expect(postsToList('ro', true)).toEqual(expect.arrayContaining(drafts));
    expect(postsToList('ro', false)).not.toEqual(expect.arrayContaining(drafts.length ? drafts : [{}]));
  });
});
