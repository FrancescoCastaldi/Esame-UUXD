const fs = require('fs');
const path = require('path');

const texName = process.argv[2] || '02-inspection-card.tex';
const texPath = path.resolve(__dirname, texName);
let tex = fs.readFileSync(texPath, 'utf8');

// ---- STRIP PREAMBLE ----
tex = tex.replace(/\\documentclass[^}]*\}[\s\S]*?\\begin\{document\}/, '');
tex = tex.replace(/\\end\{document\}[\s\S]*$/, '');

// ---- STRIP COMMENTS ----
tex = tex.replace(/^%.*/gm, '');

// ---- MATH MODE ----
tex = tex.replace(/\$\\bullet\$/g, '•');
tex = tex.replace(/\$\\circ\$/g, '◦');
tex = tex.replace(/\$\\rightarrow\$/g, '→');
tex = tex.replace(/\$\\Rightarrow\$/g, '⇒');
tex = tex.replace(/\$\\leftarrow\$/g, '←');
tex = tex.replace(/\$\\Leftarrow\$/g, '⇐');
tex = tex.replace(/\$\\neq\$/g, '≠');
tex = tex.replace(/\$([^$]+)\$/g, '$1');

// ---- COLOR ----
tex = tex.replace(/\\color\{[^}]*\}/g, '');
tex = tex.replace(/\\definecolor\{[^}]*\}\{[^}]*\}\{[^}]*\}/g, '');

// ---- FIGURE ----
tex = tex.replace(/\\begin\{figure\}(\[[^\]]*\])?/g, '');
tex = tex.replace(/\\end\{figure\}/g, '');
tex = tex.replace(/\\centering/g, '');
tex = tex.replace(/\\captionsetup\{[^}]*\}/g, '');

// ---- RENEWCOMMAND / ROWCOLOR ----
tex = tex.replace(/\\renewcommand\s*\{[^}]*\}\s*\{[^}]*\}/g, '');
tex = tex.replace(/\\rowcolor\s*(\[[^\]]*\])?\s*\{[^}]*\}/g, '');

// ---- \# ----
tex = tex.replace(/\\#/g, '#');

// ---- TARGETED BRACKET REMOVAL ----
tex = tex.replace(/\[leftmargin=\*\]/g, '');
tex = tex.replace(/\[\d+\.?\d*(cm|mm|in|pt|px)\]/g, '');

// ---- V/H SPACE ----
tex = tex.replace(/\\vspace\s*\*?\s*\{[^}]*\}/g, '');
tex = tex.replace(/\\hspace\s*\*?\s*\{[^}]*\}/g, '');

// ---- LABEL / REF / PHANTOM ----
tex = tex.replace(/\\label\{[^}]*\}/g, '');
tex = tex.replace(/\\ref\{[^}]*\}/g, '');
tex = tex.replace(/\\phantomsection/g, '');

// ---- SIZE & FONT COMMANDS ----
const sizeCmds = [
  'tiny','scriptsize','footnotesize','small','normalsize','large','Large',
  'LARGE','huge','Huge','normalfont','sffamily','bfseries','itshape',
  'scshape','slshape','upshape','mdseries','rmfamily','ttfamily',
  'noindent'
];
for (const cmd of sizeCmds) {
  // Match: backslash + command name + (optional non-word character)
  // Need to handle cases like \noindentLa (no word boundary between t and L)
  tex = tex.replace(new RegExp(`\\\\${cmd}(?![a-zA-Z])`, 'g'), '');
}

