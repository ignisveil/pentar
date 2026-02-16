import NavBar from '@/components/NavBar';
import SwapCard from '@/components/SwapCard';

export default function SwapPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-semibold">Swap (On-Site)</h1>
        <p className="mt-2 text-white/70">
          Connect Phantom and swap instantly — powered by Jupiter API. Mobile-first, no iframe.
        </p>
        <div className="mt-8">
          <SwapCard />
        </div>
      </main>
    </>
  );
}
