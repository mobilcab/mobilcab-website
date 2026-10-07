// The three demo videos (Launch Content Kit Section 2), in the same order as the
// `videos` lists in src/i18n/home.*.json and demo.*.json.
//
// Add each video's YouTube ID once it's uploaded: the part after `v=` in
// https://www.youtube.com/watch?v=XXXXXXXXXXX. `en` falls back to `ro`, so
// leave it null unless there's a separate English version.
// While an ID is null, a "coming soon" placeholder is shown instead.

export interface DemoVideo {
  key: 'design' | 'ai' | 'export';
  youtubeId: { ro: string | null; en: string | null };
}

export const demoVideos: DemoVideo[] = [
  { key: 'design', youtubeId: { ro: null, en: null } },
  { key: 'ai', youtubeId: { ro: null, en: null } },
  { key: 'export', youtubeId: { ro: null, en: null } },
];
