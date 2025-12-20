import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chacinar - Cuenta Corriente',
  description: 'Sistema de gestión de cuentas corrientes para Chacinar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
