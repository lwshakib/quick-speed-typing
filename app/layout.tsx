// Import necessary types and components from Next.js and local files
import type { Metadata } from 'next';
// Import various fonts from Google Fonts via Next.js Font Optimization
import {
  Geist,
  Geist_Mono,
  Noto_Sans_Bengali,
  Hind_Siliguri,
  Hind,
  Amiri,
  Noto_Sans_JP,
} from 'next/font/google';
// Import global CSS styles
import './globals.css';

// Configure Geist Sans font with a CSS variable and latin subset
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Configure Geist Mono font for code-like typography
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Configure Noto Sans Bengali for Bengali script support
const notoBengali = Noto_Sans_Bengali({
  variable: '--font-noto-bengali',
  subsets: ['bengali'],
  weight: ['400', '700'],
});

// Configure Hind Siliguri as another option for Bengali typography
const hindSiliguri = Hind_Siliguri({
  variable: '--font-hind-siliguri',
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
});

// Configure Hind font for Hindi/Devanagari script support
const hindHindi = Hind({
  variable: '--font-hind',
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
});

// Configure Amiri font for elegant Arabic script support
const amiriArabic = Amiri({
  variable: '--font-amiri',
  subsets: ['arabic'],
  weight: ['400', '700'],
});

// Configure Noto Sans JP for Japanese/CJK script support
const notoCJK = Noto_Sans_JP({
  variable: '--font-noto-cjk',
  subsets: ['latin'],
  weight: ['400', '700'],
});

// Metadata object for SEO and browser tab configuration
export const metadata: Metadata = {
  title: 'Quicktype - The Ultimate Speed Typing Game', // Page title shown in the browser tab
  description:
    'Test and improve your typing speed and accuracy with interactive charts and progress tracking on Quick Type.', // Meta description for SEO
  icons: {
    // Favicon configurations for various devices and sizes
    icon: [
      {
        url: '/favicon_io/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon_io/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      { url: '/favicon_io/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      {
        url: '/favicon_io/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/favicon_io/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: '/favicon_io/apple-touch-icon.png', // Apple Touch Icon for iOS devices
  },
  manifest: '/favicon_io/site.webmanifest', // Web App Manifest for PWA support
};

// Import UI components and providers
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { CustomThemeManager } from '@/components/custom-theme-manager';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GlobalModals } from '@/components/global-modals';
import { SettingsSync } from '@/components/settings-sync';

// Root Layout component that wraps the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Root HTML element with basic styling and hydration warning suppression
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body
        // Apply font CSS variables to the body so they can be used throughout the app
        className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable} ${hindSiliguri.variable} ${hindHindi.variable} ${amiriArabic.variable} ${notoCJK.variable} antialiased`}
      >
        {/*
          Inline script to prevent theme "flash" on page load.
          It reads the theme from localStorage and applies CSS variables immediately.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Retrieve the saved theme ID from localStorage
                  var themeId = localStorage.getItem('typing-theme') || 'default-dark';
                  
                  // Comprehensive map of predefined themes and their color palettes
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
                  // Support for user-defined custom themes
                  if (themeId === 'custom') {
                    themeData = JSON.parse(localStorage.getItem('custom-theme-colors'));
                  } else {
                    themeData = themes[themeId];
                  }
                  
                  // If theme data exists, apply colors to CSS variables on the root element
                  if (themeData) {
                    var root = document.documentElement;
                    root.style.setProperty('--background', themeData.background);
                    root.style.setProperty('--main-color', themeData.main);
                    root.style.setProperty('--caret-color', themeData.caret);
                    root.style.setProperty('--sub-color', themeData.sub);
                    root.style.setProperty('--text-color', themeData.text);
                    root.style.setProperty('--error-color', themeData.error);
                    root.style.setProperty('--error-extra-color', themeData.errorExtra);
                    
                    // Also update standard Shadcn UI variables for compatibility with UI components
                    root.style.setProperty('--foreground', themeData.text);
                    root.style.setProperty('--primary', themeData.main);
                    root.style.setProperty('--secondary', themeData.sub);
                    root.style.setProperty('--muted-foreground', themeData.sub);
                    root.style.setProperty('--accent', themeData.main);
                    root.style.setProperty('--ring', themeData.main);
                    root.style.setProperty('--destructive', themeData.error);
 
                    // Utility function to determine if a color is light or dark based on its hex value
                    var isLight = function(color) {
                      var hex = color.replace('#', '');
                      var r = parseInt(hex.substring(0, 2), 16);
                      var g = parseInt(hex.substring(2, 4), 16);
                      var b = parseInt(hex.substring(4, 6), 16);
                      // Calculate brightness using standard formula
                      var brightness = (r * 299 + g * 587 + b * 114) / 1000;
                      return brightness > 155;
                    };
 
                    var lightTheme = isLight(themeData.background);
                    // Dynamically set secondary variables based on background brightness
                    root.style.setProperty('--muted', lightTheme ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)');
                    root.style.setProperty('--border', lightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)');
                    root.style.setProperty('--input', lightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)');
                    root.style.setProperty('--popover', themeData.background);
                    root.style.setProperty('--card', themeData.background);
                    root.style.setProperty('--popover-foreground', themeData.text);
                    root.style.setProperty('--card-foreground', themeData.text);
                    root.style.setProperty('--primary-foreground', lightTheme ? '#000000' : '#ffffff');
                  }
                } catch (e) {
                  // Ignore errors to ensure the page still loads even if theme logic fails
                }
              })();
            `,
          }}
        />
        {/* Next.js ThemeProvider for managing data-theme attributes */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SettingsSync />
          <CustomThemeManager />
          {/* Main application container with shared styles */}
          <div className="bg-background text-secondary selection:bg-primary/30 selection:text-primary flex min-h-screen flex-col items-center font-mono transition-colors duration-300">
            {/* Global site header */}
            <Header />

            {/* Main content area where page components are rendered */}
            <div className="flex w-full flex-1 flex-col items-center pt-[100px] pb-20">
              {children}
            </div>

            {/* Global site footer */}
            <Footer />
          </div>

          {/* Global modals like Login, Settings, etc. */}
          <GlobalModals />

          {/* Toast notifications provider */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
