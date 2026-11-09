---
title: "A 600 mm cabinet: on paper vs. in Mobilcab"
description: "The same 600 mm base cabinet example, 18 mm chipboard: what you calculate by hand for the cut list, and how the same kind of project goes through 3D design and cut list in Mobilcab."
date: "2026-11-09"
published: true
---

Take a simple example used often in the workshop: a **base cabinet** **600 mm** wide, **18 mm chipboard**, with **2 mm ABS** edging on the front edge. It isn’t a whole kitchen — it’s one cabinet, so you can see where the work shows up.

## On paper (or in Excel)

Sides: two parts at the cabinet height and depth.

Bottom, fitted between the sides: cut width is  
**600 − 2 × 18 = 564 mm**.

Bottom depth, with 2 mm edging on the front: cut 2 mm shorter than the finished depth if you work with finished sizes and edging on the front edge.

Each step is clear. The problem appears when:

- the client changes the cabinet width;
- you forget a thickness on a part between the sides;
- you forget edging on an edge;
- you copy the list into another program and flip a digit.

In a kitchen with dozens of parts, the same kinds of calculations repeat. A change usually means rebuilding the list — not only “the parts you think you touched”.

## In Mobilcab (the same kind of project)

Open the app in the browser, on a laptop. Build the cabinet in 3D with the sizes you use (including 600 mm width and the board thickness you set in the project).

![3D design in Mobilcab — viewport with cabinets from the demo project](/blog/corp-600/proiect-3d.png)

*Screenshot from the local app (kitchen demo project): the same kind of flow — 3D design in the browser.*

From the project you open the **cut list**: parts appear with sizes, quantities, and materials, from the same model — without recalculating each panel by hand on a separate sheet.

![Cut list in Mobilcab — Cut list panel on the same project](/blog/corp-600/lista-debitare.png)

*Same session: Cut list panel open on the project.*

If you change a cabinet size in the project, parts tied to it update in the model; the cut list comes from the updated project, not from an old paper copy.

Save to the cloud. You can export CSV or `.mcab` when you need a local file.

## What stays the same in both cases

You check before cutting. Board thickness, edging type, and how parts are fitted (between sides, rebate, etc.) must be what you intended. Software applies consistently what you told it — including a wrong setting.

## What we don’t compare here

We don’t compare speed in minutes. We compare **where the list lives**: on a sheet you rebuild by hand, or in the project you regenerate it from after a change. Nesting and CNC export aren’t in this example — on the Roadmap they’re later stages.
