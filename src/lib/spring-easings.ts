export interface SpringConfig {
  name: string;
  stiffness: number;
  damping: number;
  description?: string;
}

export const SPRING_CONFIGS: SpringConfig[] = [
  {
    name: "Reveal",
    stiffness: 330,
    damping: 30,
    description: "330/30",
  },
  {
    name: "Hide",
    stiffness: 330,
    damping: 35,
    description: "330/35",
  },
  {
    name: "Gentle",
    stiffness: 200,
    damping: 25,
    description: "Soft landing for subtle movements",
  },
  {
    name: "Tight",
    stiffness: 500,
    damping: 30,
    description: "Quick with minimal oscillation",
  },
];
