// The three demo videos for M1 (design → cut list → save/export), in the same
// order as the `videos` lists in src/i18n/home.*.json and demo.*.json.
//
// Recording brief (shot list, VO, CAD episode map): docs/demo-videos-m1.md
// Do not use old marketing scripts that put AI-assist or CNC in these slots.
//
// Add each video's YouTube ID once it's uploaded: the part after `v=` in
// https://www.youtube.com/watch?v=XXXXXXXXXXX. `en` falls back to `ro`, so
// leave it null unless there's a separate English version.
// While an ID is null, a "coming soon" placeholder is shown instead.

export interface DemoVideo {
  key: 'design' | 'cutlist' | 'save';
  youtubeId: { ro: string | null; en: string | null };
}

export const demoVideos: DemoVideo[] = [
  { key: 'design', youtubeId: { ro: null, en: null } },
  { key: 'cutlist', youtubeId: { ro: null, en: null } },
  { key: 'save', youtubeId: { ro: null, en: null } },
];
