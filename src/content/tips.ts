// Short "did you know" tips surfaced on the homepage, each pulled from a rule
// in the design-principles article and deep-linking to its heading there.

export type Tip = {
  title: string;
  body: string;
  /** Heading id in design-principles to deep-link to (see docToc's slugify). */
  anchor: string;
};

export const tips: Tip[] = [
  {
    title: "Never use pure black or pure white",
    body: "Near-black on near-white keeps the same contrast as pure black on white, with far less strain on the eye.",
    anchor: "1-never-use-pure-black-or-pure-white",
  },
  {
    title: "Saturate your neutrals",
    body: "Mixing a touch of your accent hue into flat grays makes the whole palette read as one coherent system.",
    anchor: "2-saturate-your-neutrals",
  },
  {
    title: "Measurements should be mathematically related",
    body: "A spacing scale like 4, 8, 12, 16, 24, 32 removes the need to ever guess a gap value again.",
    anchor: "11-measurements-should-be-mathematically-related",
  },
  {
    title: "Make drop-shadow blur values double their distance values",
    body: "A shadow with a 4px offset reads as natural light only with roughly an 8px blur — anything tighter looks like a hard-edged smudge.",
    anchor: "16-make-drop-shadow-blur-values-double-their-distance-values",
  },
  {
    title: "Use a line length around 70 characters",
    body: "Lines much longer than 70 characters make the eye lose its place tracking back to the start of the next line.",
    anchor: "21-use-a-line-length-around-70-characters",
  },
  {
    title: "Don't use shadows in dark interfaces",
    body: "Shadows are dark-on-light illusions of depth — on a dark background there's no light source for a shadow to make sense of.",
    anchor: "26-don-t-use-shadows-in-dark-interfaces",
  },
  {
    title: "One accent color, used deliberately",
    body: "Reserving a single color for interactive elements means users learn instantly what's clickable, everywhere on the site.",
    anchor: "29-one-accent-color-used-deliberately",
  },
];
