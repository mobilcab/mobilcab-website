# Plan Soft Launch — Mobilcab

Rezumat al discuției despre lansarea aplicației și a website-ului. Document de lucru pentru implementare; tonul și detaliile urmează ce s-a stabilit pe această linie.

## Ideea de bază

Nu deschidem brusc către toată lumea. Începem cu un **soft launch**: arătăm produsul unor oameni apropiați, învățăm din feedback, abia apoi ieșim public (Facebook, site, aplicație). Mesajul nu e „uite tâmplăria” — e **problema rezolvată**.

---

## 1. Soft launch pe WhatsApp Status (prieteni non-tâmplari)

**Cui:** prieteni care **nu** sunt tâmplari. Scopul e să vadă dacă înțeleg oferta și dacă problema e clară, nu să valideze fluxul de atelier.

**Ce arăți:** problema rezolvată — ce face produsul pentru cineva, pe scurt — nu un tur de tâmplărie.

**Mesajul de invitație:** scurt. Cere **feedback în două minute** (nu un chestionar lung, nu „spune-mi tot ce crezi”).

Exemplu de intenție (de adaptat la trimitere):

> Am lansat ceva mic. Îți ia două minute — deschizi, te uiți, îmi spui ce nu e clar. Mulțumesc.

După ce apar răspunsuri: notează ce întrebări se repetă, ce e confuz, ce le-a plăcut. Asta alimentează pasul următor.

---

## 2. După câteva zile pe WhatsApp → post pe Facebook

Nu sări direct pe Facebook. **Câteva zile** de Status / feedback pe WhatsApp, apoi un post public.

Postul include:

- **ce s-a aflat** din feedback;
- **ce s-a schimbat** ca urmare (chiar dacă e mic — o frază pe site, un buton, un FAQ);
- **link** către site / aplicație.

Mesajul: „am testat cu oameni, iată ce am învățat, iată ce am corectat, încearcă aici” — nu un anunț gol de lansare.

---

## 3. Pagina de Facebook — nu o lași goală

Înainte (și în paralel) cu postările de lansare, pagina trebuie să arate că există:

| Element | Cerință |
|---|---|
| **Cover** | Bun, clar, potrivit brandului |
| **Descriere** | Clară: **ce faceți** (problema + soluția), nu slogan vag |
| **Poze** | Două–trei **poze reale** (produs, ecran, context real — nu stock gol) |
| **Ritm** | **Un post pe săptămână** — pagina nu stă goală |

O pagină goală sau moartă strică încrederea când cineva vine din WhatsApp sau dintr-un share.

---

## 4. Cum se publică pe Facebook (roluri)

**Eu (agentul) nu pot apăsa Publish pe Facebook.**

Pregătesc:

- textul postului;
- pozele / materialele;
- programul (când merită publicat).

**Tu apeși Publish** (sau programezi tu din Meta). Fluxul e: draft gata → tu confirmi și publici.

---

## 5. Google Business Profile + recenzii

Pe lângă Facebook și site:

- profil **Google Business Profile** activ;
- **recenzii de la primii clienți** — cerute natural, după ce au folosit produsul, nu spam de la ziua 1.

Ajută la căutare locală / „cine sunteți” când cineva aude de Mobilcab și caută pe Google.

---

## 6. Transformarea vizitatorilor în clienți (site / aplicație)

Pe website (și în mesajele de lansare), conversia e clară și fără fricțiune:

| Element | Cum |
|---|---|
| CTA principal | Buton **„Încearcă gratuit”** — **nu** „Contactează-ne” |
| Linia de încredere | **„fără card, fără angajament”** lângă CTA |
| Demo pe homepage | Clip / demo scurt de **~30 de secunde** pe pagina principală |
| FAQ | Secțiune cu răspunsuri la: **cost**, **mobil**, **datele utilizatorului** |

Vizitatorul trebuie să înțeleagă rapid: pot încerca acum, nu plătesc ca să văd, știu ce se întâmplă cu datele mele.

---

## 7. Newsletter (legat de soft launch, dar canal separat)

Detalii din discuție + planurile din repo (`docs/Mobilcab_Newsletter_Plan.md`):

| Subiect | Decizie |
|---|---|
| **Reply metrics** | **Brevo Inbound Parse** (subdomain `reply.`, webhook) — **nu** Conversations API ca sursă de adevăr pentru metrici. Conversations rămâne eventual pentru inbox uman. Cercetat; **neimplementat încă**. |
| **Conținutul ediției lunare** | Se scrie **împreună**: tu dai subiecte / puncte-cheie; eu redactează structura (promisiune în subject, 3–4 paragrafe, un CTA). |
| **Trimiterea** | **Brevo programează** trimiterea la **oră fixă** (marți dimineața, per plan). |
| **Welcome la abonare** | Deja **automat** (confirmare + automation pe listă) — nu se reinventează la soft launch. |

Soft launch pe WhatsApp/Facebook poate alimenta și lista de noutăți, dar newsletterul rămâne ritmul lunar, nu canalul de soft launch.

---

## 8. Task ClickUp (deja creat)

Lucrul e urmărit în Backlog:

**[Newsletter & Founding Partner Communication Plan](https://app.clickup.com/t/1amhxucrfr4)**

Acoperă newsletterul lunar + ritmul de transparență Partener Fondator, roadmap pe 6 luni și nota de măsurare (Brevo opens/clicks; Inbound Parse pentru replies — research only).

---

## Ordinea sugerată (pe scurt)

1. Pregătești mesajul WhatsApp + ce arăți (problema rezolvată).
2. Soft launch Status / prieteni non-tâmplari → feedback în 2 minute.
3. Câteva zile: notezi feedbackul; ajustezi site/copy dacă e nevoie.
4. Asiguri pagina Facebook (cover, descriere, 2–3 poze, ritm săptămânal).
5. Post Facebook cu „ce am aflat / ce am schimbat” + link.
6. CTA pe site: „Încearcă gratuit” + „fără card, fără angajament” + demo 30s + FAQ (cost / mobil / date).
7. Google Business Profile + cereri de recenzii de la primii clienți.
8. Newsletter: conținut lunar din puncte-cheie; programare în Brevo; Inbound Parse când se implementează reply tracking.

---

## Documente înrudite

- `docs/Mobilcab_Newsletter_Plan.md`
- `docs/Mobilcab_Founding_Partner_Communication_Plan.md`
- Task ClickUp: https://app.clickup.com/t/1amhxucrfr4
