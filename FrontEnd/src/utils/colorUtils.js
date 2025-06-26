const colorMap = {
  siyah: "#000000",
  beyaz: "#FFFFFF",
  kırmızı: "#E53935",
  mavi: "#1E88E5",
  yeşil: "#43A047",
  sarı: "#FDD835",
  turuncu: "#FB8C00",
  mor: "#8E24AA",
  pembe: "#D81B60",
  gri: "#757575",
  gümüş: "#BDBDBD",
  altın: "#FBC02D",
  lacivert: "#1A237E",
  kahverengi: "#6D4C41",
  turkuaz: "#00ACC1",

  black: "#000000",
  white: "#FFFFFF",
  red: "#E53935",
  blue: "#1E88E5",
  green: "#43A047",
  yellow: "#FDD835",
  orange: "#FB8C00",
  purple: "#8E24AA",
  pink: "#D81B60",
  gray: "#757575",
  silver: "#BDBDBD",
  gold: "#FBC02D",
  navy: "#1A237E",
  brown: "#6D4C41",
  turquoise: "#00ACC1",

  "space gray": "#5f5f5f",
  "uzay grisi": "#5f5f5f",
  midnight: "#2a2a2f",
  "gece yarısı": "#2a2a2f",
  starlight: "#f9f3ea",
  "yıldız ışığı": "#f9f3ea",
  "rose gold": "#B76E79",
  "gül kurusu": "#B76E79",
  grafit: "#383838",
  graphite: "#383838",
  "sierra blue": "#a7c1d9",
  "alpin yeşili": "#576d5e",
  "alpine green": "#576d5e",
};

export const getColorCode = (colorName, fallback = "#E0E0E0") => {
  if (!colorName || typeof colorName !== "string") {
    return fallback;
  }

  const normalizedColor = colorName.trim().toLowerCase();
  return colorMap[normalizedColor] || fallback;
};
