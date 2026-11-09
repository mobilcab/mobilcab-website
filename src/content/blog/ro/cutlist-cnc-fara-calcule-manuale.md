---
title: "Cum faci cutlist (listă de debitare) fără să calculezi manual"
description: "Unde apar greșelile pe hârtie, cum le eviți și ce schimbă o listă generată din proiectul 3D. Exemplu pe un corp de 600 mm — și ce e gata acum în Mobilcab versus exportul CNC pe Plan."
date: "2026-11-09"
published: true
---

Cutlist-ul, adică lista de debitare, e puntea dintre proiect și atelier (și, mai târziu, mașină). Dacă e corect, restul merge mai ușor. Dacă are o greșeală, o descoperi deseori abia când placa e deja tăiată.

## De ce e ușor să greșești de mână

Un corp de jos arată simplu: laterale, blat, eventual poliță, spate, ușă. Fiecare dimensiune depinde de altele:

- **grosimea plăcii** se scade din lățimea pieselor dintre laterale;
- **cantul** se scade din dimensiunea de debitare, dacă lucrezi cu dimensiuni finite;
- **rosturile ușilor** se scad din front;
- **spatele** depinde de montaj (falț, canal, aplicat).

Exemplu: corp de jos **600 mm**, **PAL 18 mm**, cant **ABS 2 mm** pe față:

- lateralele: 2 bucăți la înălțimea și adâncimea corpului;
- blatul de jos între laterale: **600 − 2 × 18 = 564 mm** lățime;
- adâncimea cu cant pe față: se debitează cu 2 mm mai scurt decât adâncimea finită, dacă lucrezi așa.

Pașii sunt simpli. Problema e volumul și modificările de la client. Același tip de calcul e și în [corp 600 mm: hârtie vs. Mobilcab](/ro/blog/corp-600-mobilcab-vs-manual/).

## Cele mai frecvente patru greșeli

1. **Grosimea scăzută o singură dată** — între două laterale pierzi două grosimi.
2. **Cant uitat** pe o muchie.
3. **Modificare propagată pe jumătate** — ușa s-a schimbat, polița nu.
4. **Transcriere** — lista e corectă pe hârtie, cifra se inversează în optimizator sau la mașină.

## Cum reduci greșelile, chiar și fără program

- O **singură sursă** (tabel cu formule, nu cifre rescrise).
- Pentru fiecare piesă: **cant pe ce muchii**.
- După orice modificare: **refă lista**, nu doar „piesele pe care crezi că le-ai atins”.
- **Verifică înainte de tăiere**.

## Ce schimbă o listă din proiectul 3D

Când cutlist-ul e legat de model, o schimbare de lățime actualizează piesele dependente în proiect. Lista pleacă din modelul actual, nu dintr-o copie veche pe hârtie.

Asta **nu** înlocuiește verificarea: programul aplică ce i-ai setat — inclusiv o grosime greșită. Diferența e că o verifici o dată pe setări, nu de zeci de ori pe foaie.

## Cum o face Mobilcab acum

În [Mobilcab](/ro/), pe laptop în browser, din proiect deschizi **lista de debitare**: dimensiuni, cantități, materiale — pe Planul Gratuit, în etapa Debitare. Poți exporta CSV sau proiect local (`.mcab`) când ai nevoie. Fluxul pas cu pas: [de la proiect la listă](/ro/blog/de-la-proiect-la-lista-de-debitare/).

**Exportul dedicat pentru CNC** (fișiere pentru mașină) e pe [Plan](/ro/roadmap/) ca etapă ulterioară (după nesting stabil), pe planul CNC — nu e inclus în Debitare acum. Lista de debitare e baza; nesting-ul și fișierul de mașină vin pe rând.

Verificarea înainte de tăiere rămâne a ta.
