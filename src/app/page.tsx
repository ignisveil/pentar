import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4">
        <section className="py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs tracking-[0.25em] uppercase text-white/60">Launching on pump.fun</div>
            <h1 className="mt-4 text-5xl md:text-6xl font-semibold leading-[1.02]">
              Five Forces.<br />
              <span className="bg-gradient-to-r from-fire to-gold bg-clip-text text-transparent">One Convergence.</span>
            </h1>
            <p className="mt-5 text-white/70 max-w-xl">
              Premium hybrid identity on Solana — luxury presence with ignition energy. Enter early. Ride the curve.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="https://pump.fun" target="_blank" className="btn btn-primary">Buy on pump.fun</Link>
              <Link href="/swap" className="btn btn-ghost">Swap</Link>
              <Link href="/chart" className="btn btn-ghost">Live chart</Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="glass rounded-2xl px-4 py-3">
                <div className="text-xs tracking-widest uppercase text-white/60">Chain</div>
                <div className="font-semibold">Solana</div>
              </div>
              <div className="glass rounded-2xl px-4 py-3">
                <div className="text-xs tracking-widest uppercase text-white/60">Supply</div>
                <div className="font-semibold">1,000,000,000</div>
              </div>
              <div className="glass rounded-2xl px-4 py-3">
                <div className="text-xs tracking-widest uppercase text-white/60">Mode</div>
                <div className="font-semibold">Fair Curve</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-[28px] p-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/assets/bracelet_mock.png"
                alt="PENTAR bracelet"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Luxury', 'Ignition', 'Momentum', 'Convergence'].map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="glass rounded-[28px] p-6 md:p-8">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold">FIVE FORCES</h2>
                <p className="mt-2 text-white/70">Each stone is a force. Together they become a signature people remember.</p>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                { name: 'OPALIS', title: 'Infinite Core', desc: 'The unpredictable center of attraction — the aura that keeps eyes locked.' },
                { name: 'PYROPEL', title: 'Flame Engine', desc: 'Momentum without hesitation — ignition, volatility, and raw drive.' },
                { name: 'AUREX', title: 'Golden Authority', desc: 'Stability and dominance — a signal that commands value and respect.' },
                { name: 'TWINVERDE', title: 'Expansion Drive', desc: 'Growth through alignment — compounding energy, clean progression.' },
                { name: 'AEONARA', title: 'Vision Field', desc: 'Clarity beyond cycles — seeing the narrative before the crowd does.' },
                { name: 'UNIFIED', title: 'Ascension Signature', desc: 'Five forces. One ascension. A luxury mark built to spread.' }
              ].map((c) => (
                <div key={c.name} className="glass rounded-2xl p-5">
                  <div className="text-xs tracking-widest uppercase text-white/60">{c.name}</div>
                  <div className="mt-2 text-2xl font-semibold">{c.title}</div>
                  <p className="mt-2 text-white/70">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
              <div className="text-white/60 text-sm">Ready to buy? Use the on-site swap (no iframe).</div>
              <Link href="/swap" className="btn btn-primary">Open Swap</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/60 flex items-center justify-between flex-wrap gap-2">
          <div>© {new Date().getFullYear()} PENTAR</div>
          <div>Built for Solana. Jupiter-powered swap.</div>
        </div>
      </footer>
    </>
  );
}
