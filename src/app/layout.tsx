import './globals.css';

export const metadata = {
  title: 'Cidadão Ativo',
  description: 'Plataforma de participação cidadã e engajamento cívico',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}