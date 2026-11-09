import type { Lang } from '../i18n';
import { pathFor } from '../site';

/** Product stages used in marketing (see docs/DECISIONS.md and /roadmap). */
export type MilestoneCode = 'M1' | 'M2' | 'M3' | 'M4' | 'M5';

export const milestones: Record<
  MilestoneCode,
  {
    id: string;
    /** Stage id on the roadmap page (for mapping). */
    stageId: string;
    short: Record<Lang, string>;
  }
> = {
  M1: {
    id: 'm1',
    stageId: 'design-cutlist',
    short: {
      ro: 'Etapa 1: Debitare — proiectare 3D + listă de debitare',
      en: 'Stage 1: Cut list — 3D design + cut list',
    },
  },
  M2: {
    id: 'm2',
    stageId: 'nesting-offer',
    short: {
      ro: 'Etapa 2: nesting, etichete, ofertă — atunci deschidem abonamentele',
      en: 'Stage 2: nesting, labels, quotes — when subscriptions open',
    },
  },
  M3: {
    id: 'm3',
    stageId: 'cnc-export',
    short: {
      ro: 'Etapa 3: export CNC',
      en: 'Stage 3: CNC export',
    },
  },
  M4: {
    id: 'm4',
    stageId: 'team-share',
    short: {
      ro: 'Etapa 4: echipă și partajare',
      en: 'Stage 4: team and sharing',
    },
  },
  M5: {
    id: 'm5',
    stageId: 'ai-renders',
    short: {
      ro: 'Etapa 5: AI + randări',
      en: 'Stage 5: AI + renders',
    },
  },
};

export function milestoneHref(code: MilestoneCode, lang: Lang): string {
  return `${pathFor('roadmap', lang)}#${milestones[code].id}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function anchor(code: MilestoneCode, lang: Lang): string {
  const m = milestones[code];
  const href = milestoneHref(code, lang);
  const title = escapeHtml(m.short[lang]);
  return `<a href="${href}" class="milestone-ref" title="${title}">${code}</a>`;
}

/**
 * Escape plain text, then turn M1–M5 / M1+M2 into roadmap links
 * with a native title tooltip. Legacy M6 → same as M5 (AI stage).
 */
export function linkMilestones(text: string, lang: Lang): string {
  const escaped = escapeHtml(text);
  return escaped.replace(/\bM1\+M2\b|\bM[1-6]\b/g, (match) => {
    if (match === 'M1+M2') {
      return `${anchor('M1', lang)}+${anchor('M2', lang)}`;
    }
    if (match === 'M6') {
      return anchor('M5', lang);
    }
    return anchor(match as MilestoneCode, lang);
  });
}
