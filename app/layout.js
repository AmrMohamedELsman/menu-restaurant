import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import ScrollToTop from '@/components/ScrollToTop';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'قائمة المطعم الإلكترونية',
  description: 'قائمة طعام إلكترونية احترافية لمطعمك',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
          <ScrollToTop /> {/* إضافة زر العودة إلى الأعلى */}
        </LanguageProvider>
      </body>
    </html>
  );
}