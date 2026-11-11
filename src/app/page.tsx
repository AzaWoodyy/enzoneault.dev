import Image from "next/image";
import { AsciiField } from "./ascii-field";
import { ScrollThread } from "./scroll-thread";
import footer from "~/assets/footer-landscape.jpg";
import { education, experience, footerAlt, languages, links, profile, projects, type TimelineEntry, tools } from "~/content";

function SectionTitle({ children }: { children: string }) {
  return <h2 className="font-mono text-[11px] tracking-wide text-ink/40 uppercase">{children}</h2>;
}

function Timeline({ entries }: { entries: readonly TimelineEntry[] }) {
  return (
    <ol className="mt-5 space-y-6">
      {entries.map((entry) => (
        <li key={`${entry.period}-${entry.place}`} data-thread-dot className="grid gap-x-6 gap-y-1 sm:grid-cols-[7.5rem_1fr]">
          <span className="pt-0.5 font-mono text-[12px] text-ink/40 tabular-nums">{entry.period}</span>
          <div>
            <p className="text-ink">
              {entry.title} <span className="text-ink/45">· {entry.place}</span>
            </p>
            {entry.note && <p className="text-[13px] text-ink/45">{entry.note}</p>}
            <p className="mt-1.5 text-[13px] text-ink/55">{entry.details.join(" · ")}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Home() {
  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <AsciiField />
      <ScrollThread />
      <main className="mx-auto w-full max-w-[38rem] flex-1 px-6 pt-24 pb-24 text-[15px] leading-relaxed">
        <header className="reveal [--i:0] flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <h1 className="font-serif text-4xl tracking-tight text-ink">{profile.name}</h1>
            <p className="mt-1 text-ink/55">{profile.role}</p>
          </div>
          <dl className="border-l border-dotted border-ink/25 pl-3 font-mono text-[11px] leading-5 text-ink/40 uppercase sm:text-right">
            <dt className="sr-only">Lieu</dt>
            <dd className="text-ink/70">{profile.location}</dd>
            <dt className="sr-only">Coordonnées</dt>
            <dd>{profile.coordinates}</dd>
            <dt className="sr-only">Fuseau horaire</dt>
            <dd>{profile.timezone}</dd>
          </dl>
        </header>

        <p className="reveal [--i:1] mt-12 text-ink/65">{profile.intro}</p>

        <section data-thread="experience" className="reveal [--i:2] mt-16">
          <SectionTitle>Expérience</SectionTitle>
          <Timeline entries={experience} />
        </section>

        <section className="reveal [--i:3] mt-16">
          <SectionTitle>Projets</SectionTitle>
          <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
            {projects.map((project) => (
              <li key={project.href}>
                <a href={project.href} className="group block py-4">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="text-ink">{project.name}</span>
                    <span className="font-mono text-[11px] text-ink/35 transition-colors group-hover:text-ink/70">
                      {project.stack} ↗
                    </span>
                  </span>
                  <span className="mt-1 block text-[13px] text-ink/55">{project.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section data-thread="education" className="reveal [--i:4] mt-16">
          <SectionTitle>Formation</SectionTitle>
          <Timeline entries={education} />
        </section>

        <dl className="reveal [--i:5] mt-16 space-y-4 text-[13px]">
          {[
            { label: "Outils", value: tools.join(" · ") },
            { label: "Langues", value: languages.join(" · ") },
          ].map((row) => (
            <div key={row.label} className="grid gap-x-6 gap-y-1 sm:grid-cols-[7.5rem_1fr]">
              <dt className="pt-0.5 font-mono text-[11px] tracking-wide text-ink/40 uppercase">{row.label}</dt>
              <dd className="text-ink/55">{row.value}</dd>
            </div>
          ))}
        </dl>

        <section className="reveal [--i:6] mt-16">
          <SectionTitle>Ailleurs</SectionTitle>
          <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="group flex items-center justify-between py-3 text-ink">
                  {link.label}
                  <span className="font-mono text-[12px] text-ink/35 transition-colors group-hover:text-ink/70">
                    {link.href.replace(/^https:\/\/(www\.)?/, "")} ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
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
