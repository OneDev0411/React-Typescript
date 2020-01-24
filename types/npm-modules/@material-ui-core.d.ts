import { CSSProperties } from '@material-ui/core/styles/withStyles'
import { FontStyle } from '@material-ui/core/styles/createTypography'

import {
  Palette,
  ColorPartial,
  PaletteColor,
  PaletteOptions,
  PaletteColorOptions,
  SimplePaletteColorOptions
} from '@material-ui/core/styles/createPalette'

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
  }
}

declare module '@material-ui/core/styles/createTypography' {
  interface FontStyle
    extends Required<{
      fontWeightThin: CSSProperties['fontWeight']
      fontWeightBlack: CSSProperties['fontWeight']
    }> {}
}
