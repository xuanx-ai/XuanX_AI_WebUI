// Markdown.jsx — small markdown renderer tailored to our posts.
// Supports: # ## ### headings, > blockquotes, **bold**, *italic*,
// blank-line paragraph breaks. No third-party deps, no innerHTML.

function mdInline(text, keyBase) {
  // Split on **bold** and *italic*. Keep the delimiters via capture group.
  const parts = String(text).split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={keyBase + '-b-' + i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={keyBase + '-i-' + i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function mdParseBlocks(md) {
  const lines = String(md).replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      blocks.push({ type: 'h', level: h[1].length, text: h[2] });
      i++;
      continue;
    }
    if (line.startsWith('> ')) {
      const parts = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        parts.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: 'quote', text: parts.join(' ') });
      continue;
    }
    if (line.trim() === '') { i++; continue; }
    const parts = [];
    while (i < lines.length
           && lines[i].trim() !== ''
           && !/^#{1,6}\s+/.test(lines[i])
           && !lines[i].startsWith('> ')) {
      parts.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'p', lines: parts });
  }
  return blocks;
}

function Markdown({ source, theme, mono, serif, fs, accent }) {
  const T = theme;
  const blocks = mdParseBlocks(source);
  const sectionGap = 22;

  return (
    <div>
      {blocks.map((b, i) => {
        if (b.type === 'h') {
          if (b.level === 1) return (
            <h1 key={i} style={{
              fontFamily: mono, fontSize: 36, fontWeight: 600, color: T.ink,
              margin: (sectionGap + 12) + 'px 0 14px', letterSpacing: '-.015em', lineHeight: 1.2,
            }}>{mdInline(b.text, 'h' + i)}</h1>
          );
          if (b.level === 2) return (
            <h2 key={i} style={{
              fontFamily: mono, fontSize: 22, fontWeight: 600, color: T.ink,
              margin: (sectionGap + 16) + 'px 0 12px', letterSpacing: '-.005em',
              paddingTop: 18, borderTop: '1px solid ' + T.rule,
            }}>{mdInline(b.text, 'h' + i)}</h2>
          );
          if (b.level === 3) return (
            <h3 key={i} style={{
              fontFamily: mono, fontSize: fs + 4, fontWeight: 600, color: accent,
              margin: sectionGap + 'px 0 10px',
            }}>{mdInline(b.text, 'h' + i)}</h3>
          );
          return (
            <h4 key={i} style={{
              fontFamily: mono, fontSize: fs + 2, fontWeight: 600, color: T.ink,
              margin: (sectionGap - 4) + 'px 0 8px',
            }}>{mdInline(b.text, 'h' + i)}</h4>
          );
        }
        if (b.type === 'quote') {
          return (
            <blockquote key={i} style={{
              margin: sectionGap + 'px 0',
              padding: '4px 0 4px 22px',
              borderLeft: '2px solid ' + accent,
              fontFamily: serif, fontSize: fs + 6, color: T.ink, lineHeight: 1.5,
              fontStyle: 'italic',
            }}>
              {mdInline(b.text, 'q' + i)}
            </blockquote>
          );
        }
        // paragraph: render each line with <br/> between, preserving source line breaks
        return (
          <p key={i} style={{
            fontFamily: serif, fontSize: fs + 4, color: T.ink, lineHeight: 1.7,
            margin: '0 0 14px',
          }}>
            {b.lines.map((ln, j) => (
              <React.Fragment key={j}>
                {mdInline(ln.replace(/\s+$/, ''), 'p' + i + '-' + j)}
                {j < b.lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

window.Markdown = Markdown;
