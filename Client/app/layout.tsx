import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/provider";
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ContentPanel } from "@/components/ContentPanel";
import { SideBarContentPanel } from "@/components/SidebarContentPanel";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notebook-LM",
  description: "Summarize any docs or website with AI Powered Tool",
};

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
      <Providers>
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
        <SidebarProvider
        style={{
            "--sidebar-width": "21rem",
            "--sidebar-width-mobile": "18rem",
        } as React.CSSProperties}
        defaultOpen={false}
        >
          <SideBarContentPanel/>
          <main className="w-full">
               {children}
          </main>
        </SidebarProvider>
        <Toaster />
      </ThemeProvider>
      </Providers>
      </body>
    </html>
  );
}
