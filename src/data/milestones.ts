export type PortfolioMilestone = {
  id: string;
  year: number;
  title: string;
  track: "Fine Art" | "Graphic Design" | "Software" | "Music";
  summary: string;
  deliverables: string[];
  location?: string;
};

export type MilestonePayload = {
  schemaVersion: 1;
  milestones: PortfolioMilestone[];
};

export const milestonePayload: MilestonePayload = {
  schemaVersion: 1,
  milestones: [
    {
      id: "drawing-roots",
      year: 2009,
      title: "Foundational Drawing Studies",
      track: "Fine Art",
      summary:
        "Daily graphite and ink studies established recurring themes around geometry, myth, and landscape memory.",
      deliverables: ["Elephant", "Phi Tree", "Illusion"],
      location: "NSW",
    },
    {
      id: "album-visual-identity",
      year: 2013,
      title: "Album Artwork Systems",
      track: "Graphic Design",
      summary:
        "Built art direction systems for music projects combining hand drawing with digital compositing.",
      deliverables: ["Wolf Conduit", "The MD of the MC", "State Raelien"],
      location: "Remote",
    },
    {
      id: "mixed-media-series",
      year: 2015,
      title: "Mixed Media Expansion",
      track: "Fine Art",
      summary:
        "Moved into larger mixed-media pieces with acrylic, oil, and marker workflows on board and canvas.",
      deliverables: ["Recliner", "Impermenance EP", "Elva Metadata"],
      location: "North Coast",
    },
    {
      id: "exhibition-prep",
      year: 2019,
      title: "Portfolio Consolidation",
      track: "Graphic Design",
      summary:
        "Standardized crop treatments and naming conventions to align gallery cards, social sharing, and catalog exports.",
      deliverables: ["Gulaga", "Boneless", "Our Colin"],
      location: "Bermagui",
    },
    {
      id: "software-practice",
      year: 2023,
      title: "Creative Tools and Web Pipeline",
      track: "Software",
      summary:
        "Developed and refactored the portfolio stack to unify content schemas, static assets, and responsive delivery.",
      deliverables: ["Next.js + Payload migration", "Route architecture", "Image-first artwork pages"],
      location: "Studio",
    },
    {
      id: "cross-discipline",
      year: 2026,
      title: "Cross-Discipline Continuum",
      track: "Music",
      summary:
        "Current phase merges visual composition and sound release cycles with software-led publishing infrastructure.",
      deliverables: ["Timeline-driven storytelling", "Interactive hero studies", "Release node planning"],
      location: "Australia",
    },
  ],
};
