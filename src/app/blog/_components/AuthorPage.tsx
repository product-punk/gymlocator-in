import Link from 'next/link'
import Image from 'next/image'
import type { Author, BlogPost } from '@/lib/contentful'
import PostCard, { resolveImgUrl, initials } from './PostCard'

function Badge({ icon, children, verified }: { icon: string; children: React.ReactNode; verified?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-[7px] text-[12px] font-semibold px-3 py-[7px] rounded-[8px] ${
        verified
          ? 'bg-accent-dim text-accent'
          : 'bg-raised border-[0.5px] border-border text-text-secondary'
      }`}
    >
      <i className={`ti ${icon} text-[15px]`} />
      {children}
    </span>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-[38px] h-[38px] rounded-[8px] border-[0.5px] border-border bg-surface flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all duration-150"
    >
      <i className={`ti ${icon}`} />
    </a>
  )
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-base px-5 py-[18px]">
      <div className="text-[22px] font-extrabold tracking-[-0.5px] text-text">{value}</div>
      <div className="label !text-text-muted mt-1">{label}</div>
    </div>
  )
}

export default function AuthorPage({ author, posts }: { author: Author; posts: BlogPost[] }) {
  const { fields } = author
  // photo?.fields is missing when the linked asset is a draft (unresolved link)
  const photoUrl = resolveImgUrl(fields.photo?.fields?.file?.url)

  const socials = [
    { href: fields.linkedin, icon: 'ti-brand-linkedin', label: 'LinkedIn' },
    { href: fields.twitter, icon: 'ti-brand-x', label: 'Twitter' },
    { href: fields.instagram, icon: 'ti-brand-instagram', label: 'Instagram' },
    { href: fields.website, icon: 'ti-world', label: 'Website' },
  ].filter((s): s is { href: string; icon: string; label: string } => Boolean(s.href))

  const stats = [
    { value: String(posts.length), label: `Article${posts.length !== 1 ? 's' : ''}` },
    fields.gymsReviewed ? { value: fields.gymsReviewed, label: 'Gyms reviewed' } : null,
    fields.totalReads ? { value: fields.totalReads, label: 'Reads' } : null,
  ].filter((s): s is { value: string; label: string } => s !== null)

  const bioParagraphs = fields.bio?.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean) ?? []

  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="bb-hair">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-9 pb-12">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-[12px] text-text-muted mb-7">
            <Link href="/" className="hover:text-text-secondary transition-colors">Home</Link>
            <span className="text-text-disabled">/</span>
            <Link href="/blog" className="hover:text-text-secondary transition-colors">Blog</Link>
            <span className="text-text-disabled">/</span>
            <span className="text-text-secondary">{fields.name}</span>
          </nav>

          <div className="flex flex-col gap-7">
            <div className="flex flex-wrap gap-7 items-start">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-[20px] border-[0.5px] border-border overflow-hidden relative flex-none bg-raised">
                {photoUrl ? (
                  <Image
                    src={`${photoUrl}?w=256&h=256&fit=fill`}
                    alt={fields.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[28px] font-bold text-accent">
                    {initials(fields.name)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-[260px]">
                <div className="label mb-2.5">Author</div>
                <h1 className="h1 !text-[40px]">{fields.name}</h1>
                {fields.designation && (
                  <p className="mt-2 text-[15px] font-medium text-text-secondary">{fields.designation}</p>
                )}

                {/* Credentials */}
                {(fields.verified || (fields.credentials?.length ?? 0) > 0) && (
                  <div className="flex flex-wrap gap-2.5 mt-5">
                    {fields.verified && (
                      <Badge icon="ti-rosette-discount-check-filled" verified>
                        Verified Contributor
                      </Badge>
                    )}
                    {fields.credentials?.map(c => (
                      <Badge key={c} icon="ti-certificate">
                        {c}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Social links */}
                {socials.length > 0 && (
                  <div className="flex gap-2 mt-[18px]">
                    {socials.map(s => (
                      <SocialLink key={s.label} href={s.href} icon={s.icon} label={s.label} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stat strip */}
            <div
              className="grid gap-px bg-border border-[0.5px] border-border rounded-[12px] overflow-hidden max-w-[560px]"
              style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
            >
              {stats.map(s => (
                <StatCell key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      {(bioParagraphs.length > 0 || fields.quote) && (
        <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-12">
          <div className="max-w-[720px]">
            <div className="label mb-3.5">About</div>
            <div className="text-[16px] leading-[1.75] text-text-secondary space-y-6">
              {bioParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {fields.quote && (
                <blockquote className="border-l-[3px] border-accent pl-6 py-1 text-[21px] leading-[1.5] font-medium tracking-[-0.3px] text-text">
                  &ldquo;{fields.quote}&rdquo;
                </blockquote>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Articles */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-16">
        <div className="flex items-end justify-between gap-6 mb-7">
          <div>
            <div className="label mb-2">Written by {fields.name.split(' ')[0]}</div>
            <h2 className="h2">Latest articles</h2>
          </div>
        </div>
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-text-muted text-[15px]">No articles yet - check back soon.</p>
            <Link
              href="/blog"
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
            >
              <i className="ti ti-arrow-left" />
              Back to all articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(p => (
              <PostCard key={p.sys.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
