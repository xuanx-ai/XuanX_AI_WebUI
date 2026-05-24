// Markdown.jsx — extended renderer to support tables, code blocks, inline code,
// lists, horizontal rules, and links. Backwards-compatible with original schema.
//
// Supports:
//   # ## ### #### headings
//   > blockquote (multi-line with internal breaks preserved)
//   **bold** *italic*
//   `inline code`
//   [link text](url)
//   ``` code block ``` (fenced; no language tag inspection)
//   - unordered list (or * or +)
//   1. ordered list
//   | table | with | --- alignment row
//   --- horizontal rule
//   blank-line paragraph breaks
//
// Constraints: no third-party deps, no innerHTML, JSX-as-text via Babel standalone.

function mdInline(text, keyBase) {
  // Order matters: inline code first (so ** inside ` ` won't be parsed as bold),
  // then links, then bold, then italic.
  // Combined regex with alternation; longest patterns first within each category.
  const parts = String(text).split(
    /(`[^`\n]+`|\[[^\]\n]+\]\([^)\n]+\)|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g
  );
  return parts.map((part, i) => {
    if (!part) return null;

    // Inline code
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return <code key={keyBase + '-c-' + i} style={{
        fontFamily: 'ui-monospace, SF Mono, Menlo, Consolas, monospace',
        fontSize: '0.92em',
        padding: '1px 5px',
        borderRadius: 3,
        background: 'rgba(127, 127, 127, 0.12)',
      }}>{part.slice(1, -1)}</code>;
    }

    // Link
    const linkMatch = /^\[([^\]\n]+)\]\(([^)\n]+)\)$/.exec(part);
    if (linkMatch) {
      return <a
        key={keyBase + '-l-' + i}
        href={linkMatch[2]}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'inherit',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
        }}
      >{linkMatch[1]}</a>;
    }

    // Bold
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={keyBase + '-b-' + i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }

    // Italic
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={keyBase + '-i-' + i}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

function mdParseTableRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map(c => c.trim());
}

function mdParseBlocks(md) {
  const lines = String(md).replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block (``` ... ```)
    if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      blocks.push({ type: 'code', text: codeLines.join('\n') });
      continue;
    }

    // Horizontal rule (--- or ===)
    if (/^[-=*]{3,}\s*$/.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Heading
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      blocks.push({ type: 'h', level: h[1].length, text: h[2] });
      i++;
      continue;
    }

    // Blockquote (multi-line, preserve internal breaks)
    if (line.startsWith('> ') || line === '>') {
      const parts = [];
      while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) {
        parts.push(lines[i] === '>' ? '' : lines[i].slice(2));
        i++;
      }
      blocks.push({ type: 'quote', lines: parts });
      continue;
    }

    // Table — detect by current line having | and next line being a separator row
    if (line.includes('|')
        && i + 1 < lines.length
        && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const headerRow = line;
      i += 2; // skip header + separator row
      const bodyRows = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        bodyRows.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'table', header: headerRow, body: bodyRows });
      continue;
    }

    // Unordered list (- / * / +)
    if (/^[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Ordered list (1. / 2. / ...)
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // Blank line
    if (line.trim() === '') { i++; continue; }

    // Paragraph (consume until blank line or any block-starter)
    const parts = [];
    while (i < lines.length
           && lines[i].trim() !== ''
           && !/^#{1,6}\s+/.test(lines[i])
           && !lines[i].startsWith('> ')
           && lines[i] !== '>'
           && !lines[i].startsWith('```')
           && !/^[-=*]{3,}\s*$/.test(lines[i])
           && !/^[-*+]\s+/.test(lines[i])
           && !/^\d+\.\s+/.test(lines[i])) {
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
              {b.lines.map((ln, j) => (
                <React.Fragment key={j}>
                  {mdInline(ln, 'q' + i + '-' + j)}
                  {j < b.lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </blockquote>
          );
        }

        if (b.type === 'code') {
          return (
            <pre key={i} style={{
              margin: sectionGap + 'px 0',
              padding: '14px 18px',
              background: 'rgba(127, 127, 127, 0.08)',
              border: '1px solid ' + T.rule,
              borderRadius: 4,
              overflowX: 'auto',
              fontFamily: 'ui-monospace, SF Mono, Menlo, Consolas, monospace',
              fontSize: fs + 1,
              lineHeight: 1.5,
              color: T.ink,
              whiteSpace: 'pre',
            }}>{b.text}</pre>
          );
        }

        if (b.type === 'hr') {
          return (
            <hr key={i} style={{
              border: 'none',
              borderTop: '1px solid ' + T.rule,
              margin: (sectionGap + 8) + 'px 0',
            }} />
          );
        }

        if (b.type === 'ul') {
          return (
            <ul key={i} style={{
              margin: sectionGap + 'px 0',
              paddingLeft: 24,
              fontFamily: serif, fontSize: fs + 4, color: T.ink, lineHeight: 1.7,
            }}>
              {b.items.map((item, j) => (
                <li key={j} style={{ marginBottom: 6 }}>
                  {mdInline(item, 'ul' + i + '-' + j)}
                </li>
              ))}
            </ul>
          );
        }

        if (b.type === 'ol') {
          return (
            <ol key={i} style={{
              margin: sectionGap + 'px 0',
              paddingLeft: 24,
              fontFamily: serif, fontSize: fs + 4, color: T.ink, lineHeight: 1.7,
            }}>
              {b.items.map((item, j) => (
                <li key={j} style={{ marginBottom: 6 }}>
                  {mdInline(item, 'ol' + i + '-' + j)}
                </li>
              ))}
            </ol>
          );
        }

        if (b.type === 'table') {
          const header = mdParseTableRow(b.header);
          const body = b.body.map(mdParseTableRow);
          return (
            <div key={i} style={{
              margin: sectionGap + 'px 0',
              overflowX: 'auto',
            }}>
              <table style={{
                borderCollapse: 'collapse',
                fontFamily: serif, fontSize: fs + 2, color: T.ink, lineHeight: 1.5,
                width: '100%',
              }}>
                <thead>
                  <tr>
                    {header.map((c, j) => (
                      <th key={j} style={{
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderBottom: '2px solid ' + T.ink,
                        fontWeight: 600,
                      }}>{mdInline(c, 't' + i + '-h-' + j)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, k) => (
                    <tr key={k}>
                      {row.map((c, j) => (
                        <td key={j} style={{
                          padding: '8px 12px',
                          borderBottom: '1px solid ' + T.rule,
                          verticalAlign: 'top',
                        }}>{mdInline(c, 't' + i + '-b' + k + '-' + j)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // paragraph: render each source line with <br/> between
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