// ---- TEXT COMMANDS (nested-safe: [^}]* for single-level) ----
tex = tex.replace(/\\texttt\{([^}]*)\}/g, '<code>$1</code>');
tex = tex.replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>');
tex = tex.replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>');
tex = tex.replace(/\\textnormal\{([^}]*)\}/g, '$1');
tex = tex.replace(/\\textsc\{([^}]*)\}/g, '<span style="font-variant:small-caps">$1</span>');
tex = tex.replace(/\\textcolor\{([^}]*)\}\{([^}]*)\}/g, '<span style="color:$1">$2</span>');
tex = tex.replace(/\\textsf\{([^}]*)\}/g, '<span style="font-family:sans-serif">$1</span>');
tex = tex.replace(/\\textmd\{([^}]*)\}/g, '$1');
tex = tex.replace(/\\textup\{([^}]*)\}/g, '$1');
tex = tex.replace(/\\textsl\{([^}]*)\}/g, '<em>$1</em>');
tex = tex.replace(/\\text\{([^}]*)\}/g, '$1');
tex = tex.replace(/\\underline\{([^}]*)\}/g, '<u>$1</u>');
tex = tex.replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>');

// ---- INCLUDEGRAPHICS ----
tex = tex.replace(/\\includegraphics\s*(\[[^\]]*\])?\s*\{([^}]*)\}/g, (match, opts, file) => {
  let width = '';
  if (opts) {
    const w = opts.match(/width\s*=\s*([0-9.]+)\\textwidth/);
    if (w) {
      width = ` style="width:${Math.round(parseFloat(w[1]) * 100)}%"`;
    }
  }
  return `<img src="${file}" alt="Screenshot"${width} class="screenshot">`;
});

// ---- CAPTION ----
tex = tex.replace(/\\caption\s*\{([^}]*)\}/g, '<p class="caption">$1</p>');

// ---- SECTIONS ----
tex = tex.replace(/\\section\s*\{([^}]*)\}/g, '<h2 class="section">$1</h2>');
tex = tex.replace(/\\subsection\s*\{([^}]*)\}/g, '<h3 class="subsection">$1</h3>');
tex = tex.replace(/\\subsubsection\s*\{([^}]*)\}/g, '<h4 class="subsubsection">$1</h4>');

// ---- LISTS ----
tex = tex.replace(/\\begin\{itemize\}/g, '<ul class="itemize">');
tex = tex.replace(/\\end\{itemize\}/g, '</ul>');
tex = tex.replace(/\\begin\{enumerate\}/g, '<ol class="enumerate">');
tex = tex.replace(/\\end\{enumerate\}/g, '</ol>');
tex = tex.replace(/\\item\s*\[([^\]]*)\]/g, '<li><strong>$1</strong> ');
tex = tex.replace(/\\item/g, '<li>');

// ---- TCOLORBOX ----
tex = tex.replace(/\\begin\{tcolorbox\}\s*\[([^\]]*)\]/g, (match, opts) => {
  let style = 'border:1px solid #D1D5DB;border-radius:6px;padding:12px 16px;margin:10px 0;background:#fff;';
  if (opts.includes('colback=primaryColor,')) {
    style = 'background:#0054A6;color:white;border-radius:6px;padding:12px 16px;margin:10px 0;';
  } else if (opts.includes('colback=primaryColor!10')) {
    style = 'background:#E8F0FA;border:1px solid #0054A6;border-radius:6px;padding:12px 16px;margin:10px 0;';
  } else if (opts.includes('colback=backgroundColor')) {
    style = 'background:#F5F6FA;border:1px solid #D1D5DB;border-radius:6px;padding:12px 16px;margin:10px 0;';
  } else if (opts.includes('colback=accentGreen!5')) {
    style = 'background:#F0FDF4;border:1px solid #059669;border-radius:6px;padding:12px 16px;margin:10px 0;';
  }
  return `<div style="${style}">`;
});
tex = tex.replace(/\\end\{tcolorbox\}/g, '</div>');

// ---- TABLE: handle \begin{tabular} with nested braces in column spec ----
// MUST come before the generic \begin{} strip below
// Match: \begin{tabular} + optional whitespace + { + anything with up to 1 level of { } nesting + }
tex = tex.replace(
  /\\begin\{tabular\}\s*(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/g,
  (match, spec) => {
    return '<table class="tabular">';
  }
);
tex = tex.replace(/\\end\{tabular\}/g, '</table>');

// ---- TABLE: \multicolumn{n}{align}{text} ----
// align can have nested braces like {L{11cm}|}
tex = tex.replace(/\\multicolumn\{[^}]*\}\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}\{([^}]*)\}/g, '$1');

