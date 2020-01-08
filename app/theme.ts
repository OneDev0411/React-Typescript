import { createMuiTheme } from '@material-ui/core'

import { borderColor, disabledColor, orange } from 'views/utils/colors'

const white = '#fff'

const theme = createMuiTheme({
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
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(0, 0, 0, 0.14)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)'
    },
    warning: {
      main: orange.primary,
      dark: orange.dark,
      light: orange.light
    },
    grey: {
      '100': '#F2F2F2'
    },
    divider: borderColor,
    error: {
      light: '#ff7363',
      main: '#F43B38',
      dark: '#b90010',
      contrastText: white
    },
    success: {
      main: '#27AE60'
    },
    text: {
      secondary: disabledColor
    }
  },
  shape: {
    borderRadius: 3
  },
  typography: {
    fontFamily: ['Barlow'].join(','),
    button: {
      textTransform: 'none'
    },
    h1: {
      fontFamily: 'Merriweather'
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
    },
    MuiButtonGroup: {
      disableRipple: true
    }
  },
  zIndex: {
    modal: 1001
  }
})

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  ; (window as any).theme = theme
}

export { theme }
