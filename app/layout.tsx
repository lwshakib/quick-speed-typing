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
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GlobalModals } from "@/components/global-modals";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var themeId = localStorage.getItem('typing-theme') || 'default-dark';
                  var themes = {
                    'default-light': { background: '#ffffff', main: '#343434', caret: '#343434', sub: '#8b8b8b', text: '#252525', error: '#e11d48', errorExtra: '#7f1d1d' },
                    'default-dark': { background: '#121212', main: '#eeeeee', caret: '#eeeeee', sub: '#555555', text: '#eeeeee', error: '#e11d48', errorExtra: '#7f1d1d' },
                    'shadcn-dark': { background: '#030712', main: '#ffffff', caret: '#ffffff', sub: '#6b7280', text: '#f3f4f6', error: '#ef4444', errorExtra: '#7f1d1d' },
                    'shadcn-light': { background: '#ffffff', main: '#030712', caret: '#030712', sub: '#64748b', text: '#0f172a', error: '#ef4444', errorExtra: '#7f1d1d' },
                    'carbon-dark': { background: '#313131', main: '#f66e0d', caret: '#f66e0d', sub: '#616161', text: '#f5e6c8', error: '#da3333', errorExtra: '#791717' },
                    'carbon-light': { background: '#f5e6c8', main: '#f66e0d', caret: '#f66e0d', sub: '#918161', text: '#313131', error: '#da3333', errorExtra: '#791717' },
                    'lush-dark': { background: '#1d2021', main: '#8ec07c', caret: '#8ec07c', sub: '#665c54', text: '#ebdbb2', error: '#fb4934', errorExtra: '#cc241d' },
                    'lush-light': { background: '#ebdbb2', main: '#8ec07c', caret: '#8ec07c', sub: '#928374', text: '#282828', error: '#9d0006', errorExtra: '#cc241d' },
                    'nord-dark': { background: '#2e3440', main: '#88c0d0', caret: '#88c0d0', sub: '#4c566a', text: '#d8dee9', error: '#bf616a', errorExtra: '#a35058' },
                    'nord-light': { background: '#d8dee9', main: '#81a1c1', caret: '#81a1c1', sub: '#4c566a', text: '#2e3440', error: '#bf616a', errorExtra: '#a35058' },
                    'matrix-dark': { background: '#000000', main: '#15ff00', caret: '#15ff00', sub: '#003b00', text: '#d1d0c5', error: '#ff0000', errorExtra: '#790000' },
                    'matrix-light': { background: '#e0ffe0', main: '#008000', caret: '#008000', sub: '#66b266', text: '#003300', error: '#ff0000', errorExtra: '#790000' },
                    '9009-light': { background: '#eeebe2', main: '#080909', caret: '#080909', sub: '#99947f', text: '#080909', error: '#ca4754', errorExtra: '#793e44' },
                    '9009-dark': { background: '#2d2d2d', main: '#eeebe2', caret: '#eeebe2', sub: '#777777', text: '#eeebe2', error: '#ca4754', errorExtra: '#793e44' },
                    'dracula-dark': { background: '#282a36', main: '#bd93f9', caret: '#bd93f9', sub: '#6272a4', text: '#f8f8f2', error: '#ff5555', errorExtra: '#962323' },
                    'dracula-light': { background: '#f8f8f2', main: '#bd93f9', caret: '#bd93f9', sub: '#6272a4', text: '#282a36', error: '#ff5555', errorExtra: '#962323' },
                    'botanical-dark': { background: '#7b9c98', main: '#eaf1f3', caret: '#eaf1f3', sub: '#495e5b', text: '#eaf1f3', error: '#bca0dc', errorExtra: '#a186bf' },
                    'botanical-light': { background: '#eaf1f3', main: '#7b9c98', caret: '#7b9c98', sub: '#99b4b0', text: '#495e5b', error: '#bca0dc', errorExtra: '#a186bf' },
                    'bento-dark': { background: '#2d394d', main: '#ff7a90', caret: '#ff7a90', sub: '#4a5b73', text: '#fffaf4', error: '#ee2e3d', errorExtra: '#a31a26' },
                    'bento-light': { background: '#fffaf4', main: '#ff7a90', caret: '#ff7a90', sub: '#d9d0c7', text: '#2d394d', error: '#ee2e3d', errorExtra: '#a31a26' },
                    'pulse-dark': { background: '#181818', main: '#173f3f', caret: '#173f3f', sub: '#333333', text: '#e1e1e1', error: '#ca4754', errorExtra: '#793e44' },
                    'pulse-light': { background: '#e1e1e1', main: '#173f3f', caret: '#173f3f', sub: '#bbbbbb', text: '#181818', error: '#ca4754', errorExtra: '#793e44' },
                    'luna-dark': { background: '#221c35', main: '#f67599', caret: '#f67599', sub: '#5a3a7e', text: '#ffe3eb', error: '#ff4d4d', errorExtra: '#912626' },
                    'luna-light': { background: '#ffe3eb', main: '#f67599', caret: '#f67599', sub: '#d9b8c1', text: '#221c35', error: '#ff4d4d', errorExtra: '#912626' },
                    'catppuccin-dark': { background: '#1e1e2e', main: '#cba6f7', caret: '#cba6f7', sub: '#585b70', text: '#cdd6f4', error: '#f38ba8', errorExtra: '#eba0ac' },
                    'catppuccin-light': { background: '#eff1f5', main: '#8839ef', caret: '#8839ef', sub: '#9ca0b0', text: '#4c4f69', error: '#d20f39', errorExtra: '#e64553' },
                    'cyberpunk-dark': { background: '#000b1e', main: '#ff00ff', caret: '#ff00ff', sub: '#003b41', text: '#00ffea', error: '#ff0000', errorExtra: '#790000' },
                    'cyberpunk-light': { background: '#e0f7ff', main: '#ff00ff', caret: '#ff00ff', sub: '#a0d1e0', text: '#000b1e', error: '#ff0000', errorExtra: '#790000' },
                    'iceberg-dark': { background: '#161821', main: '#84a0c6', caret: '#84a0c6', sub: '#6b7089', text: '#c6c8d1', error: '#e27878', errorExtra: '#d15a5a' },
                    'iceberg-light': { background: '#e8eff5', main: '#84a0c6', caret: '#84a0c6', sub: '#b0becd', text: '#161821', error: '#e27878', errorExtra: '#d15a5a' },
                    'retro-light': { background: '#dad3b1', main: '#1d1d1d', caret: '#1d1d1d', sub: '#918b7d', text: '#1d1d1d', error: '#ca4754', errorExtra: '#793e44' },
                    'retro-dark': { background: '#1d1d1d', main: '#dad3b1', caret: '#dad3b1', sub: '#4a4a4a', text: '#dad3b1', error: '#ca4754', errorExtra: '#793e44' },
                    'paper-light': { background: '#eeeeee', main: '#444444', caret: '#444444', sub: '#b2b2b2', text: '#444444', error: '#d70000', errorExtra: '#af0000' },
                    'paper-dark': { background: '#111111', main: '#eeeeee', caret: '#eeeeee', sub: '#444444', text: '#eeeeee', error: '#d70000', errorExtra: '#af0000' },
                    'ocean-dark': { background: '#0f111a', main: '#3a62d1', caret: '#3a62d1', sub: '#4e5579', text: '#8f93a2', error: '#ff2424', errorExtra: '#ac0000' },
                    'ocean-light': { background: '#e6e9f0', main: '#3a62d1', caret: '#3a62d1', sub: '#9ea4b8', text: '#0f111a', error: '#ff2424', errorExtra: '#ac0000' },
                    'miami-dark': { background: '#24282f', main: '#f397d6', caret: '#f397d6', sub: '#758195', text: '#e9edf2', error: '#ff3a3a', errorExtra: '#ac0000' },
                    'miami-light': { background: '#e9edf2', main: '#f397d6', caret: '#f397d6', sub: '#758195', text: '#24282f', error: '#ff3a3a', errorExtra: '#ac0000' },
                    'slate-dark': { background: '#1a1b26', main: '#bb9af7', caret: '#bb9af7', sub: '#565f89', text: '#a9b1d6', error: '#f7768e', errorExtra: '#ff9e64' },
                    'slate-light': { background: '#a9b1d6', main: '#2ac3de', caret: '#2ac3de', sub: '#565f89', text: '#1a1b26', error: '#f7768e', errorExtra: '#ff9e64' }
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
                    root.style.setProperty('--primary-foreground', lightTheme ? '#000000' : '#ffffff');
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
          <div className="min-h-screen bg-background text-secondary font-mono selection:bg-primary/30 selection:text-primary transition-colors duration-300 flex flex-col items-center">
            <Header />
            <div className="flex-1 w-full flex flex-col items-center pt-[100px] pb-20">
              {children}
            </div>
            <Footer />
          </div>
          <GlobalModals />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
