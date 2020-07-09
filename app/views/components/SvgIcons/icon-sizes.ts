interface IconSize {
  width: number,
  height: number
}

export const iconSizes: StringMap<IconSize> = {
  small: { width: 16, height: 16 },
  medium: { width: 24, height: 24 },
  large: { width: 32, height: 32 }
}

export const muiIconSizes: StringMap<string> = {
  xsmall: '0.75rem', // 12px
  small: '1rem', // 16px
  medium: '1.5rem', // 24px
  large: '2rem', // 32px
  xlarge: '2.5rem' // 40px
}
