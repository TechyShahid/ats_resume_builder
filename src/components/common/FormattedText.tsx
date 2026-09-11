import React from 'react';

interface FormattedTextProps {
  text?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * FormattedText parses markdown and basic HTML syntax:
 * - **bold** or <b>bold</b> -> <strong>bold</strong>
 * - *italic* or <i>italic</i> -> <em>italic</em>
 * - ***bold italic*** -> <strong><em>bold italic</em></strong>
 * - [Link Text](url) -> <a href="url" target="_blank" rel="noopener noreferrer">Link Text</a>
 * - <a href="url">Link Text</a> -> <a href="url" target="_blank" rel="noopener noreferrer">Link Text</a>
 * - Bare URLs: https://... -> clickable link
 */
export default function FormattedText({ text, className, style }: FormattedTextProps) {
  if (!text) return null;

  const elements = parseFormattedText(text);

  return (
    <span className={className} style={style}>
      {elements}
    </span>
  );
}

export function parseFormattedText(text: string): React.ReactNode[] {
  if (!text) return [];

  // Regex pattern matching:
  // 1. Markdown link: [text](url)
  // 2. HTML link: <a href="url">text</a>
  // 3. Bold-italic: ***text*** or ___text___
  // 4. Bold: **text** or __text__ or <b>text</b> or <strong>text</strong>
  // 5. Italic: *text* or _text_ or <i>text</i> or <em>text</em>
  // Regex pattern matching:
  // 1. Color tag: [color=#hex]text[/color] or <span style="color:...">text</span> or <font color="...">text</font>
  // 2. Size tag: [size=...]text[/size]
  // 3. Markdown link: [text](url)
  // 4. HTML link: <a href="url">text</a>
  // 5. Bold-italic: ***text*** or ___text___
  // 6. Bold: **text** or __text__ or <b>text</b> or <strong>text</strong>
  // 7. Italic: *text* or _text_ or <i>text</i> or <em>text</em>
  // 8. Bare URL: (https?:\/\/[^\s]+)
  const tokenRegex =
    /(\[color=([^\]]+)\](.*?)\[\/color\]|<(?:span\s+style=["']color:\s*([^"';]+);?["']|font\s+color=["']([^"']+)["'])>(.*?)<\/(?:span|font)>)|(\[size=([^\]]+)\](.*?)\[\/size\])|(\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|tel:[^\s)]+|[^\s)]+)\))|(<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>(.*?)<\/a>)|(\*\*\*([^*]+)\*\*\*|___([^_]+)___)|(\*\*([^*]+)\*\*|__([^_]+)__|<b>(.*?)<\/b>|<strong>(.*?)<\/strong>)|(\*([^*]+)\*|_([^_]+)_|<i>(.*?)<\/i>|<em>(.*?)<\/em>)|(https?:\/\/[^\s<]+)/gi;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    const matchIndex = match.index;

    // Push preceding plain text
    if (matchIndex > lastIndex) {
      nodes.push(text.substring(lastIndex, matchIndex));
    }

    const [
      fullMatch,
      _colorMatch,
      bbColorVal,
      bbColorText,
      spanColorVal,
      fontColorVal,
      htmlColorText,
      _sizeMatch,
      sizeVal,
      sizeText,
      _mdLink,
      mdLinkText,
      mdLinkUrl,
      _htmlLink,
      htmlLinkUrl,
      htmlLinkText,
      _boldItalic,
      biText1,
      biText2,
      _bold,
      bText1,
      bText2,
      bText3,
      bText4,
      _italic,
      iText1,
      iText2,
      iText3,
      iText4,
      bareUrl,
    ] = match;

    if (bbColorVal && bbColorText !== undefined) {
      nodes.push(
        <span key={`color-${keyIndex++}`} style={{ color: bbColorVal }}>
          {parseFormattedText(bbColorText)}
        </span>
      );
    } else if ((spanColorVal || fontColorVal) && htmlColorText !== undefined) {
      const color = spanColorVal || fontColorVal;
      nodes.push(
        <span key={`color-${keyIndex++}`} style={{ color }}>
          {parseFormattedText(htmlColorText)}
        </span>
      );
    } else if (sizeVal && sizeText !== undefined) {
      // Handle relative sizes like +2, -1 and absolute sizes like 14pt, 16px
      let fontSize: string;
      if (sizeVal.startsWith('+') || sizeVal.startsWith('-')) {
        // Relative: e.g. [size=+2] → calc(1em + 2pt), [size=-1] → calc(1em - 1pt)
        const num = parseFloat(sizeVal);
        if (!isNaN(num)) {
          fontSize = num >= 0 ? `calc(1em + ${num}pt)` : `calc(1em - ${Math.abs(num)}pt)`;
        } else {
          fontSize = 'inherit';
        }
      } else if (sizeVal.endsWith('pt') || sizeVal.endsWith('px') || sizeVal.endsWith('em') || sizeVal.endsWith('%')) {
        fontSize = sizeVal;
      } else {
        // Bare number treated as pt
        fontSize = `${sizeVal}pt`;
      }
      nodes.push(
        <span key={`size-${keyIndex++}`} style={{ fontSize }}>
          {parseFormattedText(sizeText)}
        </span>
      );
    } else if (mdLinkText && mdLinkUrl) {
      // [text](url)
      const href = mdLinkUrl.startsWith('http') || mdLinkUrl.startsWith('mailto:') || mdLinkUrl.startsWith('tel:')
        ? mdLinkUrl
        : `https://${mdLinkUrl}`;
      nodes.push(
        <a
          key={`link-${keyIndex++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}
        >
          {parseFormattedText(mdLinkText)}
        </a>
      );
    } else if (htmlLinkUrl !== undefined) {
      // <a href="...">text</a>
      const href = htmlLinkUrl.startsWith('http') || htmlLinkUrl.startsWith('mailto:') || htmlLinkUrl.startsWith('tel:')
        ? htmlLinkUrl
        : `https://${htmlLinkUrl}`;
      nodes.push(
        <a
          key={`link-${keyIndex++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}
        >
          {parseFormattedText(htmlLinkText || href)}
        </a>
      );
    } else if (biText1 || biText2) {
      // ***bold italic***
      const content = biText1 || biText2;
      nodes.push(
        <strong key={`bi-${keyIndex++}`}>
          <em>{parseFormattedText(content)}</em>
        </strong>
      );
    } else if (bText1 || bText2 || bText3 || bText4) {
      // **bold**
      const content = bText1 || bText2 || bText3 || bText4;
      nodes.push(<strong key={`b-${keyIndex++}`}>{parseFormattedText(content)}</strong>);
    } else if (iText1 || iText2 || iText3 || iText4) {
      // *italic*
      const content = iText1 || iText2 || iText3 || iText4;
      nodes.push(<em key={`i-${keyIndex++}`}>{parseFormattedText(content)}</em>);
    } else if (bareUrl) {
      // Bare URL
      nodes.push(
        <a
          key={`url-${keyIndex++}`}
          href={bareUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}
        >
          {bareUrl}
        </a>
      );
    } else {
      nodes.push(fullMatch);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  // Push remaining trailing text
  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return nodes;
}
