// xuanx ai — page components, part 3: about, contact.

function AboutPage(p) {
  const { T, A, monoF, serif, fs, pad, sectGap, isEN, t } = p;
  const body = isEN ? ABOUT.en : ABOUT.zh;

  // Five principles distilled from the Mission & Worldview post.
  const principles = [
    {
      en: { title: 'Knowledge is neither pure structure nor pure flow.',
            body:  'It can appear as schemas, graphs, parameterized models — or as dynamic flow through context and generation. Most of the time it lives somewhere between the two.' },
      zh: { title: '知识既不是纯结构，也不是纯流动。',
            body:  '它可以表现为 schema、graph、参数化模型，也可以表现为上下文中的动态生成。更多时候，它存在于两者之间。' },
    },
    {
      en: { title: 'Interpretability is not the only valid form of intelligence.',
            body:  'Some knowledge stays implicit; some cannot be cleanly extracted. What matters is whether it can be extended, transferred, and applied — not whether every internal state can be explained.' },
      zh: { title: '可解释，不是智能的唯一形式。',
            body:  '有些知识只能隐式存在，无法被完整提取。重要的不是能否解释系统内部的每一个状态，而是这些知识能否在新的约束下被扩展、迁移和使用。' },
    },
    {
      en: { title: 'Intelligence is the ability to move between forms.',
            body:  'Implicit becoming explicit. Structure becoming generative. Meaning surviving the move between contexts. These transitions are not implementation details — they are central.' },
      zh: { title: '智能即在形式之间转换的能力。',
            body:  '隐式如何变成显式、结构如何变成生成、意义如何在跨语境时保持连续——这些不是实现细节，而是智能本身的核心。' },
    },
    {
      en: { title: 'The unknown is not missing information.',
            body:  'More often it is space that has not yet been structured, modeled, or expressed in usable form. Exploration is the expansion of what can become representable — not just retrieval of what already is.' },
      zh: { title: '未知，不等于信息缺失。',
            body:  '它更像是尚未被结构化、尚未被建模、尚未能被表达的空间。探索不只是检索已有信息，而是在扩展系统能够表达的问题边界。' },
    },
    {
      en: { title: 'There is no final representation.',
            body:  'We do not assume knowledge converges to one canonical form. Different representations expose different capabilities. What matters is keeping the ability to reinterpret, as contexts change.' },
      zh: { title: '没有"最终的表示"。',
            body:  '我们不认为知识会收敛为一种统一表示。不同的表达形式会暴露出不同的能力。重要的是当环境变化时，仍然能够重新组织、重新理解。' },
    },
  ];

  return (
    <>
      <Breadcrumb {...p} parts={[t.breadcrumb.about]} cmd={t.aboutCmd} />
      <div style={{ padding: `${pad + 12}px ${pad}px ${pad + 24}px`, maxWidth: 760 }}>
        <PageHead {...p}
          kicker={isEN ? 'about' : '关于'}
          title={isEN ? 'about' : '关于'}
          subtitle={isEN
            ? 'A short note about what we work on, and why.'
            : '一段简短说明：我们做什么、为什么这么做。'
          }
        />

        {/* manifesto body */}
        <div style={{ fontFamily: serif, fontSize: fs + 5, color: T.ink, lineHeight: isEN ? 1.6 : 1.85, marginBottom: 28 }}>
          {body.map((line, i) =>
            line === '' ? <div key={i} style={{ height: 14 }} />
            : <p key={i} style={{ margin: '0 0 6px' }}>{line}</p>
          )}
        </div>

        {/* pull quote */}
        <blockquote style={{
          margin: '40px 0',
          padding: '4px 0 4px 22px',
          borderLeft: `2px solid ${A}`,
          fontFamily: serif, fontSize: fs + 6, color: T.ink, lineHeight: 1.5,
          fontStyle: 'italic',
        }}>
          {isEN
            ? 'What does it mean for knowledge to exist in a form that can be explored, but never fully fixed?'
            : '知识以一种既可探索、又无法被完全固定的形式存在，这意味着什么？'}
        </blockquote>

        {/* worldview principles */}
        <Rule {...p} note={isEN ? 'worldview' : '世界观'} />
        <div style={{ display: 'grid', gap: 28, marginTop: 8 }}>
          {principles.map((pr, i) => {
            const cur = isEN ? pr.en : pr.zh;
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 18, alignItems: 'baseline' }}>
                <span style={{
                  fontFamily: monoF, color: A, fontSize: fs - 1,
                  fontVariantNumeric: 'tabular-nums', letterSpacing: '.05em',
                }}>
                  {String(i + 1).padStart(2, '0')} /
                </span>
                <div>
                  <div style={{ fontFamily: monoF, fontSize: fs + 3, color: T.ink, fontWeight: 600, letterSpacing: '-.005em', marginBottom: 8 }}>
                    {cur.title}
                  </div>
                  <div style={{ fontFamily: serif, fontSize: fs + 2, color: T.dim, lineHeight: 1.6 }}>
                    {cur.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* link out to the full manifesto post */}
        <div style={{
          marginTop: 44, paddingTop: 22, borderTop: `1px solid ${T.rule}`,
          fontFamily: monoF, fontSize: fs - 1, color: T.dim,
        }}>
          <span style={{ color: T.dim2 }}>// </span>
          <span
            onClick={() => p.setRoute({ section: 'writing', slug: 'mission-and-worldview' })}
            style={{ color: A, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, textDecorationColor: `${A}55` }}
          >
            {isEN ? 'read the full mission & worldview essay →' : '阅读完整《使命与世界观》→'}
          </span>
        </div>
      </div>
    </>
  );
}

function ContactPage(p) {
  const { T, A, monoF, serif, fs, pad, isEN, t } = p;
  const rows = [
    { label_en: 'email',      label_zh: '邮箱',    value: META.contact,                                                             link: `mailto:${META.contact}` },
    { label_en: 'github',     label_zh: 'github',  value: 'github.com/xuanx-ai',                                                    link: META.github },
    { label_en: 'rss',        label_zh: '订阅',    value: META.rss,                                                                 link: META.rss },
    { label_en: 'response',   label_zh: '回复',    value: isEN ? '~ 3 business days' : '约 3 个工作日',                              link: null },
    { label_en: 'public key', label_zh: '公钥',    value: '0xA92F · 4D31 · 6BCF · 220E',                                            link: null },
  ];
  return (
    <>
      <Breadcrumb {...p} parts={[t.breadcrumb.contact]} cmd={t.contactCmd} />
      <div style={{ padding: `${pad + 12}px ${pad}px ${pad + 24}px`, maxWidth: 720 }}>
        <PageHead {...p}
          kicker={isEN ? 'contact' : '联系'}
          title={isEN ? 'contact' : '联系'}
          subtitle={isEN
            ? 'The best way to reach us is email. We read all of it.'
            : '最好的联系方式是邮件。我们每封都看。'
          }
        />

        <div style={{ border: `1px solid ${T.rule}`, borderRadius: 3 }}>
          {rows.map((r, i) => (
            <div key={r.label_en} style={{
              display: 'grid', gridTemplateColumns: '140px 1fr', gap: 20,
              padding: '14px 22px',
              borderTop: i === 0 ? 'none' : `1px solid ${T.rule}`,
              alignItems: 'baseline',
            }}>
              <span style={{ fontFamily: monoF, fontSize: fs - 1, color: T.dim2, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                {isEN ? r.label_en : r.label_zh}
              </span>
              {r.link ? (
                <a
                  href={r.link}
                  target={r.link.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: monoF, fontSize: fs + 1,
                    color: A,
                    textDecoration: 'underline',
                    textUnderlineOffset: 4,
                    textDecorationColor: `${A}55`,
                  }}
                >
                  {r.value}
                </a>
              ) : (
                <span style={{ fontFamily: monoF, fontSize: fs + 1, color: T.ink }}>
                  {r.value}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* invitation block */}
        <div style={{ marginTop: 36, fontFamily: serif, fontSize: fs + 3, color: T.ink, lineHeight: 1.6 }}>
          {isEN ? (
            <p style={{ margin: 0 }}>
              We're not hiring, but we like meeting people who think carefully about
              how knowledge takes form. If that's you — write.
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              我们暂时不招人，但喜欢认识"认真思考知识如何成形"的人。如果你是——就写信吧。
            </p>
          )}
        </div>
      </div>
    </>
  );
}

window.AboutPage = AboutPage;
window.ContactPage = ContactPage;
