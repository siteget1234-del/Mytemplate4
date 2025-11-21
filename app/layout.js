import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'श्री गणेश कृषी केंद्र - पिंपळगाव बसवंत',
  description: 'कृषी उत्पादने, बियाणे, खते, संरक्षण साधने - नाशिक, महाराष्ट्र',
};

export default function RootLayout({ children }) {
  return (
    <html lang="mr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}