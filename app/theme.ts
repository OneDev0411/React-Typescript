import { createMuiTheme } from '@material-ui/core'

import {
  borderColor,
  disabledBgColor,
  disabledColor,
  primary,
  primaryDark,
  red
} from 'views/utils/colors'

export const theme = createMuiTheme({
  // Temporary theme based on our current colors, until design team provides the theme values
  palette: {
    type: 'light',
    primary: {
      light: '#6566ff', // Temporarily from here: https://material.io/tools/color/#!/?view.left=0&view.right=1&primary.color=003bdf
      main: primary,
      dark: primaryDark,
      contrastText: '#fff'
    },
    action: {
      disabled: disabledColor,
      disabledBackground: disabledBgColor
    },
    divider: borderColor,
    error: {
      main: red.A200,
      light: red.A100,
      dark: red.primary
    },
    text: {
      secondary: disabledColor
    }
  },
  shape: {
    borderRadius: 4
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Barlow',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    button: {
      textTransform: 'none'
    },
    h5: {
      fontFamily: 'Merriweather'
    }
  },
  props: {
    MuiButtonBase: {
      // Disable ink ripple for more consistency with our current UI components
      // at least until full adoption
      disableRipple: true
    }
  },
  zIndex: {
    modal: 1001
  }
})

if (process.env.NODE_ENV === 'development') {
  ;(window as any).theme = theme
}
