export type EventThemeId = "field-assembly" | "signal-forum" | "common-ground";

export interface EventTheme {
  id: EventThemeId;
  brandName: string;
  mark: string;
  tagline: string;
  programLabel: string;
  heroTitle: string;
  heroAccent: string;
  heroCopy: string;
  canvas: string;
  surface: string;
  ink: string;
  muted: string;
  border: string;
  accent: string;
  accentInk: string;
  headingFont: string;
  bodyFont: string;
  radius: string;
}

export const eventThemes: EventTheme[] = [
  {
    id: "field-assembly",
    brandName: "Field Assembly",
    mark: "FA",
    tagline: "Ideas for resilient futures",
    programLabel: "Field Assembly · Seasonal working sessions",
    heroTitle: "Change the season",
    heroAccent: "from the ground up.",
    heroCopy: "Soil health, food supply, and waterways: practical sessions rooted in place and built for shared work.",
    canvas: "#f1eee2",
    surface: "#e7e3d5",
    ink: "#202a21",
    muted: "#596253",
    border: "#7d7f6d",
    accent: "#315c3b",
    accentInk: "#ffffff",
    headingFont: "Georgia, 'Times New Roman', serif",
    bodyFont: "'Space Grotesk', Arial, sans-serif",
    radius: "2px",
  },
  {
    id: "signal-forum",
    brandName: "Signal Forum",
    mark: "SF",
    tagline: "Make technology more useful",
    programLabel: "Signal Forum · The practical technology conference",
    heroTitle: "Make technology work",
    heroAccent: "for real people.",
    heroCopy: "Engineering and design teams compare accessible interface patterns, useful systems, and sustainable open-web practice.",
    canvas: "#15191a",
    surface: "#202727",
    ink: "#f2f0e8",
    muted: "#b5beb7",
    border: "#74867a",
    accent: "#c9e86e",
    accentInk: "#172018",
    headingFont: "'Space Grotesk', Arial, sans-serif",
    bodyFont: "'Space Grotesk', Arial, sans-serif",
    radius: "0px",
  },
  {
    id: "common-ground",
    brandName: "Common Ground",
    mark: "CG",
    tagline: "Designing the public good",
    programLabel: "Common Ground · Civic design gatherings",
    heroTitle: "Design public places",
    heroAccent: "with neighbors.",
    heroCopy: "Practitioners work through public space, shared services, and community-led infrastructure with the people who use them.",
    canvas: "#f3e7dc",
    surface: "#fff9f1",
    ink: "#3b241d",
    muted: "#6b5146",
    border: "#8f6d5a",
    accent: "#963d28",
    accentInk: "#fff8ef",
    headingFont: "Georgia, 'Times New Roman', serif",
    bodyFont: "'Space Grotesk', Arial, sans-serif",
    radius: "14px",
  },
];
