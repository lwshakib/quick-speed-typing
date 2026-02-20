export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    main: string;
    caret: string;
    sub: string;
    text: string;
    error: string;
    errorExtra: string;
  };
}

export const THEMES: Theme[] = [
  {
    id: "serika-dark",
    name: "serika dark",
    colors: {
      background: "#323437",
      main: "#e2b714",
      caret: "#e2b714",
      sub: "#646669",
      text: "#d1d0c5",
      error: "#ca4754",
      errorExtra: "#793e44",
    },
  },
  {
    id: "carbon",
    name: "carbon",
    colors: {
      background: "#313131",
      main: "#f66e0d",
      caret: "#f66e0d",
      sub: "#616161",
      text: "#f5e6c8",
      error: "#da3333",
      errorExtra: "#791717",
    },
  },
  {
    id: "lush",
    name: "lush",
    colors: {
      background: "#1d2021",
      main: "#8ec07c",
      caret: "#8ec07c",
      sub: "#665c54",
      text: "#ebdbb2",
      error: "#fb4934",
      errorExtra: "#cc241d",
    },
  },
  {
    id: "nord",
    name: "nord",
    colors: {
      background: "#2e3440",
      main: "#88c0d0",
      caret: "#88c0d0",
      sub: "#4c566a",
      text: "#d8dee9",
      error: "#bf616a",
      errorExtra: "#a35058",
    },
  },
  {
    id: "matrix",
    name: "matrix",
    colors: {
      background: "#000000",
      main: "#15ff00",
      caret: "#15ff00",
      sub: "#003b00",
      text: "#d1d0c5",
      error: "#ff0000",
      errorExtra: "#790000",
    },
  },
  {
    id: "9009",
    name: "9009",
    colors: {
      background: "#eeebe2",
      main: "#080909",
      caret: "#080909",
      sub: "#99947f",
      text: "#080909",
      error: "#ca4754",
      errorExtra: "#793e44",
    },
  },
  {
    id: "dracula",
    name: "dracula",
    colors: {
      background: "#282a36",
      main: "#bd93f9",
      caret: "#bd93f9",
      sub: "#6272a4",
      text: "#f8f8f2",
      error: "#ff5555",
      errorExtra: "#962323",
    },
  },
  {
      id: "botanical",
      name: "botanical",
      colors: {
          background: "#7b9c98",
          main: "#eaf1f3",
          caret: "#eaf1f3",
          sub: "#495e5b",
          text: "#eaf1f3",
          error: "#bca0dc",
          errorExtra: "#a186bf",
      }
  },
  {
    id: "bento",
    name: "bento",
    colors: {
      background: "#2d394d",
      main: "#ff7a90",
      caret: "#ff7a90",
      sub: "#4a5b73",
      text: "#fffaf4",
      error: "#ee2e3d",
      errorExtra: "#a31a26",
    },
  },
  {
    id: "pulse",
    name: "pulse",
    colors: {
      background: "#181818",
      main: "#173f3f",
      caret: "#173f3f",
      sub: "#333333",
      text: "#e1e1e1",
      error: "#ca4754",
      errorExtra: "#793e44",
    },
  },
  {
    id: "luna",
    name: "luna",
    colors: {
      background: "#221c35",
      main: "#f67599",
      caret: "#f67599",
      sub: "#5a3a7e",
      text: "#ffe3eb",
      error: "#ff4d4d",
      errorExtra: "#912626",
    },
  },
  {
    id: "catppuccin",
    name: "catppuccin",
    colors: {
      background: "#1e1e2e",
      main: "#cba6f7",
      caret: "#cba6f7",
      sub: "#585b70",
      text: "#cdd6f4",
      error: "#f38ba8",
      errorExtra: "#eba0ac",
    },
  },
  {
    id: "cyberpunk",
    name: "cyberpunk",
    colors: {
      background: "#000b1e",
      main: "#ff00ff",
      caret: "#ff00ff",
      sub: "#003b41",
      text: "#00ffea",
      error: "#ff0000",
      errorExtra: "#790000",
    },
  },
  {
    id: "iceberg",
    name: "iceberg",
    colors: {
      background: "#161821",
      main: "#84a0c6",
      caret: "#84a0c6",
      sub: "#6b7089",
      text: "#c6c8d1",
      error: "#e27878",
      errorExtra: "#d15a5a",
    },
  },
  {
    id: "retro",
    name: "retro",
    colors: {
      background: "#dad3b1",
      main: "#1d1d1d",
      caret: "#1d1d1d",
      sub: "#918b7d",
      text: "#1d1d1d",
      error: "#ca4754",
      errorExtra: "#793e44",
    },
  },
  {
    id: "paper",
    name: "paper",
    colors: {
      background: "#eeeeee",
      main: "#444444",
      caret: "#444444",
      sub: "#b2b2b2",
      text: "#444444",
      error: "#d70000",
      errorExtra: "#af0000",
    },
  },
  {
    id: "ocean",
    name: "ocean",
    colors: {
      background: "#0f111a",
      main: "#3a62d1",
      caret: "#3a62d1",
      sub: "#4e5579",
      text: "#8f93a2",
      error: "#ff2424",
      errorExtra: "#ac0000",
    },
  },
  {
    id: "miami",
    name: "miami",
    colors: {
      background: "#24282f",
      main: "#f397d6",
      caret: "#f397d6",
      sub: "#758195",
      text: "#e9edf2",
      error: "#ff3a3a",
      errorExtra: "#ac0000",
    },
  },
  {
    id: "slate",
    name: "slate",
    colors: {
      background: "#1a1b26",
      main: "#bb9af7",
      caret: "#bb9af7",
      sub: "#565f89",
      text: "#a9b1d6",
      error: "#f7768e",
      errorExtra: "#ff9e64",
    },
  },
];
