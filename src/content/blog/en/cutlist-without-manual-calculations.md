---
title: "How to make a cut list without calculating by hand"
description: "Where paper cut lists go wrong, how to avoid that, and what changes when the list comes from the 3D project. A 600 mm cabinet example — and what’s ready now in Mobilcab versus CNC export on the Roadmap."
date: "2026-11-09"
published: true
---

The cut list is the bridge between the design and the workshop (and, later, the machine). If it’s correct, everything else is easier. If it has a mistake, you often find out only when the board is already cut.

## Why it’s easy to get wrong by hand

A base cabinet looks simple: sides, bottom, maybe a shelf, back, door. Every size depends on others:

- **board thickness** is subtracted from the width of parts between the sides;
- **edging** is subtracted from the cut size if you work with finished dimensions;
- **door gaps** come off the front;
- the **back** depends on how it’s fitted (rebate, groove, applied).

Example: base cabinet **600 mm**, **18 mm chipboard**, **2 mm ABS** edging on the front edge:

- sides: 2 pieces at the cabinet height and depth;
- bottom between the sides: **600 − 2 × 18 = 564 mm** width;
- depth with edging on the front: cut 2 mm shorter than the finished depth, if that’s how you work.

The steps are simple. The problem is volume and client changes. The same kind of calculation is in [600 mm cabinet: paper vs. Mobilcab](/en/blog/600mm-cabinet-paper-vs-mobilcab/).

## The four most common mistakes

1. **Thickness subtracted only once** — between two sides you lose two thicknesses.
2. **Edging forgotten** on an edge.
3. **Change propagated halfway** — the door changed, the shelf didn’t.
4. **Transcription** — the list is right on paper, a digit flips in the optimiser or at the machine.

## How to cut mistakes even without software

- One **single source** (a table with formulas, not rewritten numbers).
- For every part: **edging on which edges**.
- After any change: **rebuild the list**, not only “the parts you think you touched”.
- **Check before cutting**.

## What a list from the 3D project changes

When the cut list is tied to the model, a width change updates the dependent parts in the project. The list comes from the current model, not from an old paper copy.

That **doesn’t** replace checking: the software applies what you set — including a wrong thickness. The difference is you verify settings once, not dozens of times on the sheet.

## How Mobilcab does it now

In [Mobilcab](/en/), on a laptop in the browser, from the project you open the **cut list**: sizes, quantities, materials — on the Free plan, in the Cut list stage. You can export CSV or a local project (`.mcab`) when you need to. Step by step: [from project to list](/en/blog/from-project-to-cut-list/).

**Dedicated CNC export** (machine files) is on the [Roadmap](/en/roadmap/) as a later stage (after stable nesting), on the CNC plan — not included in Cut list now. The cut list is the foundation; nesting and the machine file come in order.

Checking before cutting stays yours.
