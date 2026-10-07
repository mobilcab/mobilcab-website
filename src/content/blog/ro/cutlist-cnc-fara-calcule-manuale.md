---
title: "Cum faci cutlist pentru CNC fără să calculezi manual"
description: "Unde apar greșelile când faci cutlist-ul de mână, cum le eviți și ce schimbă un export automat pentru CNC. Cu un exemplu de calcul pentru un corp de bucătărie."
date: "2026-10-06"
published: false
---

> **Ciornă pentru fondator — de șters înainte de publicare.** Verifică exemplul de calcul cu felul în care lucrați voi (grosimi, cant, rosturi). Exemplele concrete despre Mobilcab sunt marcate [VERIFICĂ] până știm exact ce exportă aplicația. Brief-ul cere și capturi de ecran: adaugă-le când există.

Cutlist-ul, adică lista de debitare, e puntea dintre proiect și mașină. Dacă e corect, restul merge de la sine. Dacă are o greșeală, o descoperi abia când placa e deja tăiată.

## De ce e atât de ușor să greșești de mână

Un corp de bucătărie arată simplu: două laterale, un blat de jos, eventual o polită, un spate și o ușă. Dar fiecare dimensiune depinde de altele:

- **grosimea plăcii** se scade din lățimea pieselor dintre laterale;
- **cantul** se scade din dimensiunea de debitare, dacă lucrezi cu dimensiuni finite;
- **rosturile ușilor** se scad din dimensiunea frontului;
- **spatele** depinde de cum se montează: în falț, în canal sau aplicat.

Un exemplu, pentru un corp de jos cu lățimea de 600 mm, din PAL de 18 mm, cu cant ABS de 2 mm pe muchia din față:

- lateralele: 2 bucăți la înălțimea și adâncimea corpului;
- blatul de jos, montat între laterale: 600 − 2 × 18 = **564 mm** lățime;
- adâncimea lui, cu cant de 2 mm pe față: se debitează cu 2 mm mai scurt decât adâncimea finită.

Fiecare pas e simplu. Problema e că sunt zeci de pași într-o bucătărie întreagă și că orice modificare de la client îi reia de la capăt.

## Cele mai frecvente patru greșeli

1. **Grosimea scăzută o singură dată.** Piesele dintre două laterale pierd două grosimi, nu una.
2. **Cantul uitat pe una dintre muchii.** Mai ales când o piesă are cant pe două sau trei laturi, cu grosimi diferite.
3. **O modificare propagată pe jumătate.** Lățimea corpului s-a schimbat, ușa a fost recalculată, polița nu.
4. **Greșeli de transcriere.** Lista e corectă pe hârtie, dar o cifră se inversează când o introduci în optimizatorul de debitare sau în programul mașinii.

## Cum reduci greșelile, chiar și fără program

- Lucrează cu **o singură sursă**: un tabel în care dimensiunile se calculează din formule, nu se scriu de mână.
- Notează pentru fiecare piesă **pe ce muchii are cant** și ce grosime.
- După orice modificare, **refă toată lista**, nu doar piesele pe care crezi că le-ai afectat.
- **Verifică înainte de tăiere** cu o a doua pereche de ochi sau măcar a doua zi, cu mintea limpede.

## Ce schimbă un export automat

Un program de proiectare a mobilei face aceleași calcule, dar le leagă între ele. Când schimbi lățimea corpului, se recalculează automat toate piesele care depind de ea: blatul, polițele, ușa, spatele.

Cutlist-ul se generează direct din proiect, cu dimensiunile, cantitățile, materialul și cantul fiecărei piese. Iar exportul pentru CNC sau pentru optimizatorul de debitare se face fără să mai transcrii nimic de mână, deci dispare și greșeala de transcriere.

Asta nu înseamnă că nu mai verifici nimic. Un program calculează exact ce i-ai spus, așa că o setare greșită (o grosime de placă, un tip de cant) se propagă la fel de consecvent ca una corectă. Diferența e că o verifici o dată, nu de zeci de ori.

## Cum o face Mobilcab

În [Mobilcab](/ro/), dintr-un proiect terminat ajungi la cutlist cu un singur clic: lista apare imediat, cu dimensiunile panourilor, cantitățile și materialele, gata pentru fluxul tău CNC [VERIFICĂ: formatele exportate]. Programul rulează direct din browser, pe laptop, tabletă sau telefon.

E încă în dezvoltare. Dacă vrei să-l încerci pe proiectele tale printre primii, lasă-ne emailul mai jos.
