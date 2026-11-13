# Cele 3 clipuri demo (site) — aliniere M1

**Sursă canonică** pentru înregistrarea clipurilor de pe Home + pagina *Cum funcționează*.
Copy-ul public e deja în `src/i18n/demo.*.json` / `home.*.json` și în `src/data/demoVideos.ts`.
Documentele vechi din kit (AI-assist, CNC export) **nu** se mai folosesc la record.

După upload pe YouTube: lipește ID-urile în `src/data/demoVideos.ts`, apoi `demo: true` în `src/site.ts`.

## Trio (ordine fixă)

| # | `demoVideos.key` | Titlu site (RO) | Ce arăți (M1, acum) | Nu arăți |
|---|------------------|-----------------|---------------------|----------|
| 1 | `design` | Proiectare 3D | Dulap de colț de bucătărie, din browser | Generează / Asistent NL |
| 2 | `cutlist` | Listă de debitare | Tray **Debitare**: piese, cote, cantități, materiale | Nesting, DXF, G-code, tab CNC |
| 3 | `save` | Salvare și export | Cloud + CSV debitare + `.mcab` local | „Export CNC într-un click” |

Același proiect pe toate trei (ideal `?seed=demo-kitchen` după login pe `app.mobilcab.com` sau local).

## Mapare la tutoriale CAD

Scripturi long-form: repo `mobilcab-cad` → `docs/tutorials/` + curriculum
[`tutoriale-m1-curriculum.md`](https://github.com/mobilcab/mobilcab-cad/blob/develop/docs/plans/tutoriale-m1-curriculum.md).

| Clip site | Episoade CAD (sursă regie) | Notă |
|-----------|----------------------------|------|
| `design` | E01 (New/Quick Setup) + E08 (colțar) — sau un take scurt pe seed demo | Hook-ul „sub 10 minute” e marketing; take-ul site = **60–90 s**, nu episodul întreg |
| `cutlist` | **[E09b](https://github.com/mobilcab/mobilcab-cad/blob/develop/docs/tutorials/E09b-debitare.md)** (Debitare) — long-form + take scurt în același fișier | Fără tab Documente |
| `save` | E09 (Save Local / Export As) + E12 (cloud) — extras scurt | Clipul 3 = salvare + export, nu verificare Vedere (E10) |

**Familie separată:** aceste 3 clipuri = **demo site** (embed 60–90 s), nu Tutorial long-form și nu Short/Reel 9:16.  
Pe Facebook / Instagram **nu** le urci ca Reels — acolo merg shorts din CAD (`docs/tutorials/shorts/`).  
Hartă canale: [mobilcab-cad `content-channels-m1.md`](https://github.com/mobilcab/mobilcab-cad/blob/develop/docs/plans/content-channels-m1.md).  
Shorts / Reels (E00–E12) **nu** înlocuiesc aceste 3 embed-uri.

## Spec producție (toate trei)

| Parametru | Valoare |
|-----------|---------|
| Durată | 60–90 s fiecare |
| Format | 16:9, 1080p, screen record |
| VO | RO (ElevenLabs sau live); EN separat doar dacă faci ID `en` distinct |
| Ton | Atelier, fără jargon marketing; etichete UI exact ca în app |
| Login | Cont real; apoi seed / proiect demo |
| CTA final | Link site `/ro/cum-functioneaza/` sau app — **nu** „listă de așteptare” ca poartă de produs |

## Shot list scurt (record)

### 1 — `design`

1. Browser → app (fără instalare).
2. Proiect cu colțar vizibil (`demo-kitchen` sau plasare scurtă).
3. Schimbă o cotă → panourile se ajustează (aha).
4. Ușă / sertar scurt, dacă încape în timp.
5. CTA: „următorul pas = lista de debitare”.

### 2 — `cutlist`

1. Același proiect.
2. Deschide tray **Debitare** (nu Documente, nu CNC).
3. Scroll scurt pe tabel: piese, dimensiuni, cantități, materiale.
4. Menționează explicit: baza de acum = proiectare + debitare; nesting/CNC vin pe roadmap.
5. CTA: „salvezi și exporți când ai nevoie”.

### 3 — `save`

1. Același proiect.
2. Salvare cloud (Cont / sync vizibil, fără a expune date personale).
3. Export listă (CSV) și/sau **Proiect ▾** → **Save Local** / **Export As** (`.mcab`).
4. Spune clar: acum exporturi fără limită; limitele pe Gratuit apar la billing.
5. CTA: Partener Fondator sau „încearcă gratuit”.

## Script VO (RO) — draft pentru montaj

Scripturi + MP3 (CAD): [`docs/tutorials/site-demo/`](https://github.com/mobilcab/mobilcab-cad/tree/develop/docs/tutorials/site-demo) — `npm run vo:site -- W01`.

### Clip 1 — Proiectare 3D (`W01`)

VO generat: [W01-vo.mp3](https://github.com/mobilcab/mobilcab-cad/blob/develop/docs/tutorials/site-demo/vo-published/W01/W01-vo.mp3) (narațiune legată + intro Ștefan; restul e pauză UI pe 60–90 s).

> Salut, sunt Ștefan, de la Mobilcab — un program de proiectare mobilă care rulează direct în browser, pe laptop, fără instalare. Îți arăt pe scurt cum iese un dulap de colț de bucătărie: deschid aplicația, intru în proiect și am deja un colțar în scenă. Schimb o dimensiune și restul panourilor se ajustează, apoi adaug pe scurt o ușă sau un sertar dacă e nevoie. Asta e baza, proiectare 3D pe laptop, iar următorul pas e lista de debitare.

### Clip 2 — Listă de debitare

> Din același proiect deschid Debitare.
> Vezi piesele, cotele, cantitățile și materialele — fără să calculezi manual fiecare panou.
> Nesting-ul pe coli și exportul CNC vin mai târziu pe roadmap. Acum ai proiectare plus debitare.

### Clip 3 — Salvare și export

> Proiectul rămâne în cloud: îl redeschizi pe laptop, tot din browser.
> Când ai nevoie, exporți lista (CSV) sau fișierul de proiect (.mcab) pe disc.
> Acum exporturile sunt fără limită. Limitele pe planul gratuit apar abia când deschidem abonamentele.

## Checklist înainte de `demo: true`

- [ ] Trei ID-uri YouTube în `demoVideos.ts` (`ro`; `en` doar dacă există variantă separată)
- [ ] Niciun clip nu arată AI, nesting sau CNC ca „disponibil acum”
- [ ] Descrierile YouTube linkează `/ro/cum-functioneaza/` (sau preview până la publish)
- [ ] Smoke pe `/preview/ro/cum-functioneaza/` + secțiunea demo de pe Home
