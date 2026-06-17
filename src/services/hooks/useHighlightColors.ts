import {
  amber,
  blush,
  dune,
  dustyrose,
  ember,
  harvest,
  inkwell,
  lavender,
  mist,
  moor,
  peach,
  periwinkle,
  sage,
  sand,
  shore,
  thistle,
} from "@/theme/colors";

export const highlightBackgroundColors = {
  amber,
  sage,
  dustyrose,
  periwinkle,
  lavender,
  peach,
  mist,
  sand,
};

export type HighlightBackgroundColors = {
  [key in keyof typeof highlightBackgroundColors]: (typeof highlightBackgroundColors)[key];
};

export const highlightTextColors: HighlightBackgroundColors = {
  amber: harvest,
  sage: moor,
  dustyrose: blush,
  periwinkle: inkwell,
  lavender: thistle,
  peach: ember,
  mist: shore,
  sand: dune,
};

export const getHighlightColor = (color: keyof HighlightBackgroundColors) => {
  return {
    backgroundColor: highlightBackgroundColors[color],
    color: highlightTextColors[color],
  };
};

export const getHighlightColorList = () => {
  return Object.keys(highlightBackgroundColors);
};

export const getHighlightColors = () => {
  return Object.keys(highlightBackgroundColors).map((color) => ({
    id: color,
    backgroundColor:
      highlightBackgroundColors[color as keyof HighlightBackgroundColors],
    color: highlightTextColors[color as keyof HighlightBackgroundColors],
  }));
};
