'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import {
  RESUME_FONTS,
  RESUME_FONT_SIZES,
  PRESET_COLORS,
  type ResumeFontFamily,
  type ResumeFontSize,
} from '@/types/resume';
import {
  HiPlus,
  HiMinus,
  HiLink,
  HiPencilSquare,
  HiBackspace,
  HiSparkles,
} from 'react-icons/hi2';
import styles from './ResumeStylingStrip.module.css';

export default function ResumeStylingStrip() {
  const {
    resumeData,
    selectedFont,
    setSelectedFont,
    selectedFontSize,
    setSelectedFontSize,
    fieldStyles,
    setAccentColor,
    resetFieldStyles,
    activeSelection,
    setActiveSelection,
    applyFormatToSelection,
  } = useResume();

  const handleApplyFormat = (
    type: 'bold' | 'italic' | 'color' | 'size' | 'link' | 'clear' | 'edit_text',
    val?: string | number
  ) => {
    if (type === 'link') {
      const currentUrl = prompt('Enter URL for link (e.g. https://portfolio.dev):', 'https://');
      if (!currentUrl) return;
      applyFormatToSelection('link', currentUrl);
      return;
    }

    if (type === 'edit_text') {
      const currentText = activeSelection?.text || '';
      const newText = prompt('Edit wording for selected word/field:', currentText);
      if (newText === null) return;
      applyFormatToSelection('edit_text', newText);
      return;
    }

    applyFormatToSelection(type, val);
  };

  const handleFieldSelectDropdown = (fieldPath: string) => {
    if (!fieldPath) {
      setActiveSelection(null);
      return;
    }

    let textVal = '';
    let label = '';

    if (fieldPath === 'personalInfo.fullName') {
      textVal = resumeData.personalInfo.fullName;
      label = 'Full Name';
    } else if (fieldPath === 'personalInfo.title') {
      textVal = resumeData.personalInfo.title;
      label = 'Job Title';
    } else if (fieldPath === 'summary') {
      textVal = resumeData.summary;
      label = 'Summary';
    } else {
      const expMatch = fieldPath.match(/^experience\.(\d+)\.(\w+)$/);
      if (expMatch) {
        const idx = parseInt(expMatch[1], 10);
        const key = expMatch[2];
        const exp = resumeData.experience[idx];
        if (exp) {
          textVal = (exp as unknown as Record<string, unknown>)[key] as string || '';
          label = `Exp #${idx + 1} ${key.charAt(0).toUpperCase() + key.slice(1)}`;
        }
      }
      const eduMatch = fieldPath.match(/^education\.(\d+)\.(\w+)$/);
      if (eduMatch) {
        const idx = parseInt(eduMatch[1], 10);
        const key = eduMatch[2];
        const edu = resumeData.education[idx];
        if (edu) {
          textVal = (edu as unknown as Record<string, unknown>)[key] as string || '';
          label = `Edu #${idx + 1} ${key.charAt(0).toUpperCase() + key.slice(1)}`;
        }
      }
      const projMatch = fieldPath.match(/^projects\.(\d+)\.(\w+)$/);
      if (projMatch) {
        const idx = parseInt(projMatch[1], 10);
        const key = projMatch[2];
        const proj = resumeData.projects[idx];
        if (proj) {
          textVal = (proj as unknown as Record<string, unknown>)[key] as string || '';
          label = `Project #${idx + 1} ${key.charAt(0).toUpperCase() + key.slice(1)}`;
        }
      }
    }

    // Try finding the input element in the DOM for this field via data-field-path
    let el: HTMLInputElement | HTMLTextAreaElement | null = null;
    if (typeof document !== 'undefined') {
      el = document.querySelector(`[data-field-path="${fieldPath}"]`) as HTMLInputElement | HTMLTextAreaElement;
    }

    if (el) {
      el.focus();
      el.select();
    }

    setActiveSelection({
      text: textVal,
      fieldLabel: label,
      fieldPath,
      element: el,
      start: 0,
      end: textVal.length,
    });
  };

  const displayText = activeSelection?.text?.trim() || '';
  const displayLabel = activeSelection?.fieldLabel || 'Selected Word / Field';

  return (
    <div className={styles.stripContainer} data-styling-strip="true" title="Universal text &amp; field styling strip">
      {/* 1. Global Font Family */}
      <div className={styles.group}>
        <span className={styles.groupLabel}>Font</span>
        <select
          className={styles.select}
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value as ResumeFontFamily)}
          title="Resume Font Family"
        >
          {RESUME_FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Global Base Size */}
      <div className={styles.group}>
        <span className={styles.groupLabel}>Base</span>
        <select
          className={styles.select}
          value={selectedFontSize}
          onChange={(e) => setSelectedFontSize(e.target.value as ResumeFontSize)}
          title="Base Font Size"
        >
          {RESUME_FONT_SIZES.map((size) => (
            <option key={size.id} value={size.id}>
              {size.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.divider} />

      {/* 3. Word / Field Selection Indicator & Quick Chooser */}
      <div className={styles.targetGroup}>
        {displayText ? (
          <div
            className={styles.targetBadge}
            title={`${displayLabel}: "${displayText}"`}
          >
            <span>🎯</span>
            <span className={styles.targetText}>
              {displayLabel}: &ldquo;{displayText.length > 18 ? displayText.substring(0, 18) + '…' : displayText}&rdquo;
            </span>
          </div>
        ) : (
          <select
            className={styles.select}
            onChange={(e) => handleFieldSelectDropdown(e.target.value)}
            defaultValue=""
            title="Select any field to format or edit, or highlight any word in the editor/preview"
          >
            <option value="" disabled>
              Select Word or Field...
            </option>
            <option value="personalInfo.fullName">Full Name ({resumeData.personalInfo.fullName || 'Name'})</option>
            <option value="personalInfo.title">Job Title ({resumeData.personalInfo.title || 'Title'})</option>
            {resumeData.summary && <option value="summary">Summary</option>}
            {resumeData.experience.map((exp, i) => (
              <option key={exp.id} value={`experience.${i}.position`}>
                Exp #{i + 1}: {exp.position || 'Role'}
              </option>
            ))}
            {resumeData.experience.map((exp, i) => (
              <option key={`comp-${exp.id}`} value={`experience.${i}.company`}>
                Exp #{i + 1}: {exp.company || 'Company'}
              </option>
            ))}
            {resumeData.education.map((edu, i) => (
              <option key={edu.id} value={`education.${i}.degree`}>
                Edu #{i + 1}: {edu.degree || 'Degree'}
              </option>
            ))}
            {resumeData.projects.map((proj, i) => (
              <option key={proj.id} value={`projects.${i}.name`}>
                Project #{i + 1}: {proj.name || 'Project'}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 4. Word / Field Formatting Controls */}
      {/* Font Size Adjusters [-] [+] */}
      <div className={styles.group}>
        <span className={styles.groupLabel}>Size</span>
        <div className={styles.sizeControls}>
          <button
            type="button"
            className={styles.sizeBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleApplyFormat('size', '-1')}
            title="Decrease size of selected word/field (-1pt)"
          >
            <HiMinus size={11} />
          </button>
          <button
            type="button"
            className={styles.sizeBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleApplyFormat('size', '+2')}
            title="Increase size of selected word/field (+2pt)"
          >
            <HiPlus size={11} />
          </button>
        </div>
      </div>

      {/* Bold & Italic Toggles */}
      <div className={styles.group}>
        <div className={styles.styleToggles}>
          <button
            type="button"
            className={styles.toolBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleApplyFormat('bold')}
            title="Make selected word/field Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleApplyFormat('italic')}
            title="Make selected word/field Italic"
          >
            <em>I</em>
          </button>
        </div>
      </div>

      {/* Color Swatches & Native Color Picker */}
      <div className={styles.group}>
        <span className={styles.groupLabel}>Color</span>
        <div className={styles.colorGroup}>
          <div className={styles.swatches}>
            {PRESET_COLORS.filter(p => p.hex).map((preset) => (
              <button
                key={preset.name}
                type="button"
                className={styles.swatchBtn}
                style={{ background: preset.hex }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleApplyFormat('color', preset.hex)}
                title={`Color: ${preset.name} (${preset.hex})`}
              />
            ))}
          </div>

          <div className={styles.colorPickerWrap}>
            <input
              type="color"
              className={styles.colorInput}
              defaultValue="#2563eb"
              onChange={(e) => handleApplyFormat('color', e.target.value)}
              title="Custom hex color picker for selected word/field"
            />
          </div>
        </div>
      </div>

      {/* Link button */}
      <div className={styles.group}>
        <button
          type="button"
          className={styles.toolBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleApplyFormat('link')}
          title="Add hyperlink to selected word/field"
        >
          <HiLink size={12} /> Link
        </button>
      </div>

      {/* Direct Edit Wording button */}
      <div className={styles.group}>
        <button
          type="button"
          className={styles.toolBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleApplyFormat('edit_text')}
          title="Edit wording of selected word or field"
        >
          <HiPencilSquare size={12} /> Edit Text
        </button>
      </div>

      {/* Clear Formatting button */}
      <div className={styles.group}>
        <button
          type="button"
          className={styles.clearBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleApplyFormat('clear')}
          title="Remove all formatting (bold, italic, colors, sizes) from selected word/field"
        >
          <HiBackspace size={12} /> Clear Format
        </button>
      </div>

      <div className={styles.divider} />

      {/* 5. Global Accent Theme Swatches */}
      <div className={styles.group}>
        <span className={styles.groupLabel}>Theme Accent</span>
        <div className={styles.colorGroup}>
          <div className={styles.swatches}>
            {PRESET_COLORS.filter(p => p.hex).slice(0, 5).map((preset) => (
              <button
                key={`accent-${preset.name}`}
                type="button"
                className={styles.swatchBtn}
                style={{ background: preset.hex }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setAccentColor(preset.hex)}
                title={`Theme Accent: ${preset.name}`}
              />
            ))}
          </div>
          <div className={styles.colorPickerWrap}>
            <input
              type="color"
              className={styles.colorInput}
              value={fieldStyles.accentColor || '#6366f1'}
              onChange={(e) => setAccentColor(e.target.value)}
              title="Global Theme Accent Color"
            />
          </div>
        </div>
      </div>

      {/* Reset All */}
      <div className={styles.group}>
        <button
          type="button"
          className={styles.clearBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={resetFieldStyles}
          title="Reset theme and font overrides to default"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
