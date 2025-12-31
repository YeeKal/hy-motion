export const DEFAULT_ASPECTRATIO = "auto"

export const BaseRatios = [
  { label: "Auto", value: "auto", size: { width: 1024, height: 1024 } }, // Default to square if no aspect ratio is provided
  { label: "Square(1:1)", value: "1:1", size: { width: 1024, height: 1024 } },
  { label: "Portrait(3:4)", value: "3:4", size: { width: 768, height: 1024 } },
  { label: "Landscape(16:9)", value: "16:9", size: { width: 1280, height: 720 } },
  { label: "Standard(4:3)", value: "4:3", size: { width: 1024, height: 768 } },
  { label: "Vertical(9:16)", value: "9:16", size: { width: 720, height: 1280 } },
  { label: "Ultrawide(21:9)", value: "21:9", size: { width: 1536, height: 640 } },
  { label: "Ultra-vertical(9:21)", value: "9:21", size: { width: 640, height: 1536 } },
];