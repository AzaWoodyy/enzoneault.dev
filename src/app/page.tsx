import Image from "next/image";
import { AsciiField } from "./ascii-field";
import { ScrollThread } from "./scroll-thread";
import footer from "~/assets/footer-landscape.jpg";
import { education, experience, footerAlt, languages, links, profile, projects, type TimelineEntry, tools } from "~/content";

function SectionTitle({ children }: { children: string }) {
  return <h2 className="font-mono text-[0.6875rem] tracking-wide text-ink/65 uppercase">{children}</h2>;
}

function Timeline({ entries }: { entries: readonly TimelineEntry[] }) {
  return (
    <ol className="mt-5 space-y-6">
      {entries.map((entry) => (
        <li key={`${entry.period}-${entry.place}`} data-thread-dot className="grid gap-x-6 gap-y-1 sm:grid-cols-[7.5rem_1fr]">
          <span className="pt-0.5 font-mono text-[0.75rem] text-ink/65 tabular-nums">{entry.period}</span>
          <div>
            <p className="font-medium text-ink">
              {entry.title} <span className="font-normal text-ink/65">· {entry.place}</span>
            </p>
            {entry.note && <p className="text-[0.8125rem] text-ink/65">{entry.note}</p>}
            <p className="mt-1.5 text-pretty text-[0.8125rem] text-ink/72">{entry.details.join(" · ")}</p>
            {entry.stack && <p className="mt-1.5 font-mono text-[0.6875rem] text-ink/65">{entry.stack.join(" · ")}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

// Structured data for search engines: who Enzo is, where he works, and where to find him.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: "https://www.enzoneault.dev",
  image: "https://www.enzoneault.dev/icon.webp",
  address: { "@type": "PostalAddress", addressLocality: "Annecy", addressCountry: "FR" },
  worksFor: { "@type": "Organization", name: "Web Expert Business" },
  alumniOf: education.map((entry) => ({ "@type": "EducationalOrganization", name: entry.place })),
  knowsAbout: tools,
  sameAs: links.map((link) => link.href),
};

export default function Home() {
  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} />
      <AsciiField />
      <div aria-hidden="true" className="ascii-texture pointer-events-none absolute inset-0 -z-10" />
      <ScrollThread />
      <main className="mx-auto w-full max-w-[38rem] flex-1 px-8 sm:px-6 pt-24 pb-24 text-[0.9375rem] leading-relaxed">
        <header className="reveal-lift [--i:0] flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <h1 className="font-serif text-4xl tracking-tight text-ink">{profile.name}</h1>
            <p className="mt-1 text-ink/72">{profile.role}</p>
          </div>
          <dl className="border-l border-dotted border-ink/25 pl-3 font-mono text-[0.6875rem] leading-5 tracking-wide text-ink/65 uppercase sm:text-right">
            <dt className="sr-only">Lieu</dt>
            <dd className="text-ink/70">{profile.location}</dd>
            <dt className="sr-only">Coordonnées</dt>
            <dd>{profile.coordinates}</dd>
            <dt className="sr-only">Fuseau horaire</dt>
            <dd>{profile.timezone}</dd>
          </dl>
        </header>

        <p className="reveal-lift [--i:1] mt-12 text-pretty text-ink/78">{profile.intro}</p>

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
                    <span className="font-medium text-ink">{project.name}</span>
                    <span className="font-mono text-[0.6875rem] text-ink/65 transition-colors group-hover:text-ink/90">
                      {project.stack} ↗
                    </span>
                  </span>
                  <span className="mt-1 block text-pretty text-[0.8125rem] text-ink/72">{project.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section data-thread="education" className="reveal [--i:4] mt-16">
          <SectionTitle>Formation</SectionTitle>
          <Timeline entries={education} />
        </section>

        <dl className="reveal [--i:5] mt-16 space-y-4 text-[0.8125rem]">
          {[
            { label: "Outils", value: tools.join(" · ") },
            { label: "Langues", value: languages.join(" · ") },
          ].map((row) => (
            <div key={row.label} className="grid gap-x-6 gap-y-1 sm:grid-cols-[7.5rem_1fr]">
              <dt className="pt-0.5 font-mono text-[0.6875rem] tracking-wide text-ink/65 uppercase">{row.label}</dt>
              <dd className="text-ink/72">{row.value}</dd>
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
                  <span className="font-mono text-[0.6875rem] text-ink/65 transition-colors group-hover:text-ink/90">
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
        {/* Darken the bottom of the image just enough for the footer text to read on any part of it. */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/55 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[38rem] justify-between px-8 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6 text-[0.8125rem] text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.45)]">
          <span>© 2026 {profile.name}</span>
          <span className="font-mono text-white/85">enzoneault.dev</span>
        </div>
      </footer>
    </div>
  );
}
