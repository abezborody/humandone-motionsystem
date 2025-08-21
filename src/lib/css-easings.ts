export interface Easing {
  name: string;
  value: string;
  previewValue: string;
}

export const CSS_EASINGS: Easing[] = [
  {
    name: "Ease Out",
    value: "ease-out",
    previewValue: "ease-out",
  },
  {
    name: "Ease Out Custom",
    value: "cubic-bezier(0.2, 0, 0, 1)",
    previewValue: "0.2, 0, 0, 1",
  },
  {
    name: "Ease In&Out",
    value: "cubic-bezier(0.73, 0.01, 0.23, 0.99)",
    previewValue: "0.73, 0.01, 0.23, 0.99",
  },
  {
    name: "Ease In",
    value: "ease-in",
    previewValue: "ease-in",
  },
];
