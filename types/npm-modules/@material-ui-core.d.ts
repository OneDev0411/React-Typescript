import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { TypographyStyle } from '@material-ui/core/styles/createTypography'

import { ColorPartial } from '@material-ui/core/styles/createPalette'

declare module '@material-ui/core/styles/createPalette' {
  interface PaletteColor {
    ultralight: string
    light: string
    main: string
    dark: string
    contrastText: string
  }

  interface Palette {
    tertiary: PaletteColor
    error: PaletteColor
    warning: PaletteColor
    info: PaletteColor
    success: PaletteColor

    navbar: {
      background: CssObject
      contrastText: CssObject
    }
  }

  interface SimplePaletteColorOptions {
    ultralight?: string
    light?: string
    main: string
    dark?: string
    contrastText?: string
  }

  type PaletteColorOptions = SimplePaletteColorOptions | ColorPartial

  interface PaletteOptions {
    tertiary?: PaletteColorOptions
    error?: PaletteColorOptions
    warning?: PaletteColorOptions
    info?: PaletteColorOptions
    success?: PaletteColorOptions
    navbar?: {
      background?: CssObject
      contrastText?: CssObject
    }
  }
}

declare module '@material-ui/core/Typography/Typography' {
  interface TypographyPropsVariantOverrides {
    subtitle3: true
    body3: true
  }
}

declare module '@material-ui/core/styles/createTypography' {
  interface FontStyle
    extends Required<{
      fontWeightThin: CSSProperties['fontWeight']
      fontWeightBlack: CSSProperties['fontWeight']
    }> {}

  interface TypographyOptions {
    subtitle3: TypographyStyle
    body3: TypographyStyle
  }
  interface Typography {
    subtitle3: TypographyStyle
    body3: TypographyStyle
  }
}

declare module '@material-ui/core/styles/zIndex' {
  interface ZIndex {
    gridAction: number
    sideNavDrawer: number
  }
}
