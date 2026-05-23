// xuanx ai — page components for the TTY site.
// Receives a shared style bundle prop set from TTYShell.
//
// Each page is intentionally not "$ command output" — it uses normal page
// composition (hero, cards, lists, prose), but stays in the terminal font
// palette so the site still feels of-a-piece.

function TTYPage(p) {
  const { route } = p;
  if (route.section === 'home')       return <HomePage {...p} />;
  if (route.section === 'writing')    return route.slug ? <PostPage {...p} /> : <WritingIndex {...p} />;
  if (route.section === 'prototypes') return <PrototypesPage {...p} />;
  if (route.section === 'projects')   return <ProjectsPage {...p} />;
  if (route.section === 'changelog')  return <ChangelogPage {...p} />;
  if (route.section === 'about')      return <AboutPage {...p} />;
  if (route.section === 'contact')    return <ContactPage {...p} />;
  return <HomePage {...p} />;
}

// ─── shared bits ────────────────────────────────────────────────────────────

function Breadcrumb({ T, A, monoF, fs, pad, parts, cmd = 'cd .' }) {
  return (
    <div style={{
      fontFamily: monoF, fontSize: fs - 2,
      padding: `14px ${pad}px`, borderBottom: `1px solid ${T.rule}`,
      display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      background: T.panel,
    }}>
      <span style={{ color: A, fontWeight: 600 }}>{META.shellUser}@{META.shellHost}</span>
      <span style={{ color: T.dim2 }}>:</span>
      <span style={{ color: T.dim }}>~/{parts.join('/')}</span>
      <span style={{ color: A, marginLeft: 4 }}>$</span>
      <span style={{ color: T.dim2 }}>{cmd}</span>
    </div>
  );
}

