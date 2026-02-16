import type { Metadata } from 'next';
import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import SolanaProviders from '@/components/SolanaProviders';

export const metadata: Metadata = {
  title: 'PENTAR — Five Forces. One Convergence.',
  description: 'PENTAR is a premium hybrid identity on Solana — luxury presence with ignition energy.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SolanaProviders>
          <div className="relative min-h-screen">
            <div className="particle" />
            {children}
          </div>
        </SolanaProviders>
      </body>
    </html>
  );
}
