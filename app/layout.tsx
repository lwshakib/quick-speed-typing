import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quick Type - The Ultimate Speed Typing Game",
  description: "Test and improve your typing speed and accuracy with interactive charts and progress tracking on Quick Type.",
   icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      { url: "/favicon_io/favicon.ico", sizes: "any", type: "image/x-icon" },
      {
        url: "/favicon_io/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon_io/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
  },
  manifest: "/favicon_io/site.webmanifest",
};

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CustomThemeManager } from "@/components/custom-theme-manager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var themeId = localStorage.getItem('typing-theme') || 'default-theme';
                  var themes = {
                    'default-theme': { background: '#ffffff', main: '#343434', caret: '#343434', sub: '#8b8b8b', text: '#252525', error: '#e11d48', errorExtra: '#7f1d1d' },
                    'shadcn': { background: '#030712', main: '#ffffff', caret: '#ffffff', sub: '#6b7280', text: '#f3f4f6', error: '#ef4444', errorExtra: '#7f1d1d' },
                    'serika-dark': { background: '#323437', main: '#e2b714', caret: '#e2b714', sub: '#646669', text: '#d1d0c5', error: '#ca4754', errorExtra: '#793e44' },
                    'carbon': { background: '#313131', main: '#f66e0d', caret: '#f66e0d', sub: '#616161', text: '#f5e6c8', error: '#da3333', errorExtra: '#791717' },
                    'lush': { background: '#1d2021', main: '#8ec07c', caret: '#8ec07c', sub: '#665c54', text: '#ebdbb2', error: '#fb4934', errorExtra: '#cc241d' },
                    'nord': { background: '#2e3440', main: '#88c0d0', caret: '#88c0d0', sub: '#4c566a', text: '#d8dee9', error: '#bf616a', errorExtra: '#a35058' },
                    'matrix': { background: '#000000', main: '#15ff00', caret: '#15ff00', sub: '#003b00', text: '#d1d0c5', error: '#ff0000', errorExtra: '#790000' },
                    '9009': { background: '#eeebe2', main: '#080909', caret: '#080909', sub: '#99947f', text: '#080909', error: '#ca4754', errorExtra: '#793e44' },
                    'dracula': { background: '#282a36', main: '#bd93f9', caret: '#bd93f9', sub: '#6272a4', text: '#f8f8f2', error: '#ff5555', errorExtra: '#962323' },
                    'botanical': { background: '#7b9c98', main: '#eaf1f3', caret: '#eaf1f3', sub: '#495e5b', text: '#eaf1f3', error: '#bca0dc', errorExtra: '#a186bf' },
                    'bento': { background: '#2d394d', main: '#ff7a90', caret: '#ff7a90', sub: '#4a5b73', text: '#fffaf4', error: '#ee2e3d', errorExtra: '#a31a26' },
                    'pulse': { background: '#181818', main: '#173f3f', caret: '#173f3f', sub: '#333333', text: '#e1e1e1', error: '#ca4754', errorExtra: '#793e44' },
                    'luna': { background: '#221c35', main: '#f67599', caret: '#f67599', sub: '#5a3a7e', text: '#ffe3eb', error: '#ff4d4d', errorExtra: '#912626' },
                    'catppuccin': { background: '#1e1e2e', main: '#cba6f7', caret: '#cba6f7', sub: '#585b70', text: '#cdd6f4', error: '#f38ba8', errorExtra: '#eba0ac' },
                    'cyberpunk': { background: '#000b1e', main: '#ff00ff', caret: '#ff00ff', sub: '#003b41', text: '#00ffea', error: '#ff0000', errorExtra: '#790000' },
                    'iceberg': { background: '#161821', main: '#84a0c6', caret: '#84a0c6', sub: '#6b7089', text: '#c6c8d1', error: '#e27878', errorExtra: '#d15a5a' },
                    'retro': { background: '#dad3b1', main: '#1d1d1d', caret: '#1d1d1d', sub: '#918b7d', text: '#1d1d1d', error: '#ca4754', errorExtra: '#793e44' },
                    'paper': { background: '#eeeeee', main: '#444444', caret: '#444444', sub: '#b2b2b2', text: '#444444', error: '#d70000', errorExtra: '#af0000' },
                    'ocean': { background: '#0f111a', main: '#3a62d1', caret: '#3a62d1', sub: '#4e5579', text: '#8f93a2', error: '#ff2424', errorExtra: '#ac0000' },
                    'miami': { background: '#24282f', main: '#f397d6', caret: '#f397d6', sub: '#758195', text: '#e9edf2', error: '#ff3a3a', errorExtra: '#ac0000' },
                    'slate': { background: '#1a1b26', main: '#bb9af7', caret: '#bb9af7', sub: '#565f89', text: '#a9b1d6', error: '#f7768e', errorExtra: '#ff9e64' }
                  };
                  
                  var themeData = null;
                  if (themeId === 'custom') {
                    themeData = JSON.parse(localStorage.getItem('custom-theme-colors'));
                  } else {
                    themeData = themes[themeId];
                  }
                  
                  if (themeData) {
                    var root = document.documentElement;
                    root.style.setProperty('--background', themeData.background);
                    root.style.setProperty('--main-color', themeData.main);
                    root.style.setProperty('--caret-color', themeData.caret);
                    root.style.setProperty('--sub-color', themeData.sub);
                    root.style.setProperty('--text-color', themeData.text);
                    root.style.setProperty('--error-color', themeData.error);
                    root.style.setProperty('--error-extra-color', themeData.errorExtra);
                    
                    root.style.setProperty('--foreground', themeData.text);
                    root.style.setProperty('--primary', themeData.main);
                    root.style.setProperty('--secondary', themeData.sub);
                    root.style.setProperty('--muted-foreground', themeData.sub);
                    root.style.setProperty('--accent', themeData.main);
                    root.style.setProperty('--ring', themeData.main);
                    root.style.setProperty('--destructive', themeData.error);
                    root.style.setProperty('--primary-foreground', themeData.background);
                    root.style.setProperty('--secondary-foreground', themeData.text);
                    root.style.setProperty('--accent-foreground', themeData.background);

                    // Add adaptive utility variables
                    var isLight = function(color) {
                      var hex = color.replace('#', '');
                      var r = parseInt(hex.substring(0, 2), 16);
                      var g = parseInt(hex.substring(2, 4), 16);
                      var b = parseInt(hex.substring(4, 6), 16);
                      var brightness = (r * 299 + g * 587 + b * 114) / 1000;
                      return brightness > 155;
                    };

                    var lightTheme = isLight(themeData.background);
                    root.style.setProperty('--muted', lightTheme ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)');
                    root.style.setProperty('--border', lightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)');
                    root.style.setProperty('--input', lightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)');
                    root.style.setProperty('--popover', themeData.background);
                    root.style.setProperty('--card', themeData.background);
                    root.style.setProperty('--popover-foreground', themeData.text);
                    root.style.setProperty('--card-foreground', themeData.text);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CustomThemeManager />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
