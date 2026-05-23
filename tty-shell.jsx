// xuanx ai — TTY-flavored website (shell + sidebar + router)
// Two-pane layout: file-tree sidebar on the left, real page content on the right.
// Terminal typography, but normal page layout — much less geek-cosplay than v1.

function XuanxLogo({ height = 24, color = 'currentColor', strokeWidth = 7, style = {} }) {
  // x-u-a-n-x wordmark. The original SVG had a ton of empty canvas around it;
  // we crop the viewBox tight to its actual content bounds (~5.4:1 aspect).
  // strokeWidth defaults to 7 (the original at full size); bump up for small.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="465 218 870 164"
      preserveAspectRatio="xMidYMid meet"
      style={{ height, width: 'auto', color, display: 'block', ...style }}
    >
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="butt" strokeLinejoin="miter">
        <line x1="475" y1="225" x2="605" y2="375" />
        <line x1="605" y1="225" x2="475" y2="375" />
        <path d="M 655,225 L 655,310 A 65,65 0 0 0 785,310 L 785,225" />
        <circle cx="900" cy="300" r="75" />
        <line x1="847" y1="247" x2="833" y2="233" />
        <line x1="953" y1="353" x2="967" y2="367" />
        <path d="M 1015,375 L 1015,290 A 65,65 0 0 1 1145,290 L 1145,375" />
        <line x1="1195" y1="225" x2="1325" y2="375" />
        <line x1="1325" y1="225" x2="1195" y2="375" />
      </g>
      <g fill="currentColor" stroke="none">
        <circle cx="833" cy="233" r="10" />
        <circle cx="967" cy="367" r="10" />
      </g>
    </svg>
  );
}

window.XuanxLogo = XuanxLogo;

const SITE_THEMES = {
  jet:   { bg: '#0a0a0a', panel: '#0e0e0e', side: '#0d0d0d', ink: '#e8e4d8', dim: '#9a948a', dim2: '#5a554c', rule: '#1f1d19', hover: 'rgba(255,255,255,.03)', hover2: 'rgba(255,255,255,.05)' },
  warm:  { bg: '#15130f', panel: '#1a1714', side: '#181612', ink: '#ece6d6', dim: '#a89e8c', dim2: '#615a4e', rule: '#27231d', hover: 'rgba(255,255,255,.025)', hover2: 'rgba(255,255,255,.05)' },
  paper: { bg: '#efeae0', panel: '#f4efe5', side: '#ebe5da', ink: '#1f1c17', dim: '#6e6557', dim2: '#a89e8c', rule: '#d6cebe', hover: 'rgba(0,0,0,.03)', hover2: 'rgba(0,0,0,.06)' },
};

function useRoute() {
  const [route, setRoute] = React.useState({ section: 'home', slug: null });
  return [route, setRoute];
}

// UI strings — one place to keep both languages so pages stay in sync.
const UI = {
  en: {
    home: 'home', writing: 'writing', prototypes: 'prototypes', projects: 'projects',
    changelog: 'changelog', about: 'about', contact: 'contact',
    readingTime: (n) => `${n} min read`,
    by: 'by',
    backToWriting: '← back to writing',
    newer: '← newer', older: 'older →',
    posts: 'posts',
    quickLinks: { writing: 'read writing', prototypes: 'see prototypes', projects: 'browse projects' },
    onlineLabel: 'online',
    nowKicker: 'now',
    recentKicker: 'latest',
    homeCmd: 'cat README.md',
    writingCmd: 'ls -la *.md',
    aboutCmd: 'cat about.md',
    contactCmd: 'cat contact.txt',
    prototypesCmd: 'ls prototypes/',
    projectsCmd: 'git ls-remote --heads',
    changelogCmd: 'tail -n 24 changelog',
    breadcrumb: {
      home: 'home', writing: 'writing', prototypes: 'prototypes', projects: 'projects',
      changelog: 'changelog', about: 'about', contact: 'contact',
    },
  },
  zh: {
    home: '首页', writing: '博客', prototypes: '原型', projects: '项目',
    changelog: '动态', about: '关于', contact: '联系',
    readingTime: (n) => `约 ${n} 分钟`,
    by: '作者',
    backToWriting: '← 返回博客列表',
    newer: '← 较新', older: '较旧 →',
    posts: '篇',
    quickLinks: { writing: '读博客', prototypes: '看原型', projects: '查项目' },
    onlineLabel: '在线',
    nowKicker: '此刻',
    recentKicker: '最新',
    homeCmd: 'cat 自述.md',
    writingCmd: 'ls -la 博客/',
    aboutCmd: 'cat 关于.md',
    contactCmd: 'cat 联系方式.txt',
    prototypesCmd: 'ls 原型/',
    projectsCmd: 'git ls-remote --heads',
    changelogCmd: 'tail -n 24 动态',
    breadcrumb: {
      home: '首页', writing: '博客', prototypes: '原型', projects: '项目',
      changelog: '动态', about: '关于', contact: '联系',
    },
  },
};

