import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "../components/layout/AppShell";
import { ToastProvider } from "../components/ui/feedback/ToastProvider";
import { ThemeProvider } from "../components/theme/ThemeProvider";

const themeInitScript = `
(function() {
  try {
    var storageKey = 'enzo-theme-preference';
    var stored = localStorage.getItem(storageKey);
    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = (stored === 'light' || stored === 'dark' || stored === 'system') ? stored : 'system';
    var resolved = theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;
    document.documentElement.dataset.theme = resolved;
  } catch (error) {
    console.error('Failed to set initial theme', error);
  }
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enzo Mirror Operations",
  description:
    "Production console for managing mirror catalog, orders, and pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
