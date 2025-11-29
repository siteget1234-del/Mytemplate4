import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'योगेश कृषी केंद्र - किनगाव अहमदपूर',
  description: 'योगेश कृषी सेवा केंद्र, किनगाव (अहमदपूर, लातूर) येथे बियाणे, खते, कीटकनाशके, तणनाशके, स्प्रे पंप, कृषी हार्डवेअर आणि सर्व कृषी उत्पादने उपलब्ध. विश्वासार्ह सेवा आणि योग्य मार्गदर्शन.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="mr">
    <head>
        <meta
          name="google-site-verification"
          content="u-r9HkP998MQZv_is0kOAseLjYitBbQIETaoxPGVl64"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
