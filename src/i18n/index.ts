import ro from './ro.json';
import en from './en.json';
import homeRo from './home.ro.json';
import homeEn from './home.en.json';
import fpRo from './fp.ro.json';
import fpEn from './fp.en.json';
import demoRo from './demo.ro.json';
import demoEn from './demo.en.json';
import faqRo from './faq.ro.json';
import faqEn from './faq.en.json';
import pricingRo from './pricing.ro.json';
import pricingEn from './pricing.en.json';
import blogRo from './blog.ro.json';
import blogEn from './blog.en.json';
import confirmRo from './confirm.ro.json';
import confirmEn from './confirm.en.json';

export const languages = ['ro', 'en'] as const;
export type Lang = (typeof languages)[number];

export const languageNames: Record<Lang, string> = { ro: 'Română', en: 'English' };

export type Dict = typeof ro;
const dicts: Record<Lang, Dict> = { ro, en };

export const useTranslations = (lang: Lang): Dict => dicts[lang];

// Phase 2 Home page copy, kept apart from the live coming-soon copy above.
export type HomeDict = typeof homeRo;
const homeDicts: Record<Lang, HomeDict> = { ro: homeRo, en: homeEn };
export const useHomeTranslations = (lang: Lang): HomeDict => homeDicts[lang];

export type FoundingPartnerDict = typeof fpRo;
const fpDicts: Record<Lang, FoundingPartnerDict> = { ro: fpRo, en: fpEn };
export const useFoundingPartnerTranslations = (lang: Lang): FoundingPartnerDict => fpDicts[lang];

export type DemoDict = typeof demoRo;
const demoDicts: Record<Lang, DemoDict> = { ro: demoRo, en: demoEn };
export const useDemoTranslations = (lang: Lang): DemoDict => demoDicts[lang];

export type FaqDict = typeof faqRo;
const faqDicts: Record<Lang, FaqDict> = { ro: faqRo, en: faqEn };
export const useFaqTranslations = (lang: Lang): FaqDict => faqDicts[lang];

export type PricingDict = typeof pricingRo;
const pricingDicts: Record<Lang, PricingDict> = { ro: pricingRo, en: pricingEn };
export const usePricingTranslations = (lang: Lang): PricingDict => pricingDicts[lang];

export type BlogDict = typeof blogRo;
const blogDicts: Record<Lang, BlogDict> = { ro: blogRo, en: blogEn };
export const useBlogTranslations = (lang: Lang): BlogDict => blogDicts[lang];

export type ConfirmDict = typeof confirmRo;
const confirmDicts: Record<Lang, ConfirmDict> = { ro: confirmRo, en: confirmEn };
export const useConfirmTranslations = (lang: Lang): ConfirmDict => confirmDicts[lang];

// Page addresses and the launch switch live in src/site.ts.
