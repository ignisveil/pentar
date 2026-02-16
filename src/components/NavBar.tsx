'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function NavBar() {
  const pathname = usePathname();

  const Item = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={clsx(
        'text-sm tracking-widest uppercase px-3 py-2 rounded-xl border border-transparent',
        pathname === href ? 'bg-white/10 border-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-fire shadow-glow" />
          <span className="font-semibold tracking-wide">pentar</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Item href="/" label="Story" />
          <Item href="/swap" label="Swap" />
          <Item href="/chart" label="Chart" />
          <Item href="/token" label="Token" />
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/chart" className="btn btn-ghost">Chart</Link>
          <Link href="/swap" className="btn btn-primary">Buy</Link>
        </div>
      </div>
    </header>
  );
}
