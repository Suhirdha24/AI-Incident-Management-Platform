import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/authContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'OpsAI — Incident Management Platform',
  description: 'Production Incident Management Platform for Engineering & DevOps teams'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={`${inter.className} antialiased selection:bg-neutral-200 selection:text-neutral-900 bg-[#F7F5F1] text-neutral-900`}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster position="top-right" theme="light" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}


