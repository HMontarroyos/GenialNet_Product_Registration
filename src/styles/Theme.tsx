type Colors = {
  primary: string;
  secondary: string;
  tertiary: string;
  quartenary: string;
  text: string;
  dark: string;
};

type Fonts = {
  title: string;
  text: string;
};

type FontSizes = {
  small: string;
  medium: string;
  medium2: string;
  large: string;
  big: string;
};

type Spacing = {
  small: string;
  medium: string;
  large: string;
};

export type ThemeType = {
  colors: Colors;
  fonts: Fonts;
  fontSizes: FontSizes;
  spacing: Spacing;
};

export const Theme: ThemeType = {
  colors: {
    primary: "#092d67",
    secondary: "#007ebc",
    tertiary: "#007FC0",
    quartenary: "##00A6AE",
    text: "#ffffff",
    dark: "#D4D7E1",
  },
  fonts: {
    title: "Montserrat, sans-serif",
    text: "Open Sans sans-serif"

  },
  fontSizes: {
    small: "14px",
    medium: "26px",
    medium2: "36px",
    large: "96px",
    big: "128px",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
  },
};
