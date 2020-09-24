interface IconSize {
  readonly width: number
  readonly height: number
}

export const iconSizes = {
  small: { width: 16, height: 16 } as IconSize,
  medium: { width: 24, height: 24 } as IconSize,
  large: { width: 32, height: 32 } as IconSize
}

export const muiIconSizes = {
  xsmall: '0.75rem', // 12px
  small: '1rem', // 16px
  medium: '1.5rem', // 24px
  large: '2rem', // 32px
  xlarge: '2.5rem' // 40px
}
