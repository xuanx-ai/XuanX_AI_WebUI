// xuanx ai — page components, part 2: writing index, post detail, prototypes, projects.

function WritingIndex(p) {
  const { T, A, monoF, serif, fs, pad, itemGap, setRoute } = p;
  const [activeTopic, setActiveTopic] = React.useState('all');

  const filtered = activeTopic === 'all'
    ? POSTS
    : POSTS.filter((post) => post.topic === activeTopic);

  // counts per topic for the chip suffix
  const counts = {};
  TOPICS.forEach((t) => {
    counts[t.id] = t.id === 'all' ? POSTS.length : POSTS.filter((p) => p.topic === t.id).length;
  });

  return (
    <>
      <Breadcrumb {...p} parts={['writing']} cmd="ls -la *.md" />
      <div style={{ padding: `${pad + 12}px ${pad}px ${pad + 24}px`, maxWidth: 980 }}>
        <PageHead {...p}
          kicker="writing / 博客"
          title="writing"
          subtitle_en="Long-form notes, essays, and the occasional opinion. We post when there's something to say."
          subtitle_zh="长文、笔记，偶尔一些观点。有东西可说时才发。"
        />

        {/* topic filter — clickable, functional */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: monoF, fontSize: fs - 2, color: T.dim2, letterSpacing: '.14em', textTransform: 'uppercase' }}>
            // topic
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TOPICS.map((topic) => {
              const active = activeTopic === topic.id;
              const disabled = counts[topic.id] === 0;
              return (
                <button
                  key={topic.id}
                  onClick={() => !disabled && setActiveTopic(topic.id)}
                  disabled={disabled}
                  style={{
                    fontFamily: monoF, fontSize: fs - 2,
                    padding: '5px 11px', borderRadius: 3,
                    border: `1px solid ${active ? A : T.rule}`,
                    color: disabled ? T.dim2 : active ? (p.isLight ? '#fff' : '#0a0a0a') : T.dim,
                    background: active ? A : 'transparent',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.45 : 1,
                    display: 'inline-flex', alignItems: 'baseline', gap: 7,
                    transition: 'border-color .12s, color .12s, background .12s',
                  }}
                  onMouseEnter={(e) => {
                    if (!active && !disabled) {
                      e.currentTarget.style.borderColor = A;
                      e.currentTarget.style.color = A;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active && !disabled) {
                      e.currentTarget.style.borderColor = T.rule;
                      e.currentTarget.style.color = T.dim;
                    }
                  }}
                >
                  <span>{topic.id === 'all' ? '· all' : topic.en}</span>
                  <span style={{ color: active ? 'currentColor' : T.dim2, opacity: active ? 0.65 : 1, fontSize: fs - 3 }}>
                    {counts[topic.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* current filter label */}
        <div style={{ fontFamily: monoF, fontSize: fs - 2, color: T.dim, marginBottom: 6 }}>
          {activeTopic === 'all'
            ? <>showing <span style={{ color: T.ink }}>{filtered.length}</span> posts</>
            : <>showing <span style={{ color: T.ink }}>{filtered.length}</span> in <span style={{ color: A }}>{activeTopic}</span> · {TOPICS.find((t) => t.id === activeTopic).zh}</>
          }
        </div>

        {/* posts table */}
        <div>
          {filtered.map((post, i) => (
            <div
              key={post.slug}
              onClick={() => setRoute({ section: 'writing', slug: post.slug })}
              style={{
                padding: `${itemGap + 4}px 0`,
                borderTop: `1px solid ${T.rule}`,
                cursor: 'pointer',
                display: 'grid', gridTemplateColumns: '100px 100px 1fr 70px', gap: 24, alignItems: 'baseline',
              }}
              onMouseEnter={(e) => { e.currentTarget.querySelector('[data-title]').style.color = A; }}
              onMouseLeave={(e) => { e.currentTarget.querySelector('[data-title]').style.color = T.ink; }}
            >
              <span style={{ fontFamily: monoF, fontSize: fs - 2, color: T.dim }}>{post.date}</span>
              <span style={{ fontFamily: monoF, fontSize: fs - 2, color: A }}>{post.topic}</span>
              <div>
                <div data-title style={{
                  fontFamily: monoF, fontSize: fs + 2, color: T.ink, fontWeight: 500,
                  marginBottom: 3, transition: 'color .15s',
                }}>{post.title_en}</div>
                <div style={{ fontFamily: monoF, fontSize: fs - 1, color: T.dim, marginBottom: 6 }}>{post.title_zh}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {post.tags.map((tag) => (
                    <span key={tag} style={{
                      fontFamily: monoF, fontSize: fs - 3, color: T.dim2,
                      letterSpacing: '.04em',
                    }}>#{tag}</span>
                  ))}
                </div>
              </div>
              <span style={{ fontFamily: monoF, fontSize: fs - 2, color: T.dim2, textAlign: 'right' }}>
                {post.reading} min
              </span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${T.rule}` }} />
          {filtered.length === 0 && (
            <div style={{ padding: '32px 0', fontFamily: monoF, fontSize: fs - 1, color: T.dim2, textAlign: 'center' }}>
              // no posts in this topic yet
            </div>
          )}
        </div>

        {/* RSS / archive */}
        <div style={{ marginTop: 32, fontFamily: monoF, fontSize: fs - 1, color: T.dim, display: 'flex', gap: 24 }}>
          <span><span style={{ color: T.dim2 }}>// </span>subscribe via</span>
          <span style={{ color: A, cursor: 'pointer' }}>rss</span>
          <span style={{ color: A, cursor: 'pointer' }}>email</span>
          <span style={{ color: A, cursor: 'pointer' }}>atom</span>
        </div>
      </div>
    </>
  );
}

function PostPage(p) {
  const { T, A, monoF, serif, fs, pad, sectGap, route, setRoute, isEN, t } = p;
  const post = POSTS.find((x) => x.slug === route.slug) || POSTS[0];

  const title = isEN ? post.title_en : post.title_zh;
  const body  = isEN ? post.body_en  : post.body_zh;

  const prevIdx = POSTS.findIndex((x) => x.slug === post.slug) - 1;
  const nextIdx = POSTS.findIndex((x) => x.slug === post.slug) + 1;
  const prev = prevIdx >= 0 ? POSTS[prevIdx] : null;
  const next = nextIdx < POSTS.length ? POSTS[nextIdx] : null;

  return (
    <>
      <Breadcrumb {...p} parts={[t.breadcrumb.writing, post.slug + '.md']} cmd={`vim ${post.slug}.md`} />
      <div style={{ padding: `${pad + 12}px ${pad}px ${pad + 24}px`, maxWidth: 760 }}>

        {/* back */}
        <div
          onClick={() => setRoute({ section: 'writing', slug: null })}
          style={{ fontFamily: monoF, fontSize: fs - 1, color: T.dim, cursor: 'pointer', marginBottom: 20 }}
          onMouseEnter={(e) => { e.currentTarget.style.color = A; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = T.dim; }}
        >
          {t.backToWriting}
        </div>

        {/* metadata */}
        <div style={{ display: 'flex', gap: 14, fontFamily: monoF, fontSize: fs - 2, color: T.dim, marginBottom: 14, flexWrap: 'wrap', alignItems: 'baseline' }}>
          <span>{post.date}</span>
          <span style={{ color: T.dim2 }}>·</span>
          <span style={{
            color: A, border: `1px solid ${A}55`,
            padding: '2px 8px', borderRadius: 3, fontSize: fs - 3,
            letterSpacing: '.04em',
          }}>{post.topic}</span>
          <span style={{ color: T.dim2 }}>·</span>
          <span>{t.by} {post.author}</span>
          <span style={{ color: T.dim2 }}>·</span>
          <span>{t.readingTime(post.reading)}</span>
          {post.tags && post.tags.length > 0 && <span style={{ color: T.dim2 }}>·</span>}
          {post.tags && post.tags.map((tag) => (
            <span key={tag} style={{ color: T.dim }}>#{tag}</span>
          ))}
        </div>

        {/* title */}
        <h1 style={{
          fontFamily: monoF, fontSize: 36, fontWeight: 600, color: T.ink,
          margin: '6px 0 32px', letterSpacing: '-.015em', lineHeight: 1.15,
        }}>
          {title}
        </h1>

        {/* markdown body */}
        {typeof Markdown !== 'undefined'
          ? <Markdown source={body} theme={T} mono={monoF} serif={serif} fs={fs} accent={A} />
          : <pre style={{ whiteSpace: 'pre-wrap', fontFamily: serif, fontSize: fs + 2, color: T.ink, lineHeight: 1.7 }}>{body}</pre>
        }

        {/* prev / next */}
        {(prev || next) && (
          <div style={{
            marginTop: 56, paddingTop: 24, borderTop: `1px solid ${T.rule}`,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
          }}>
            <div
              onClick={() => prev && setRoute({ section: 'writing', slug: prev.slug })}
              style={{ cursor: prev ? 'pointer' : 'default', opacity: prev ? 1 : 0.35 }}
            >
              <div style={{ fontFamily: monoF, fontSize: fs - 2, color: T.dim2, marginBottom: 6 }}>{t.newer}</div>
              <div style={{ fontFamily: monoF, fontSize: fs, color: T.ink }}>{prev ? (isEN ? prev.title_en : prev.title_zh) : '—'}</div>
            </div>
            <div
              onClick={() => next && setRoute({ section: 'writing', slug: next.slug })}
              style={{ cursor: next ? 'pointer' : 'default', opacity: next ? 1 : 0.35, textAlign: 'right' }}
            >
              <div style={{ fontFamily: monoF, fontSize: fs - 2, color: T.dim2, marginBottom: 6 }}>{t.older}</div>
              <div style={{ fontFamily: monoF, fontSize: fs, color: T.ink }}>{next ? (isEN ? next.title_en : next.title_zh) : '—'}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function PrototypesPage(p) {
  const { T, A, monoF, serif, fs, pad, sectGap, itemGap, isEN, t } = p;
  const hasItems = PROTOTYPES && PROTOTYPES.length > 0;
  return (
    <>
      <Breadcrumb {...p} parts={[t.breadcrumb.prototypes]} cmd={t.prototypesCmd} />
      <div style={{ padding: `${pad + 12}px ${pad}px ${pad + 24}px`, maxWidth: 1080 }}>
        <PageHead {...p}
          kicker={isEN ? 'prototypes' : '原型'}
          title={isEN ? 'prototypes' : '原型'}
          subtitle={isEN
            ? "Things we're trying out. Most stay rough; a few become projects."
            : '正在试的东西。大多保持粗糙；少数会变成正式项目。'
          }
        />

        {!hasItems && (
          <EmptyState T={T} A={A} monoF={monoF} serif={serif} fs={fs}
            title={isEN ? 'Nothing public yet' : '还没有公开的原型'}
            body={isEN
              ? "We're working on a few things. When something is ready to show, it will appear here — usually a screenshot, a short note, and a link to try it."
              : '我们手上有几个在做的。等到可以拿出来的时候，会出现在这里——通常是一张截图、一段简短说明，以及可以试用的链接。'
            }
          />
        )}

        {hasItems && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 1, background: T.rule, border: `1px solid ${T.rule}` }}>
            {PROTOTYPES.map((proto) => {
              const card = (
                <>
                  {/* mock screen */}
                  <div style={{
                    height: 110, borderRadius: 3, border: `1px solid ${T.rule}`,
                    background: `repeating-linear-gradient(90deg, transparent 0 11px, ${T.rule} 11px 12px), ${T.bg}`,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 12, left: 14,
                      fontFamily: monoF, fontSize: 10, color: T.dim2,
                    }}>{proto.name}</div>
                    <div style={{ position: 'absolute', top: 36, left: 14, right: 14 }}>
                      <div style={{ height: 8, width: '60%', background: T.dim2, opacity: 0.4, marginBottom: 8 }} />
                      <div style={{ height: 6, width: '85%', background: T.dim2, opacity: 0.25, marginBottom: 6 }} />
                      <div style={{ height: 6, width: '70%', background: T.dim2, opacity: 0.25, marginBottom: 6 }} />
                      <div style={{ height: 6, width: '40%', background: A, opacity: 0.55 }} />
                    </div>
                  </div>

                  {/* meta */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: monoF, fontSize: fs + 2, color: T.ink, fontWeight: 600 }}>{proto.name}</span>
                    <span style={{
                      fontFamily: monoF, fontSize: 10, color: A,
                      border: `1px solid ${A}55`, padding: '2px 7px', borderRadius: 2,
                      letterSpacing: '.06em', textTransform: 'uppercase',
                    }}>{proto.tag}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: serif, fontSize: fs + 1, color: T.ink, lineHeight: 1.5 }}>
                      {isEN ? proto.desc_en : proto.desc_zh}
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', fontFamily: monoF, fontSize: fs - 2, color: T.dim }}>
                    <span style={{ color: A }}>{isEN ? 'open demo →' : '打开 demo →'}</span>
                  </div>
                </>
              );
              const cardStyle = {
                background: T.panel, padding: '24px 22px 26px',
                minHeight: 220, display: 'flex', flexDirection: 'column', gap: 14,
                textDecoration: 'none', color: 'inherit',
              };
              return proto.url ? (
                <a key={proto.name} href={proto.url} target="_blank" rel="noopener noreferrer" style={cardStyle}>{card}</a>
              ) : (
                <div key={proto.name} style={cardStyle}>{card}</div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function ProjectsPage(p) {
  const { T, A, monoF, serif, fs, pad, itemGap, isEN, t } = p;

  // Live fetch from the GitHub API. Cached per session so navigating away
  // and back doesn't re-hit the rate limit.
  const [state, setState] = React.useState(
    () => window.__projectsCache || { status: 'loading', repos: [], error: null }
  );

  React.useEffect(() => {
    if (state.status !== 'loading') return;
    const user = (META.github.match(/github\.com\/([^/?#]+)/) || [, 'xuanx-ai'])[1];
    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`)
      .then((r) => {
        if (r.status === 404) throw new Error('User not found yet');
        if (!r.ok) throw new Error(`GitHub API: ${r.status}`);
        return r.json();
      })
      .then((repos) => {
        const filtered = repos
          .filter((r) => !r.fork && !r.archived)
          .sort((a, b) => (b.stargazers_count - a.stargazers_count) ||
                          (new Date(b.pushed_at) - new Date(a.pushed_at)));
        const next = { status: 'ok', repos: filtered, error: null };
        window.__projectsCache = next;
        setState(next);
      })
      .catch((err) => {
        const next = { status: 'error', repos: [], error: err.message || String(err) };
        window.__projectsCache = next;
        setState(next);
      });
  }, []);

  const fmtDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const days = Math.round((Date.now() - d) / 86400000);
    if (isEN) {
      if (days < 1)  return 'today';
      if (days < 2)  return 'yesterday';
      if (days < 30) return `${days}d ago`;
      if (days < 365) return `${Math.round(days / 30)}mo ago`;
      return `${Math.round(days / 365)}y ago`;
    }
    if (days < 1)  return '今天';
    if (days < 2)  return '昨天';
    if (days < 30) return `${days} 天前`;
    if (days < 365) return `${Math.round(days / 30)} 个月前`;
    return `${Math.round(days / 365)} 年前`;
  };

  return (
    <>
      <Breadcrumb {...p} parts={[t.breadcrumb.projects]} cmd={t.projectsCmd} />
      <div style={{ padding: `${pad + 12}px ${pad}px ${pad + 24}px`, maxWidth: 1000 }}>
        <PageHead {...p}
          kicker={isEN ? 'projects' : '开源项目'}
          title={isEN ? 'projects' : '项目'}
          subtitle={isEN
            ? 'Open source. Real licenses. Mostly small, all in use somewhere.'
            : '开源项目，有明确 license。大多很小，但都在被实际使用。'
          }
        />

        {/* status row */}
        <div style={{
          fontFamily: monoF, fontSize: fs - 2, color: T.dim,
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        }}>
          <span style={{ color: T.dim2 }}>// {isEN ? 'source' : '来源'}</span>
          <a href={META.github} target="_blank" rel="noopener noreferrer"
            style={{ color: A, textDecoration: 'underline', textUnderlineOffset: 4, textDecorationColor: `${A}55` }}>
            github.com/xuanx-ai
          </a>
          <span style={{ color: T.dim2 }}>·</span>
          {state.status === 'loading' && <span style={{ color: T.dim }}>{isEN ? 'fetching…' : '加载中…'}</span>}
          {state.status === 'ok' && <span style={{ color: T.dim }}>{isEN ? `${state.repos.length} public repos` : `共 ${state.repos.length} 个公开仓库`}</span>}
          {state.status === 'error' && <span style={{ color: T.dim }}>{isEN ? 'could not load' : '无法加载'}</span>}
        </div>

        {/* loading */}
        {state.status === 'loading' && (
          <div style={{ border: `1px solid ${T.rule}`, borderRadius: 2 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                padding: '22px 24px',
                borderTop: i === 0 ? 'none' : `1px solid ${T.rule}`,
                opacity: 0.5 - i * 0.12,
              }}>
                <div style={{ height: 18, width: '30%', background: T.rule, borderRadius: 2, marginBottom: 12 }} />
                <div style={{ height: 12, width: '70%', background: T.rule, borderRadius: 2, marginBottom: 6 }} />
                <div style={{ height: 12, width: '50%', background: T.rule, borderRadius: 2 }} />
              </div>
            ))}
          </div>
        )}

        {/* repos */}
        {state.status === 'ok' && state.repos.length > 0 && (
          <div style={{ border: `1px solid ${T.rule}`, borderRadius: 2 }}>
            {state.repos.map((repo, i) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'baseline',
                  padding: '22px 24px 24px',
                  borderTop: i === 0 ? 'none' : `1px solid ${T.rule}`,
                  textDecoration: 'none', color: 'inherit',
                  transition: 'background .12s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = T.hover; e.currentTarget.querySelector('[data-name]').style.color = A; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('[data-name]').style.color = T.ink; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span data-name style={{
                      fontFamily: monoF, fontSize: fs + 4, color: T.ink, fontWeight: 600,
                      transition: 'color .12s',
                    }}>{repo.name}</span>
                    {repo.language && <span style={{ fontFamily: monoF, fontSize: fs - 2, color: A }}>{repo.language}</span>}
                    {repo.license && <span style={{ fontFamily: monoF, fontSize: fs - 2, color: T.dim2 }}>· {repo.license.spdx_id || repo.license.key}</span>}
                  </div>
                  <div style={{ fontFamily: serif, fontSize: fs + 2, color: T.ink, marginTop: 8, lineHeight: 1.5 }}>
                    {repo.description || <span style={{ color: T.dim2, fontStyle: 'italic' }}>{isEN ? 'no description' : '暂无描述'}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 14, fontFamily: monoF, fontSize: fs - 2, color: T.dim, flexWrap: 'wrap' }}>
                    <span style={{ color: A }}>$ git clone {repo.clone_url || `${repo.html_url}.git`}</span>
                  </div>
                  {repo.topics && repo.topics.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                      {repo.topics.slice(0, 6).map((topic) => (
                        <span key={topic} style={{
                          fontFamily: monoF, fontSize: fs - 3, color: T.dim,
                          border: `1px solid ${T.rule}`, padding: '2px 8px', borderRadius: 2,
                        }}>{topic}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', fontFamily: monoF, fontSize: fs - 1, color: T.dim }}>
                  <div style={{ color: T.ink, fontSize: fs + 2 }}>★ {repo.stargazers_count.toLocaleString()}</div>
                  <div style={{ marginTop: 4, color: T.dim2 }}>{isEN ? 'stars' : '星标'}</div>
                  <div style={{ marginTop: 10, color: T.dim2, fontSize: fs - 3 }}>
                    {isEN ? 'updated' : '更新于'} {fmtDate(repo.pushed_at)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* empty / error states */}
        {state.status === 'ok' && state.repos.length === 0 && (
          <EmptyState T={T} A={A} monoF={monoF} serif={serif} fs={fs}
            title={isEN ? 'No public repos yet' : '还没有公开仓库'}
            body={isEN
              ? 'When repos are pushed to github.com/xuanx-ai, they will appear here automatically — sorted by stars, then by last pushed.'
              : '一旦有仓库推到 github.com/xuanx-ai，会自动出现在这里，按 star 数和最近更新排序。'
            }
          />
        )}
        {state.status === 'error' && (
          <EmptyState T={T} A={A} monoF={monoF} serif={serif} fs={fs}
            title={isEN ? 'Could not load repos' : '暂时无法获取仓库列表'}
            body={isEN
              ? `The GitHub API returned an error (${state.error}). The username may not exist yet, or the rate limit was hit. Try refreshing in a minute.`
              : 'GitHub API 返回了错误。可能是用户名暂未创建，或者频率超限——一分钟后刷新再试。'
            }
          />
        )}
      </div>
    </>
  );
}

function EmptyState({ T, A, monoF, serif, fs, title, body }) {
  return (
    <div style={{
      border: `1px dashed ${T.rule}`, borderRadius: 2,
      padding: '48px 32px', textAlign: 'center',
    }}>
      <div style={{ fontFamily: monoF, fontSize: 11, color: T.dim2, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 16 }}>
        // empty
      </div>
      <div style={{ fontFamily: monoF, fontSize: fs + 4, color: T.ink, fontWeight: 500 }}>{title}</div>
      <div style={{ fontFamily: serif, fontSize: fs + 1, color: T.dim, marginTop: 16, maxWidth: 520, margin: '16px auto 0', lineHeight: 1.55 }}>
        {body}
      </div>
    </div>
  );
}

window.WritingIndex = WritingIndex;
window.PostPage = PostPage;
window.PrototypesPage = PrototypesPage;
window.ProjectsPage = ProjectsPage;
