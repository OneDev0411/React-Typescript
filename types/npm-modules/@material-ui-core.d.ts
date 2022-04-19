import { ColorPartial } from '@material-ui/core/styles/createPalette'
import { TypographyStyle } from '@material-ui/core/styles/createTypography'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

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
    navbar: PaletteColor & {
      background: CssObject
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
    navbar?: PaletteColorOptions & {
      background?: CssObject
    }
  }
}

declare module '@material-ui/core/styles' {
  interface Theme {
    navbar: {
      logo: {
        url: string
      }
    }
  }

  interface ThemeOptions {
    navbar?: {
      logo?: {
        url?: sring
      }
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
