import NavBar from '@/components/NavBar';

export default function TokenPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-14">
        <div className="glass rounded-[28px] p-6 md:p-8">
          <h1 className="text-3xl font-semibold">Token</h1>
          <p className="mt-3 text-white/70">
            When your token mint is ready, you can switch the swap output mint to your token in one place.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-white/70 list-disc pl-5">
            <li>Default pair today: SOL → USDT</li>
            <li>Later: SOL → PENTAR (paste your mint address)</li>
          </ul>
        </div>
      </main>
    </>
  );
}