// ---- TABLE: \hline ----
tex = tex.replace(/\\hline\s*/g, '');

// ---- TABLE: \\[optional] → row marker ----
tex = tex.replace(/\\\\\[[^\]]*\]\s*/g, '<ROW>');
tex = tex.replace(/\\\\\s*/g, '<ROW>');

// ---- SPECIAL CHARS ----
tex = tex.replace(/\\euro\{\}/g, '€');
tex = tex.replace(/\\euro\b(?!\{)/g, '€');
tex = tex.replace(/``/g, '"');
tex = tex.replace(/''/g, '"');
tex = tex.replace(/---/g, '—');
tex = tex.replace(/--/g, '–');

// ---- ACCENTS ----
const accents = {
  '\\`a': 'à', "\\'a": 'á', '\\^a': 'â', '\\"a': 'ä', '\\~a': 'ã',
  '\\`e': 'è', "\\'e": 'é', '\\^e': 'ê', '\\"e': 'ë',
  '\\`i': 'ì', "\\'i": 'í', '\\^i': 'î', '\\"i': 'ï',
  '\\`o': 'ò', "\\'o": 'ó', '\\^o': 'ô', '\\"o': 'ö', '\\~o': 'õ',
  '\\`u': 'ù', "\\'u": 'ú', '\\^u': 'û', '\\"u': 'ü',
  "\\'c": 'ç', "\\'C": 'Ç', "\\'n": 'ñ',
  '\\`A': 'À', "\\'A": 'Á', '\\^A': 'Â', '\\"A': 'Ä', '\\~A': 'Ã',
  '\\`E': 'È', "\\'E": 'É', '\\^E': 'Ê', '\\"E': 'Ë',
  '\\`I': 'Ì', "\\'I": 'Í', '\\^I': 'Î', '\\"I': 'Ï',
  '\\`O': 'Ò', "\\'O": 'Ó', '\\^O': 'Ô', '\\"O': 'Ö', '\\~O': 'Õ',
  '\\`U': 'Ù', "\\'U": 'Ú', '\\^U': 'Û', '\\"U': 'Ü',
};
for (const [cmd, char] of Object.entries(accents)) {
  tex = tex.replace(new RegExp(cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), char);
}

// ---- TEXT SYMBOLS ----
const textSymbols = [
  ['\\\\textdegree', '°'],
  ['\\\\textellipsis', '…'],
  ['\\\\textregistered', '®'],
  ['\\\\texttrademark', '™'],
  ['\\\\textbullet', '•'],
  ['\\\\textendash', '–'],
  ['\\\\textemdash', '—'],
  ['\\\\textasciitilde', '~'],
  ['\\\\textbackslash', '\\\\'],
  ['\\\\textless', '<'],
  ['\\\\textgreater', '>'],
  ['\\\\textbar', '|'],
  ['\\\\textunderscore', '_'],
  ['\\\\textbraceleft', '{'],
  ['\\\\textbraceright', '}'],
  ['\\\\textasciicircum', '^'],
  ['\\\\textdollar', '$'],
  ['\\\\texteuro', '€'],
];
for (const [cmd, char] of textSymbols) {
  tex = tex.replace(new RegExp(cmd + '(\\{\\})?', 'g'), char);
}

// ---- \$ ----
tex = tex.replace(/\\\$/g, '€');

// ---- CLEAN STRAY BACKSLASHES ----
// Remove any remaining backslash that's not part of HTML
tex = tex.replace(/\\(?!(&|amp|lt|gt|quot|#34|#38|#60|#62|#|$|\s|<|>|u))/g, '');

// ---- FINAL CLEANUP: remove orphaned 'noindent' text ----
tex = tex.replace(/noindent/g, '');

// ---- POST-PROCESS: TABLE ROWS ----
// Find each <table> block and convert content to proper <tr><td>
tex = tex.replace(/<table class="tabular">[\s\S]*?<\/table>/g, (tableBlock) => {
  // Remove <p> and </p> inside
  let t = tableBlock.replace(/<\/?p>/g, '');
  
  // Extract content between opening <table> and closing </table>
  let content = t.replace(/<table class="tabular">\s*/, '').replace(/\s*<\/table>\s*$/, '');
  
  // Split by <ROW> markers
  const rows = content.split(/<ROW>/).map(r => r.trim()).filter(r => r.length > 0);
  
  if (rows.length === 0) return '<table class="tabular">\n</table>';
  
  let result = '<table class="tabular">\n';
  for (let rawRow of rows) {
    // Clean up row: remove leading/trailing | and } characters
    let row = rawRow.replace(/^[|}\s]+/, '').replace(/[|}\s]+$/, '');
    if (!row) continue;
    
    // Split by &
    const cells = row.split(/\s*&\s*/).map(c => c.trim()).filter(c => c.length > 0);
    if (cells.length === 0) continue;
    
    result += '  <tr>';
    for (const cell of cells) {
      result += `<td>${cell}</td>`;
    }
    result += '</tr>\n';
  }
  result += '</table>';
  return result;
});

// ---- PARAGRAPH WRAPPING ----
const paragraphs = tex.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 0);

const html = buildHtml(paragraphs);

function buildHtml(paragraphs) {
  const title = texName.replace(/\.tex$/, '').replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  let html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  @page { margin: 2cm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  h2.section { color: #0054A6; font-size: 18pt; border-bottom: 2px solid #D1D5DB; padding-bottom: 4px; margin-top: 24px; }
  h3.subsection { color: #374151; font-size: 14pt; margin-top: 18px; }
  h4.subsubsection { color: #374151; font-size: 12pt; margin-top: 14px; }
  strong { font-weight: bold; }
  em { font-style: italic; }
  code { font-family: 'Consolas', monospace; background: #f4f4f4; padding: 0 4px; border-radius: 3px; }
  img.screenshot { max-width: 100%; height: auto; border: 1px solid #ccc; border-radius: 4px; margin: 12px 0; display: block; }
  p.caption { font-size: 10pt; color: #555; margin: -6px 0 16px 0; font-style: italic; }
  table.tabular { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10pt; }
  table.tabular td { border: 1px solid #D1D5DB; padding: 6px 8px; vertical-align: top; }
  table.tabular td:first-child { background: #F5F6FA; font-weight: bold; width: 120px; }
  ul.itemize, ol.enumerate { padding-left: 24px; margin: 8px 0; }
  li { margin-bottom: 3px; }
  hr { border: none; border-top: 1px solid #D1D5DB; margin: 16px 0; }
  a { color: #0054A6; }
</style>
</head>
<body>
`;

  for (const para of paragraphs) {
    if (!para) continue;
    
    // Skip if it's just leftover brackets
    if (/^[\[\]{}|\\,;:.]+$/.test(para)) continue;
    
    const trimmed = para;
    
    // Already an HTML block element
    if (/^<(h[234]|div|table|ul|ol|li|img|p\b)/.test(trimmed) ||
        /^<\/(div|table|ul|ol)/.test(trimmed)) {
      html += trimmed + '\n';
    }
    // Lines starting with <tr>/<td> 
    else if (/^<(tr|td|th)/.test(trimmed)) {
      html += trimmed + '\n';
    }
    else {
      html += `<p>${trimmed}</p>\n`;
    }
  }

  html += `</body></html>`;
  return html;
}

// ---- WRITE HTML ----
const htmlPath = path.resolve(__dirname, 'out.html');
fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`HTML: ${Buffer.byteLength(html, 'utf8')} bytes`);

// ---- GENERATE PDF ----
(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const fileUrl = 'file://' + htmlPath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  const pdfName = texName.replace(/\.tex$/, '.pdf');
  const pdfPath = path.resolve(__dirname, pdfName);
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log('PDF created!');
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
