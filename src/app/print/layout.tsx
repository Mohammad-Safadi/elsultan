import '../globals.css';

export const metadata = {
  title: 'Elsultan Halls - Print Quote',
};

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&family=Tajawal:wght@400;500;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`
              @media print {
                body {
                  font-family: 'Tajawal', sans-serif !important;
                  background: white !important;
                  color: black !important;
                }
                .no-print {
                  display: none !important;
                }
                .category-section {
                  page-break-inside: avoid;
                }
                * {
                  box-shadow: none !important;
                  text-shadow: none !important;
                }
              }
            `}</style>
        </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
