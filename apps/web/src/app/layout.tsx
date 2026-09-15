import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'IncidentPulse AI — AI-Powered Incident Intelligence',
  description: 'Production Incident Management Platform for Engineering & DevOps teams'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-sky-500/20 selection:text-sky-400">
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster position="top-right" theme="dark" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
