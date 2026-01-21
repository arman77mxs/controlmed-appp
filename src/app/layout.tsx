import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ControlMed - Control de Medicamentos",
  description: "Aplicación para gestionar tus tratamientos médicos y recibir recordatorios",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ControlMed",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Soporte para pantallas con bordes curvos (Samsung S25 Ultra)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ToastProvider>
          <div className="aurora-bg" />
          <div className="page-container">
            {children}
          </div>
          <BottomNav />
        </ToastProvider>
      </body>
    </html>
  );
}
