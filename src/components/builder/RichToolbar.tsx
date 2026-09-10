'use client';

import React from 'react';
import { HiLink } from 'react-icons/hi2';
import styles from './RichToolbar.module.css';

interface RichToolbarProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function RichToolbar({ textareaRef, value, onChange, label }: RichToolbarProps) {
  const applyFormat = (type: 'bold' | 'italic' | 'link') => {
    const el = textareaRef?.current;
    if (!el) {
      // Fallback if ref is not provided: append sample syntax
      if (type === 'bold') onChange(`${value} **bold text**`);
      else if (type === 'italic') onChange(`${value} *italic text*`);
      else if (type === 'link') onChange(`${value} [link text](https://example.com)`);
      return;
    }

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const selected = value.substring(start, end);

    let replacement = '';
    let newCursorPos = start;

    if (type === 'bold') {
      if (selected) {
        replacement = `**${selected}**`;
        newCursorPos = start + replacement.length;
      } else {
        replacement = '**bold text**';
        newCursorPos = start + 2;
      }
    } else if (type === 'italic') {
      if (selected) {
        replacement = `*${selected}*`;
        newCursorPos = start + replacement.length;
      } else {
        replacement = '*italic text*';
        newCursorPos = start + 1;
      }
    } else if (type === 'link') {
      const url = prompt('Enter URL for link (e.g. https://portfolio.dev):', 'https://');
      if (!url) return;
      const textToUse = selected || 'link text';
      replacement = `[${textToUse}](${url})`;
      newCursorPos = start + replacement.length;
    }

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    // Restore focus and cursor position after React re-renders
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className={styles.toolbar} title="Formatting controls">
      <button
        type="button"
        className={`${styles.btn} ${styles.btnBold}`}
        onClick={() => applyFormat('bold')}
        title="Bold text (**text**)"
      >
        B
      </button>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnItalic}`}
        onClick={() => applyFormat('italic')}
        title="Italic text (*text*)"
      >
        I
      </button>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnLink}`}
        onClick={() => applyFormat('link')}
        title="Add hyperlink ([text](url))"
      >
        <HiLink /> Link
      </button>
      {label && <span className={styles.hint}>{label}</span>}
    </div>
  );
}
