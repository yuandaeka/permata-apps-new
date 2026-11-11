import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "aceh-primary": "#1B4332",
        "aceh-secondary": "#D4AF37",
        "aceh-background": "#F0F4F2",
        "minang-primary": "#7B0000",
        "minang-secondary": "#FFD700",
        "minang-background": "#FDF5E6",
      },
    },
  },
  plugins: [],
};

export default config;