function PageHead({ T, A, monoF, serif, fs, sectGap, kicker, title, subtitle }) {
  return (
    <div style={{ marginBottom: sectGap }}>
      <div style={{ fontFamily: monoF, fontSize: 10.5, letterSpacing: '.18em', color: A, textTransform: 'uppercase', marginBottom: 12 }}>
        // {kicker}
      </div>
      <h1 style={{
        fontFamily: monoF, fontSize: 38, fontWeight: 600, color: T.ink,
        margin: 0, letterSpacing: '-.015em', lineHeight: 1.1,
      }}>{title}</h1>
      {subtitle && (
        <div style={{ fontFamily: serif, fontSize: fs + 4, color: T.ink, lineHeight: 1.5, marginTop: 16, maxWidth: 700 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function Rule({ T, monoF, fs, sectGap, note }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: `${sectGap}px 0 ${Math.max(20, sectGap - 16)}px` }}>
      <div style={{ flex: 1, borderTop: `1px dashed ${T.rule}` }} />
      {note && (
        <>
          <div style={{ fontFamily: monoF, fontSize: fs - 3, color: T.dim2, letterSpacing: '.18em', textTransform: 'uppercase' }}>
            {note}
          </div>
          <div style={{ flex: 1, borderTop: `1px dashed ${T.rule}` }} />
        </>
      )}
    </div>
  );
}

// ─── HOME ───────────────────────────────────────────────────────────────────

function HomePage(p) {
  const { T, A, isLight, monoF, serif, fs, pad, sectGap, itemGap, setRoute, isEN, t } = p;
  return (
    <>
      <Breadcrumb {...p} parts={[t.breadcrumb.home]} cmd={t.homeCmd} />
      <div style={{ padding: `${pad + 12}px ${pad}px ${pad + 24}px`, maxWidth: 980 }}>

        {/* Hero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: A, boxShadow: `0 0 12px ${A}88` }} />
          <span style={{ fontFamily: monoF, fontSize: fs - 2, color: T.dim, letterSpacing: '.16em', textTransform: 'uppercase' }}>
            {t.onlineLabel}
          </span>
        </div>
        <h1 style={{
          fontFamily: monoF, fontWeight: 600, fontSize: 64, color: A,
          margin: 0, letterSpacing: '-.025em', lineHeight: 1,
        }}>
          xuanx ai
          <span style={{ display: 'inline-block', width: 8, height: 44, background: A, marginLeft: 10, verticalAlign: '-4px', animation: 'tty-blink 1.1s steps(2) infinite' }} />
        </h1>
        <style>{'@keyframes tty-blink{0%,49%{opacity:1}50%,100%{opacity:0}}'}</style>

        {/* Latest-post pull-quote — auto-refreshes when a new POST is added */}
        <LatestPullquote {...p} />

        {/* Quick links */}
        <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
          {[
            { label: t.quickLinks.writing,    to: 'writing'    },
            { label: t.quickLinks.prototypes, to: 'prototypes' },
            { label: t.quickLinks.projects,   to: 'projects'   },
          ].map((b, i) => (
            <button key={i} onClick={() => setRoute({ section: b.to, slug: null })}
              style={{
                fontFamily: monoF, fontSize: fs - 1, color: T.ink, fontWeight: 500,
                background: 'transparent', border: `1px solid ${T.rule}`,
                padding: '9px 14px', borderRadius: 4, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'border-color .15s, color .15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = A; e.currentTarget.style.color = A; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.rule; e.currentTarget.style.color = T.ink; }}
            >
              <span>{b.label}</span>
              <span style={{ marginLeft: 4 }}>→</span>
            </button>
          ))}
        </div>

        <Rule {...p} note={isEN ? 'latest writing' : '最新博客'} />

        {/* Recent posts list */}
        <div>
          {POSTS.slice(0, 4).map((post, i) => (
            <div
              key={post.slug}
              onClick={() => setRoute({ section: 'writing', slug: post.slug })}
              style={{
                padding: `${itemGap + 6}px 0`,
                borderTop: i === 0 ? 'none' : `1px solid ${T.rule}`,
                cursor: 'pointer',
                display: 'grid', gridTemplateColumns: '100px 1fr 80px', gap: 28, alignItems: 'baseline',
              }}
              onMouseEnter={(e) => { e.currentTarget.querySelector('[data-title]').style.color = A; }}
              onMouseLeave={(e) => { e.currentTarget.querySelector('[data-title]').style.color = T.ink; }}
            >
              <div style={{ fontFamily: monoF, fontSize: fs - 2, color: T.dim, paddingTop: 4 }}>{post.date}</div>
              <div>
                <div data-title style={{
                  fontFamily: monoF, fontSize: fs + 4, color: T.ink, fontWeight: 500,
                  marginBottom: 6, transition: 'color .15s', letterSpacing: '-.005em',
                }}>
                  {isEN ? post.title_en : post.title_zh}
                </div>
                <div style={{ fontFamily: serif, fontSize: fs + 2, color: T.dim, lineHeight: 1.55, maxWidth: 640 }}>
                  {isEN ? post.excerpt_en : post.excerpt_zh}
                </div>
              </div>
              <div style={{ fontFamily: monoF, fontSize: fs - 2, color: T.dim2, textAlign: 'right' }}>
                <div style={{ color: A }}>{post.topic}</div>
                <div style={{ marginTop: 6 }}>{post.reading} min</div>
              </div>
            </div>
          ))}
          <div style={{
            paddingTop: itemGap + 6, borderTop: `1px solid ${T.rule}`,
            fontFamily: monoF, fontSize: fs - 1, color: T.dim, cursor: 'pointer',
          }}
            onClick={() => setRoute({ section: 'writing', slug: null })}
            onMouseEnter={(e) => { e.currentTarget.style.color = A; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.dim; }}
          >
            → {isEN ? `all writing (${POSTS.length})` : `全部博客（${POSTS.length} 篇）`}
          </div>
        </div>

        {/* /now panel */}
        <Rule {...p} note={t.nowKicker} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: T.rule }}>
          {NOW.map((n, i) => (
            <div key={i} style={{ background: T.panel, padding: '18px 18px 20px' }}>
              <div style={{ fontFamily: monoF, fontSize: 10, color: T.dim2, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 8 }}>
                · {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ fontFamily: monoF, fontSize: fs, color: T.ink, lineHeight: 1.5 }}>
                {isEN ? n.en : n.zh}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

window.TTYPage = TTYPage;
window.Breadcrumb = Breadcrumb;
window.PageHead = PageHead;
window.Rule = Rule;

// LatestPullquote — surfaces the most recent post's excerpt as a serif
// pull-quote with attribution. "Dynamic" in that whenever a new post is added
// to POSTS at the top of the array, this auto-updates.
function LatestPullquote(p) {
  const { T, A, monoF, serif, fs, setRoute, isEN } = p;
  const post = POSTS[0];
  if (!post) return null;
  return (
    <div
      onClick={() => setRoute({ section: 'writing', slug: post.slug })}
      style={{
        marginTop: 28, maxWidth: 720, cursor: 'pointer',
        borderLeft: `2px solid ${A}`,
        paddingLeft: 22,
        transition: 'opacity .15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.85; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = 1; }}
    >
      {/* kicker */}
      <div style={{
        fontFamily: monoF, fontSize: fs - 3, color: T.dim2,
        letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 12,
      }}>
        {isEN ? 'latest' : '最新'} · {post.date}
      </div>

      {/* Excerpt as quote */}
      <div style={{ fontFamily: serif, fontSize: 22, color: T.ink, lineHeight: 1.5, fontStyle: 'italic' }}>
        "{isEN ? post.excerpt_en : post.excerpt_zh}"
      </div>

      {/* attribution */}
      <div style={{
        marginTop: 14, fontFamily: monoF, fontSize: fs - 2, color: T.dim,
        display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap',
      }}>
        <span style={{ color: T.dim2 }}>—</span>
        <span style={{ color: T.ink }}>{isEN ? post.title_en : post.title_zh}</span>
        <span style={{ color: A, marginLeft: 4 }}>{isEN ? 'read →' : '阅读 →'}</span>
      </div>
    </div>
  );
}

window.LatestPullquote = LatestPullquote;
