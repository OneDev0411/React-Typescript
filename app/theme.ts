import { createMuiTheme } from '@material-ui/core'

import { borderColor, disabledBgColor, disabledColor } from 'views/utils/colors'

const white = '#fff'

export const theme = createMuiTheme({
  // Temporary theme based on our current colors, until design team provides the theme values
  palette: {
    type: 'light',
    primary: {
      main: '#0945eb',
      light: '#6971ff',
      dark: '#001eb7',
      contrastText: white
    },
    secondary: {
      main: '#01040D',
      light: '#0F121A',
      dark: '#000000',
      contrastText: white
    },
    action: {
      disabled: disabledColor,
      disabledBackground: disabledBgColor
    },
    divider: borderColor,
    error: {
      light: '#ff7363',
      main: '#F43B38',
      dark: '#b90010',
      contrastText: white
    },
    text: {
      secondary: disabledColor
    }
  },
  shape: {
    borderRadius: 4
  },
  typography: {
    fontFamily: ['Barlow'].join(','),
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
