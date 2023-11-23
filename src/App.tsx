import React, { MutableRefObject, useRef, useState } from 'react';
import './style.css';

const handleCopyToClipboard = (textEl: MutableRefObject<Node>) => {
  try {
    const wdsl = window.getSelection().removeAllRanges();
    var range = document.createRange();
    range.selectNode(textEl.current);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  } catch (e) {
    console.log('Error copy', e);
  }
};

export const App: React.FC = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [showFormatted, setShowFormatted] = useState(false);
  const textEl = useRef(null);

  const formatHTML = (html: string) => {
    const lines = html.split(/(?=<)/g);
    let formattedHTML = '';
    let indentLevel = 0;

    lines.forEach((line) => {
      if (line.startsWith('</')) {
        indentLevel--;
      }

      formattedHTML += '  '.repeat(Math.max(indentLevel, 0)) + line + '\n';

      if (
        line.startsWith('<') &&
        !line.startsWith('</') &&
        !line.endsWith('/>') &&
        !line.includes('DOCTYPE')
      ) {
        indentLevel++;
      }
    });

    return formattedHTML.trim();
  };

  const downloadFormattedHTML = () => {
    const formattedHTML = formatHTML(htmlCode);
    const blob = new Blob([formattedHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formatted.html';
    link.click();
  };
  return (
    <div className="html-viewer-container">
      <div className="html-viewer-section">
        <textarea
          className="html-viewer-textarea"
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          placeholder="Escribe o pega tu HTML aquí..."
        />
      </div>

      <div className="html-viewer-section">
        <div className="html-viewer-toolbar">
          <button
            onClick={() => setShowFormatted(!showFormatted)}
            className="html-viewer-toolbar-button"
          >
            <i
              className={`html-viewer-icon ${
                showFormatted ? 'fa-solid fa-eye' : 'fa-solid fa-code'
              }`}
            ></i>
          </button>
          <button
            onClick={downloadFormattedHTML}
            className="html-viewer-toolbar-button"
          >
            <i
              aria-hidden="true"
              className="fa fa-download html-viewer-icon"
            ></i>
          </button>
          <button
            onClick={() => handleCopyToClipboard(textEl)}
            className="html-viewer-toolbar-button"
          >
            <i
              aria-hidden="true"
              className="fa-regular fa-copy html-viewer-icon"
            ></i>
          </button>
        </div>
        <div
          className={`html-viewer-output ${
            showFormatted
              ? 'html-viewer-output-formatted'
              : 'html-viewer-output-raw'
          }`}
        >
          {showFormatted ? (
            <pre ref={textEl}>{formatHTML(htmlCode)}</pre>
          ) : (
            <iframe
              srcDoc={htmlCode}
              style={{ width: '100%', height: '100%' }}
              frameBorder="0"
            />
          )}
        </div>
      </div>
    </div>
  );
};
