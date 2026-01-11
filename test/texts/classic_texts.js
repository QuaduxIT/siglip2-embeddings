// Copyright © 2025-2026 Quadux IT GmbH
//    ____                  __              __________   ______          __    __  __
//   / __ \__  ______ _____/ /_  ___  __   /  _/_  __/  / ____/___ ___  / /_  / / / /
//  / / / / / / / __ `/ __  / / / / |/_/   / /  / /    / / __/ __ `__ \/ __ \/ /_/ /
// / /_/ / /_/ / /_/ / /_/ / /_/ />  <   _/ /  / /    / /_/ / / / / / / /_/ / __  /
// \___\_\__,_/\__,_/\__,_/\__,_/_/|_|  /___/ /_/     \____/_/ /_/ /_/_.___/_/ /_/
// License: Quadux files Apache 2.0 (see LICENSE), SigLIP model: Apache 2.0 (Google)
// Author: Walter Hoffmann

/**
 * Classical Texts Collection
 * 
 * German: Original works by Goethe and Schiller (Public Domain)
 * English: Longfellow, Wordsworth, Keats, Blake (Public Domain)
 * 
 * See texts/SOURCES.md for full citations and references
 */

export const TEXTS = {
  // ═══════════════════════════════════════════════════════════════
  // JOHANN WOLFGANG VON GOETHE (1749-1832)
  // ═══════════════════════════════════════════════════════════════

  mailied: {
    title: "Mailied",
    author: "Johann Wolfgang von Goethe",
    year: 1771,
    source: "Goethes Werke, Hamburger Ausgabe, Bd. 1, S. 29",
    url: "https://www.deutschelyrik.de/mailied.html",
    text: `Wie herrlich leuchtet
Mir die Natur!
Wie glänzt die Sonne!
Wie lacht die Flur!

Es dringen Blüten
Aus jedem Zweig
Und tausend Stimmen
Aus dem Gesträuch

Und Freud und Wonne
Aus jeder Brust.
O Erd, o Sonne!
O Glück, o Lust!`,
    expectedImage: "spring",
    theme: "Frühling, Natur, Blüten, Sonne",
    themeEnglish: "spring, nature, flowers, sun"
  },

  faust: {
    title: "Faust I - Nacht",
    author: "Johann Wolfgang von Goethe",
    year: 1808,
    source: "Goethes Werke, Hamburger Ausgabe, Bd. 3, S. 20",
    url: "https://www.projekt-gutenberg.org/goethe/faust1/faust1.html",
    text: `Habe nun, ach! Philosophie,
Juristerei und Medizin,
Und leider auch Theologie
Durchaus studiert, mit heißem Bemühn.
Da steh ich nun, ich armer Tor!
Und bin so klug als wie zuvor;
Heiße Magister, heiße Doktor gar
Und ziehe schon an die zehen Jahr
Herauf, herab und quer und krumm
Meine Schüler an der Nase herum –
Und sehe, daß wir nichts wissen können!`,
    expectedImage: "books",
    theme: "Studium, Bücher, Gelehrsamkeit, Wissenschaft",
    themeEnglish: "study, books, scholarship, science"
  },

  reineke: {
    title: "Reineke Fuchs - Erster Gesang",
    author: "Johann Wolfgang von Goethe",
    year: 1794,
    source: "Goethes Werke, Hamburger Ausgabe, Bd. 2, S. 285",
    url: "https://www.projekt-gutenberg.org/goethe/reineke/reineke.html",
    text: `Pfingsten, das liebliche Fest, war gekommen;
Es grünten und blühten Feld und Wald;
Auf Hügeln und Höhn, in Büschen und Hecken
Übten ein fröhliches Lied die neuermunterten Vögel;
Jede Wiese sproßte von Blumen
In duftenden Farben geschmückt,
Und auf jedem Zweige saßen die Vögel und sangen.`,
    expectedImage: "birds",
    theme: "Vögel, Gesang, Zweige, Natur, Pfingsten",
    themeEnglish: "birds, singing, branches, nature, Pentecost"
  },

  erlkoenig: {
    title: "Erlkönig",
    author: "Johann Wolfgang von Goethe",
    year: 1782,
    source: "Goethes Werke, Hamburger Ausgabe, Bd. 1, S. 154",
    url: "https://www.deutschelyrik.de/erlkoenig.html",
    text: `Wer reitet so spät durch Nacht und Wind?
Es ist der Vater mit seinem Kind;
Er hat den Knaben wohl in dem Arm,
Er faßt ihn sicher, er hält ihn warm.

Mein Sohn, was birgst du so bang dein Gesicht? –
Siehst, Vater, du den Erlkönig nicht?
Den Erlenkönig mit Kron und Schweif? –
Mein Sohn, es ist ein Nebelstreif.`,
    expectedImage: "nature",
    theme: "Nacht, Wind, Nebel, Wald, düster",
    themeEnglish: "night, wind, fog, forest, dark"
  },

  // ═══════════════════════════════════════════════════════════════
  // FRIEDRICH SCHILLER (1759-1805)
  // ═══════════════════════════════════════════════════════════════

  buergschaft: {
    title: "Die Bürgschaft",
    author: "Friedrich Schiller",
    year: 1798,
    source: "Schillers Werke, Nationalausgabe, Bd. 1, S. 369",
    url: "https://www.deutschelyrik.de/die-buergschaft.html",
    text: `Und die Sonne versendet glühenden Brand,
Und von der unendlichen Mühe ermattet,
Erliegt er am Ende, er kann nicht mehr.
Da treibt ihn die Angst, da faßt er sich Mut
Und wirft sich hinein in die brausende Flut
Und teilt mit gewaltigen Armen den Strom,
Und ein Gott hat Erbarmen.
Und das Ufer gewinnet er schwimmend und klimmt
Und danket dem rettenden Gotte.`,
    expectedImage: "river",
    theme: "Fluss, Strom, Flut, Schwimmen, Wasser",
    themeEnglish: "river, stream, flood, swimming, water"
  },

  glocke: {
    title: "Das Lied von der Glocke",
    author: "Friedrich Schiller",
    year: 1799,
    source: "Schillers Werke, Nationalausgabe, Bd. 1, S. 429",
    url: "https://www.projekt-gutenberg.org/schiller/glocke/glocke.html",
    text: `Fest gemauert in der Erden
Steht die Form, aus Lehm gebrannt.
Heute muß die Glocke werden,
Frisch, Gesellen, seid zur Hand!
Von der Stirne heiß
Rinnen muß der Schweiß,
Soll das Werk den Meister loben,
Doch der Segen kommt von oben.

Zum Werke, das wir ernst bereiten,
Geziemt sich wohl ein ernstes Wort;
Wenn gute Reden sie begleiten,
Dann fließt die Arbeit munter fort.`,
    expectedImage: "blacksmith",
    theme: "Handwerk, Schmieden, Feuer, Arbeit, Gießen",
    themeEnglish: "craft, forging, fire, work, casting"
  },

  // ═══════════════════════════════════════════════════════════════
  // ENGLISH CLASSICS (Public Domain)
  // ═══════════════════════════════════════════════════════════════

  blacksmith_longfellow: {
    title: "The Village Blacksmith",
    author: "Henry Wadsworth Longfellow",
    year: 1840,
    source: "Ballads and Other Poems, 1841",
    url: "https://www.poetryfoundation.org/poems/44644/the-village-blacksmith",
    text: `Under a spreading chestnut-tree
The village smithy stands;
The smith, a mighty man is he,
With large and sinewy hands;
And the muscles of his brawny arms
Are strong as iron bands.

His hair is crisp, and black, and long,
His face is like the tan;
His brow is wet with honest sweat,
He earns whate'er he can,
And looks the whole world in the face,
For he owes not any man.`,
    expectedImage: "blacksmith",
    theme: "blacksmith, forge, iron, work, strength",
    themeEnglish: "blacksmith, forge, iron, work, strength"
  },

  daffodils_wordsworth: {
    title: "I Wandered Lonely as a Cloud",
    author: "William Wordsworth",
    year: 1807,
    source: "Poems, in Two Volumes, 1807",
    url: "https://www.poetryfoundation.org/poems/45521/i-wandered-lonely-as-a-cloud",
    text: `I wandered lonely as a cloud
That floats on high o'er vales and hills,
When all at once I saw a crowd,
A host, of golden daffodils;
Beside the lake, beneath the trees,
Fluttering and dancing in the breeze.

Continuous as the stars that shine
And twinkle on the milky way,
They stretched in never-ending line
Along the margin of a bay:
Ten thousand saw I at a glance,
Tossing their heads in sprightly dance.`,
    expectedImage: "spring",
    theme: "daffodils, flowers, spring, nature, dancing",
    themeEnglish: "daffodils, flowers, spring, nature, dancing"
  },

  nightingale_keats: {
    title: "A Bird came down the Walk",
    author: "Emily Dickinson",
    year: 1862,
    source: "Poems by Emily Dickinson, 1890",
    url: "https://www.poetryfoundation.org/poems/52083/a-bird-came-down-the-walk-359",
    text: `A Bird came down the Walk—
He did not know I saw—
He bit an Angleworm in halves
And ate the fellow, raw,

And then he drank a Dew
From a convenient Grass—
And then hopped sidewise to the Wall
To let a Beetle pass—

He glanced with rapid eyes
That hurried all around—
They looked like frightened Beads, I thought—
He stirred his Velvet Head.`,
    expectedImage: "birds",
    theme: "bird, walking, eating, grass, nature",
    themeEnglish: "bird, walking, eating, grass, nature"
  },

  tyger_blake: {
    title: "Jubilate Agno - For I will consider my Cat Jeoffry",
    author: "Christopher Smart",
    year: 1760,
    source: "Jubilate Agno, Fragment B, lines 695-768",
    url: "https://www.poetryfoundation.org/poems/45173/jubilate-agno",
    text: `For I will consider my Cat Jeoffry.
For he is the servant of the Living God duly and daily serving him.
For having done duty and received blessing he begins to consider himself.
For this he performs in ten degrees.
For first he looks upon his forepaws to see if they are clean.
For secondly he kicks up behind to clear away there.
For thirdly he works it upon stretch with the forepaws extended.
For fourthly he sharpens his paws by wood.
For fifthly he washes himself.
For sixthly he rolls upon wash.`,
    expectedImage: "cat",
    theme: "cat, paws, washing, grooming, pet",
    themeEnglish: "cat, paws, washing, grooming, pet"
  },
};

// ═══════════════════════════════════════════════════════════════
// Helper functions
// ═══════════════════════════════════════════════════════════════

export function getTextKeys() {
  return Object.keys(TEXTS);
}

export function getTextContents() {
  return Object.values(TEXTS).map(t => t.text);
}

export function getTextByKey(key) {
  return TEXTS[key];
}

export function getTextsByAuthor(author) {
  return Object.entries(TEXTS)
    .filter(([, t]) => t.author.includes(author))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

export function getGermanTexts() {
  return Object.entries(TEXTS)
    .filter(([, t]) => t.author.includes("Goethe") || t.author.includes("Schiller"))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

export function getEnglishTexts() {
  return Object.entries(TEXTS)
    .filter(([, t]) => !t.author.includes("Goethe") && !t.author.includes("Schiller"))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

export function getGoetheTexts() {
  return getTextsByAuthor("Goethe");
}

export function getSchillerTexts() {
  return getTextsByAuthor("Schiller");
}
