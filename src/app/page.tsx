import Image from "next/image";
import footer from "~/assets/footer-landscape.jpg";
import { footerAlt, links, profile } from "~/content";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-[38rem] flex-1 px-6 pt-24 pb-24 text-[15px] leading-relaxed">
        <header className="reveal [--i:0] flex items-baseline justify-between gap-6">
          <div>
            <h1 className="font-serif text-4xl tracking-tight text-ink">{profile.name}</h1>
            <p className="mt-1 text-ink/55">{profile.role}</p>
          </div>
          <span className="hidden -rotate-3 font-mono text-[11px] text-ink/40 sm:block">↙ salut, c’est moi</span>
        </header>

        <p className="reveal [--i:1] mt-12 text-ink/65">{profile.intro}</p>

        <div className="reveal [--i:2] mt-10 border-l border-ink/15 pl-4">
          <p className="font-mono text-[11px] tracking-wide text-ink/40 uppercase">En ce moment</p>
          <p className="mt-1 text-ink/65">{profile.now}</p>
        </div>

        <ul className="reveal [--i:3] mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="group flex items-center justify-between py-3 text-ink">
                {link.label}
                <span className="font-mono text-[12px] text-ink/35 transition-colors group-hover:text-ink/70">
                  {link.href.replace("https://", "")} ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>

      <footer className="relative h-[38vh] max-h-[26rem] min-h-60 overflow-hidden">
        <div className="footer-settle fade-top absolute inset-0">
          <Image src={footer} alt={footerAlt} fill sizes="100vw" placeholder="blur" className="object-cover" />
        </div>
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[38rem] justify-between px-6 pb-5 text-[13px] text-white/85">
          <span>© 2026 {profile.name}</span>
          <span className="font-mono text-white/60">enzoneault.dev</span>
        </div>
      </footer>
    </div>
  );
}
