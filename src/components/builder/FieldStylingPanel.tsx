'use client';

import React, { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import {
  ResumeFieldStyles,
  FieldCustomization,
  PRESET_COLORS,
} from '@/types/resume';
import {
  HiArrowPath,
  HiPlus,
  HiMinus,
  HiSwatch,
  HiXMark,
} from 'react-icons/hi2';
import styles from './FieldStylingPanel.module.css';

type StylableField = 'name' | 'title' | 'sectionTitle' | 'entryTitle' | 'bodyText' | 'accent';

interface TabConfig {
  id: StylableField;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { id: 'name', label: 'Name', icon: '👤' },
  { id: 'title', label: 'Title', icon: '💼' },
  { id: 'sectionTitle', label: 'Headings', icon: '📑' },
  { id: 'entryTitle', label: 'Roles', icon: '🏢' },
  { id: 'bodyText', label: 'Body', icon: '📝' },
  { id: 'accent', label: 'Accent', icon: '🎨' },
];

interface FieldStylingPanelProps {
  className?: string;
  compact?: boolean;
  onClose?: () => void;
}

export default function FieldStylingPanel({
  className = '',
  compact = false,
  onClose,
}: FieldStylingPanelProps) {
  const {
    fieldStyles,
    updateFieldStyle,
    setAccentColor,
    resetFieldStyles,
  } = useResume();

  const [activeTab, setActiveTab] = useState<StylableField>('name');

  const currentFieldKey = activeTab !== 'accent' ? (activeTab as keyof Omit<ResumeFieldStyles, 'accentColor'>) : null;
  const currentCustomization: FieldCustomization = currentFieldKey ? fieldStyles[currentFieldKey] || {} : {};

  const currentSize = currentCustomization.size ?? 0;
  const isBold = currentCustomization.bold;
  const isItalic = currentCustomization.italic;
  const currentColor = currentCustomization.color || '';

  const handleSizeChange = (delta: number) => {
    if (!currentFieldKey) return;
    const newSize = Math.max(-6, Math.min(10, currentSize + delta));
    updateFieldStyle(currentFieldKey, 'size', newSize);
  };

  const handleSetExactSize = (val: number) => {
    if (!currentFieldKey) return;
    updateFieldStyle(currentFieldKey, 'size', val);
  };

  const handleToggleBold = () => {
    if (!currentFieldKey) return;
    updateFieldStyle(currentFieldKey, 'bold', !isBold);
  };

  const handleToggleItalic = () => {
    if (!currentFieldKey) return;
    updateFieldStyle(currentFieldKey, 'italic', !isItalic);
  };

  const handleColorChange = (hex: string) => {
    if (activeTab === 'accent') {
      setAccentColor(hex);
    } else if (currentFieldKey) {
      updateFieldStyle(currentFieldKey, 'color', hex);
    }
  };

  const handleResetCurrentField = () => {
    if (activeTab === 'accent') {
      setAccentColor('');
    } else if (currentFieldKey) {
      updateFieldStyle(currentFieldKey, 'size', 0);
      updateFieldStyle(currentFieldKey, 'bold', undefined);
      updateFieldStyle(currentFieldKey, 'italic', undefined);
      updateFieldStyle(currentFieldKey, 'color', '');
    }
  };

  return (
    <div
      className={`${styles.container} ${compact ? styles.compactContainer : ''} ${className}`}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <span className={styles.title}>
            <HiSwatch size={14} /> Field Styling
          </span>
          <span className={styles.badge}>All Templates</span>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={resetFieldStyles}
            className={styles.subtleDangerBtn}
            title="Reset all styling overrides to template defaults"
          >
            <HiArrowPath size={11} /> Reset All
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={styles.closeBtn}
              title="Close panel"
            >
              <HiXMark size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Mini Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const hasCustom =
            tab.id === 'accent'
              ? Boolean(fieldStyles.accentColor)
              : Boolean(
                  fieldStyles[tab.id as keyof Omit<ResumeFieldStyles, 'accentColor'>]?.size ||
                  fieldStyles[tab.id as keyof Omit<ResumeFieldStyles, 'accentColor'>]?.bold !== undefined ||
                  fieldStyles[tab.id as keyof Omit<ResumeFieldStyles, 'accentColor'>]?.italic !== undefined ||
                  fieldStyles[tab.id as keyof Omit<ResumeFieldStyles, 'accentColor'>]?.color
                );

          return (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {hasCustom && <span className={styles.dotIndicator} />}
            </button>
          );
        })}
      </div>

      {/* Compact Controls Area */}
      <div className={styles.controlArea}>
        {activeTab !== 'accent' ? (
          <>
            {/* Row 1: Size adjustments + Bold/Italic toggles on single row */}
            <div className={styles.flexRow}>
              <div className={styles.sizeGroup}>
                <span className={styles.sizeLabel}>Size</span>
                <button
                  type="button"
                  className={styles.sizeBtn}
                  onClick={() => handleSizeChange(-1)}
                  title="Decrease font size (-1pt)"
                  disabled={currentSize <= -6}
                >
                  <HiMinus size={11} />
                </button>
                <span className={styles.sizeDisplay}>
                  {currentSize === 0 ? '0' : currentSize > 0 ? `+${currentSize}pt` : `${currentSize}pt`}
                </span>
                <button
                  type="button"
                  className={styles.sizeBtn}
                  onClick={() => handleSizeChange(1)}
                  title="Increase font size (+1pt)"
                  disabled={currentSize >= 10}
                >
                  <HiPlus size={11} />
                </button>

                <div className={styles.presetGroup}>
                  <button
                    type="button"
                    className={`${styles.presetBtn} ${currentSize === 0 ? styles.presetBtnActive : ''}`}
                    onClick={() => handleSetExactSize(0)}
                    title="Default size"
                  >
                    Def
                  </button>
                  <button
                    type="button"
                    className={`${styles.presetBtn} ${currentSize === 2 ? styles.presetBtnActive : ''}`}
                    onClick={() => handleSetExactSize(2)}
                    title="+2pt size"
                  >
                    +2
                  </button>
                </div>
              </div>

              {/* Bold & Italic toggles */}
              <div className={styles.styleToggles}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${isBold ? styles.toggleBtnActive : ''}`}
                  onClick={handleToggleBold}
                  title="Toggle Bold"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${isItalic ? styles.toggleBtnActive : ''}`}
                  onClick={handleToggleItalic}
                  title="Toggle Italic"
                >
                  <em>I</em>
                </button>
              </div>
            </div>

            {/* Row 2: Color swatches & picker */}
            <div className={styles.colorRow}>
              <div className={styles.swatches}>
                {PRESET_COLORS.map((preset) => {
                  const isSelected = currentColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      className={`${styles.swatchBtn} ${isSelected ? styles.swatchActive : ''}`}
                      style={{ background: preset.hex || '#cbd5e1' }}
                      onClick={() => handleColorChange(preset.hex)}
                      title={`${preset.name} ${preset.hex || '(Default)'}`}
                    />
                  );
                })}
              </div>

              <div className={styles.colorPickerWrap}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={currentColor || '#1e293b'}
                  onChange={(e) => handleColorChange(e.target.value)}
                  title="Custom hex color picker"
                />
                {currentColor && (
                  <button
                    type="button"
                    className={styles.clearColorBtn}
                    onClick={() => handleColorChange('')}
                    title="Clear color override"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Accent Theme Color controls */
          <div className={styles.colorRow}>
            <div className={styles.swatches}>
              {PRESET_COLORS.map((preset) => {
                const isSelected = (fieldStyles.accentColor || '').toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    type="button"
                    className={`${styles.swatchBtn} ${isSelected ? styles.swatchActive : ''}`}
                    style={{ background: preset.hex || '#cbd5e1' }}
                    onClick={() => handleColorChange(preset.hex)}
                    title={`${preset.name} ${preset.hex || '(Default)'}`}
                  />
                );
              })}
            </div>

            <div className={styles.colorPickerWrap}>
              <input
                type="color"
                className={styles.colorInput}
                value={fieldStyles.accentColor || '#6366f1'}
                onChange={(e) => handleColorChange(e.target.value)}
                title="Custom accent color"
              />
              {fieldStyles.accentColor && (
                <button
                  type="button"
                  className={styles.clearColorBtn}
                  onClick={() => handleColorChange('')}
                  title="Reset accent to template default"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mini Footer: Reset Field Link */}
      <div className={styles.footerRow}>
        <button
          type="button"
          className={styles.subtleBtn}
          onClick={handleResetCurrentField}
        >
          Reset {TABS.find((t) => t.id === activeTab)?.label}
        </button>
        {activeTab === 'accent' && (
          <span className={styles.accentHint}>Affects headers, lines & tags</span>
        )}
      </div>
    </div>
  );
}
