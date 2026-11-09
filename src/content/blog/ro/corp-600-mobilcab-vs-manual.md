---
title: "Un corp de 600 mm: pe hârtie vs. în Mobilcab"
description: "Același exemplu de corp de jos 600 mm, PAL 18 mm: ce calculezi manual la cutlist și cum trece același tip de proiect prin proiectare 3D și listă de debitare în Mobilcab."
date: "2026-11-09"
published: true
---

Luăm un exemplu simplu, folosit des în atelier: un **corp de jos** cu lățimea de **600 mm**, din **PAL de 18 mm**, cu **cant ABS de 2 mm** pe muchia din față. Nu e o bucătărie întreagă — e un singur corp, ca să vezi unde apare munca.

## Pe hârtie (sau în Excel)

Lateralele: două piese la înălțimea și adâncimea corpului.

Blatul de jos, montat între laterale: lățimea de debitare e  
**600 − 2 × 18 = 564 mm**.

Adâncimea blatului, cu cant de 2 mm pe față: se debitează cu 2 mm mai scurt decât adâncimea finită, dacă lucrezi cu dimensiuni finite și cant pe muchia din față.

Fiecare pas e clar. Problema apare când:

- clientul schimbă lățimea corpului;
- uiți o grosime pe o piesă dintre laterale;
- uiți cantul pe o muchie;
- transcrii lista într-un alt program și inversezi o cifră.

Într-o bucătărie cu zeci de piese, aceleași tipuri de calcule se repetă. O modificare cere, de obicei, să refaci lista — nu doar „piesele pe care crezi că le-ai atins”.

## În Mobilcab (același tip de proiect)

Deschizi aplicația în browser, pe laptop. Construiești corpul în 3D, cu dimensiunile pe care le folosești tu (inclusiv 600 mm lățime și grosimea de placă pe care o setezi în proiect).

![Proiectare 3D în Mobilcab — viewport cu corpuri din proiectul demo](/blog/corp-600/proiect-3d.png)

*Captură din aplicația locală (proiect demo bucătărie): același tip de flux — proiectare 3D în browser.*

Din proiect deschizi **lista de debitare**: piesele apar cu dimensiuni, cantități și materiale, din același model — fără să recalculezi manual fiecare panou pe o foaie separată.

![Listă de debitare în Mobilcab — panou Debitare pe același proiect](/blog/corp-600/lista-debitare.png)

*Aceeași sesiune: panoul Debitare deschis pe proiect.*

Dacă schimbi o dimensiune a corpului în proiect, piesele legate de ea se actualizează în model; lista de debitare pleacă din proiectul actualizat, nu dintr-o copie veche pe hârtie.

Salvezi în cloud. Poți exporta CSV sau `.mcab` când ai nevoie de fișier local.

## Ce rămâne la fel în ambele cazuri

Verifici înainte de tăiere. Grosimea plăcii, tipul de cant și modul de montaj (între laterale, falț, etc.) trebuie să fie cele pe care le-ai intenționat. Un program aplică consecvent ce i-ai spus — inclusiv o setare greșită.

## Ce nu comparăm aici

Nu comparăm viteza în minute. Comparăm **unde stă lista**: pe o foaie pe care o refaci la mână, sau în proiectul din care o generezi din nou după o modificare. Nesting-ul și exportul CNC nu intră în acest exemplu — pe Plan sunt etape ulterioare.
