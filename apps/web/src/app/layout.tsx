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
  title: 'IncidentPulse AI — AI-Powered Incident Intelligence',
  description: 'Production Incident Management Platform for Engineering & DevOps teams'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className={`${inter.className} antialiased selection:bg-zinc-800 selection:text-zinc-100`}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster position="top-right" theme="dark" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}

