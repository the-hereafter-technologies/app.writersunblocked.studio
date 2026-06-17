export const theme = {
  colors: {
    bgBase:      '#F5F2ED',
    bgSurface:   '#FDFBF8',
    bgElevated:  '#FFFFFF',
    border:      'rgba(0,0,0,0.08)',
    borderStrong:'rgba(0,0,0,0.15)',

    textPrimary:   '#1A1816',
    textSecondary: '#6B6560',
    textTertiary:  '#A09A94',

    charPurple:     '#EEEDFE', charPurpleText: '#3C3489',
    charTeal:       '#E1F5EE', charTealText:   '#085041',
    charPink:       '#FBEAF0', charPinkText:   '#72243E',
    charAmber:      '#FAEEDA', charAmberText:  '#633806',
    charBlue:       '#E6F1FB', charBlueText:   '#0C447C',

    accent:       '#7F77DD',
    accentSubtle: '#EEEDFE',
  },
  fonts: {
    editor: "'Lora', 'Crimson Pro', Georgia, serif",
    ui:     "'DM Sans', 'Instrument Sans', sans-serif",
  },
  fontSizes: {
    editorBody: '16px',
    label:      '11px',
    body:       '14px',
    heading:    '18px',
  },
  lineHeights: {
    editor: '1.85',
    ui:     '1.5',
  },
  radii: {
    sm:   '4px',
    md:   '8px',
    lg:   '12px',
    full: '9999px',
  },
  space: {
    xs:  '4px',
    sm:  '8px',
    md:  '12px',
    lg:  '16px',
    xl:  '24px',
    xxl: '48px',
  },
}

export type Theme = typeof theme