window.UI = UI;

function TTYShell({ density, accent, accentLight, mono, theme, lang, setLang }) {
  const T = SITE_THEMES[theme] || SITE_THEMES.jet;
  const isLight = theme === 'paper';
  const A = isLight ? accentLight : accent;

  const D = density;
  const pad     = D === 'compact' ? 24 : D === 'relaxed' ? 48 : 36;
  const sectGap = D === 'compact' ? 28 : D === 'relaxed' ? 56 : 40;
  const itemGap = D === 'compact' ? 10 : D === 'relaxed' ? 20 : 14;
  const fs      = D === 'compact' ? 13 : D === 'relaxed' ? 15 : 14;

  const monoF = `${mono}, 'JetBrains Mono', ui-monospace, Menlo, monospace`;
  const serif = '"Source Serif 4", "Source Serif Pro", "Iowan Old Style", Charter, Georgia, serif';

  const [route, setRoute] = useRoute();
  const [writingOpen, setWritingOpen] = React.useState(true);
  const isEN = lang === 'en';
  const t = UI[lang] || UI.en;

  const style = { T, A, isLight, monoF, serif, pad, sectGap, itemGap, fs, route, setRoute, lang, isEN, t };

  return (
    <div style={{
      width: '100%', height: '100%', background: T.bg, color: T.ink,
      fontFamily: monoF, fontSize: fs, display: 'flex', overflow: 'hidden',
      position: 'relative',
    }}>
      <TTYSidebar {...style} writingOpen={writingOpen} setWritingOpen={setWritingOpen} setLang={setLang} />
      <main style={{ flex: 1, overflowY: 'auto', background: T.panel, position: 'relative' }}>
        {/* Floating logo, top-right of content pane — accent color */}
        <div style={{
          position: 'absolute',
          top: 22, right: 28,
          color: A,
          zIndex: 5,
          pointerEvents: 'none',
          opacity: 0.95,
        }}>
          <XuanxLogo height={20} strokeWidth={16} />
        </div>
        <TTYPage {...style} />
      </main>
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

function TTYSidebar({ T, A, isLight, monoF, fs, route, setRoute, writingOpen, setWritingOpen, lang, setLang, isEN, t }) {
  const sectionRow = (id, enLabel, zhLabel, opts = {}) => (
    <TreeRow
      T={T} A={A} isLight={isLight} monoF={monoF} fs={fs}
      active={route.section === id && !route.slug}
      onClick={() => setRoute({ section: id, slug: null })}
      branch={opts.branch}
    >
      <span style={{ color: route.section === id && !route.slug ? T.ink : T.dim }}>
        {isEN ? enLabel : zhLabel}
      </span>
    </TreeRow>
  );

  return (
    <aside style={{
      width: 280, flex: '0 0 280px', background: T.side,
      borderRight: `1px solid ${T.rule}`,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: monoF, fontSize: fs - 1, color: T.dim,
    }}>
      {/* Identity */}
      <div style={{ padding: '20px 18px 16px', borderBottom: `1px solid ${T.rule}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{
            width: 9, height: 9, borderRadius: '50%', background: A,
            boxShadow: `0 0 10px ${A}88`, flex: '0 0 auto',
          }} />
          <span style={{ color: A, fontWeight: 600, fontSize: fs + 1, letterSpacing: '-.005em' }}>
            xuanx ai
          </span>
        </div>
        <div style={{ color: T.dim, marginTop: 8, fontSize: fs - 2, lineHeight: 1.5 }}>
          {isEN ? META.tagline_en : META.tagline_en /* English-only tagline regardless of UI lang */}
        </div>

        {/* Language toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, marginTop: 14,
          padding: 2, borderRadius: 4,
          border: `1px solid ${T.rule}`, width: 'fit-content',
        }}>
          {[
            { key: 'en', label: 'EN' },
            { key: 'zh', label: '中' },
          ].map((opt) => {
            const active = lang === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setLang(opt.key)}
                style={{
                  fontFamily: monoF, fontSize: fs - 2, fontWeight: active ? 600 : 400,
                  padding: '3px 10px', borderRadius: 3,
                  border: 'none',
                  color: active ? (isLight ? '#fff' : '#0a0a0a') : T.dim,
                  background: active ? A : 'transparent',
                  cursor: 'pointer',
                  transition: 'color .12s, background .12s',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = A; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = T.dim; }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tree */}
      <div style={{ padding: '14px 0 20px', flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '0 18px 8px', color: T.dim2, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase' }}>
          {META.shellUser}@{META.shellHost}:~
        </div>

        {/* root */}
        <div style={{ padding: '3px 14px 3px 16px', color: T.dim, fontFamily: monoF, fontSize: fs - 1 }}>
          <span style={{ color: T.dim2, whiteSpace: 'pre' }}>┬─ </span>
          <span style={{ color: T.ink }}>~/</span>
        </div>

        {sectionRow('home', 'home', '首页')}

        {/* writing (expandable) */}
        <div
          onClick={() => { setWritingOpen(!writingOpen); setRoute({ section: 'writing', slug: null }); }}
          style={treeRowBaseStyle(T, A, isLight, monoF, fs, route.section === 'writing' && !route.slug)}
        >
          <span style={{ color: T.dim2, whiteSpace: 'pre' }}>├─ </span>
          <span style={{ color: T.dim, marginRight: 6, width: 10, display: 'inline-block' }}>{writingOpen ? '▾' : '▸'}</span>
          <span style={{ flex: 1, fontFamily: monoF, fontWeight: route.section === 'writing' && !route.slug ? 600 : 400, color: route.section === 'writing' && !route.slug ? T.ink : T.dim }}>
            {isEN ? 'writing/' : '博客/'}
          </span>
          <span style={{ color: T.dim2, marginLeft: 8, fontSize: fs - 2 }}>{POSTS.length}</span>
        </div>
        {writingOpen && POSTS.map((post, i) => {
          const last = i === POSTS.length - 1;
          const active = route.slug === post.slug;
          return (
            <div
              key={post.slug}
              onClick={(e) => { e.stopPropagation(); setRoute({ section: 'writing', slug: post.slug }); }}
              style={{
                ...treeRowBaseStyle(T, A, isLight, monoF, fs - 1, active),
                padding: '2px 14px 2px 16px',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.hover; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              title={isEN ? post.title_en : post.title_zh}
            >
              <span style={{ color: T.dim2, whiteSpace: 'pre' }}>│  {last ? '└' : '├'}─ </span>
              <span style={{
                fontFamily: monoF, fontWeight: active ? 600 : 400,
                color: active ? T.ink : T.dim,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{post.slug}.md</span>
            </div>
          );
        })}

        {sectionRow('prototypes', 'prototypes/', '原型/')}
        {sectionRow('projects',   'projects/',   '项目/')}
        {sectionRow('changelog',  'changelog',   '动态')}
        {sectionRow('about',      'about',       '关于')}
        {sectionRow('contact',    'contact',     '联系', { branch: 'last' })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '14px 18px', borderTop: `1px solid ${T.rule}`,
        color: T.dim2, fontSize: fs - 3, lineHeight: 1.8,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a
            href={META.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: T.dim, textDecoration: 'none', fontFamily: monoF,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = A; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.dim; }}
          >
            <span style={{ color: T.dim2 }}>↗</span>
            github.com/xuanx-ai
          </a>
          <a
            href={`mailto:${META.contact}`}
            style={{
              color: T.dim, textDecoration: 'none', fontFamily: monoF,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = A; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.dim; }}
          >
            <span style={{ color: T.dim2 }}>✉</span>
            {META.contact}
          </a>
        </div>
        <div style={{
          marginTop: 10, paddingTop: 8, borderTop: `1px dashed ${T.rule}`,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>v0.4.1</span>
          <span>est. 2026</span>
        </div>
      </div>
    </aside>
  );
}

// helper styles
function treeRowBaseStyle(T, A, isLight, monoF, fs, active) {
  return {
    display: 'flex', alignItems: 'baseline',
    padding: '3px 14px 3px 16px', cursor: 'pointer',
    background: active ? T.hover2 : 'transparent',
    borderLeft: active ? `2px solid ${A}` : '2px solid transparent',
    paddingLeft: 14,
    fontSize: fs - 1,
    whiteSpace: 'nowrap',
  };
}

function TreeRow({ T, A, isLight, monoF, fs, active, onClick, children, branch }) {
  const connector = branch === 'last' ? '└─ ' : '├─ ';
  return (
    <div
      onClick={onClick}
      style={treeRowBaseStyle(T, A, isLight, monoF, fs, active)}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.hover; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ color: T.dim2, whiteSpace: 'pre' }}>{connector}</span>
      <span style={{ flex: 1, fontFamily: monoF, fontWeight: active ? 600 : 400 }}>{children}</span>
    </div>
  );
}

Object.assign(window, { TTYShell, SITE_THEMES });
