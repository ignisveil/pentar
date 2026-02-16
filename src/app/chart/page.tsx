import NavBar from '@/components/NavBar';

export default function ChartPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <div className="glass rounded-[28px] p-6 md:p-8">
          <h1 className="text-3xl font-semibold">Chart</h1>
          <p className="mt-3 text-white/70">
            Plug in your preferred chart provider (DexScreener / Birdeye / GeckoTerminal) once your token is live.
          </p>
          <div className="mt-6 text-sm text-white/60">
            Tip: if you want a live embed, tell me which chart URL you want to use.
          </div>
        </div>
      </main>
    </>
  );
}
