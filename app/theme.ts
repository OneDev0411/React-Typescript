import { createMuiTheme } from '@material-ui/core'

const white = '#fff'

const theme = createMuiTheme({
  // Temporary theme based on our current colors, until design team provides the theme values
  palette: {
    type: 'light',
    primary: {
      main: '#00B286',
      light: '#33CCAA',
      dark: '#008060',
      contrastText: white
    },
    secondary: {
      main: '#0945EB',
      light: '#6971FF',
      dark: '#001EB7',
      contrastText: white
    },
    tertiary: {
      main: '#061126',
      light: '#2E3033',
      dark: '#000000',
      contrastText: white
    },
    error: {
      ultralight: '#FAEDEB',
      light: '#E57373',
      main: '#F44336',
      dark: '#D32F2F',
      contrastText: white
    },
    warning: {
      ultralight: '#FDF4E7',
      main: '#FF9900',
      dark: '#F57C00',
      light: '#FFB74D',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    info: {
      ultralight: '#EAF4FC',
      light: '#64B5F6',
      main: '#2196F3',
      dark: '#1976D2',
      contrastText: white
    },
    success: {
      ultralight: '#EFF7EE',
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    grey: {
      '50': '#F9FAFC',
      '100': '#F0F2F5',
      '200': '#E7E9EC',
      '300': '#D7D9DC',
      '400': '#B4B5B8',
      '500': '#949598',
      '600': '#6C6D70',
      '700': '#58595C',
      '800': '#3A3B3E',
      '900': '#1A1B1D',
      A100: '#d5d5d5',
      A200: '#aaaaaa',
      A400: '#303030',
      A700: '#616161'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: '#7F7F7F',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)'
    },
    divider: '#d4d4d4',
    background: {
      paper: white,
      default: '#fafafa'
    },
    action: {
      active: 'rgba(107, 131, 178, 0.54)',
      hover: 'rgba(107, 131, 178, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(107, 131, 178, 0.14)',
      disabled: 'rgba(107, 131, 178, 0.26)',
      disabledBackground: 'rgba(107, 131, 178, 0.12)'
    }
  },
  shape: {
    borderRadius: 4
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: '"LatoRegular","Helvetica","Arial",sans-serif',
    fontSize: 14,
    fontWeightThin: 100,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightBold: 700,
    fontWeightBlack: 900,
    h1: {
      fontFamily: 'LatoRegular',
      fontWeight: 400,
      fontSize: '6rem',
      lineHeight: 1.167
    },
    h2: {
      fontFamily: 'LatoRegular',
      fontWeight: 400,
      fontSize: '3.75rem',
      lineHeight: 1.2
    },
    h3: {
      fontFamily: 'LatoRegular',
      fontWeight: 400,
      fontSize: '3rem',
      lineHeight: 1.167
    },
    h4: {
      fontFamily: 'LatoBlack',
      fontWeight: 900,
      fontSize: '2rem',
      lineHeight: 1.235
    },
    h5: {
      fontFamily: 'LatoRegular',
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.334
    },
    h6: {
      fontFamily: 'LatoBlack',
      fontWeight: 900,
      fontSize: '1.125rem',
      lineHeight: 1.6
    },
    subtitle1: {
      fontFamily: 'LatoBold',
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.75
    },
    subtitle2: {
      fontFamily: 'LatoBold',
      fontWeight: 700,
      fontSize: '0.875rem',
      lineHeight: 1.57
    },
    body1: {
      fontFamily: 'LatoRegular',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontFamily: 'LatoRegular',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.43
    },
    button: {
      fontFamily: 'LatoBold',
      fontWeight: 700,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      textTransform: 'none'
    },
    caption: {
      fontFamily: 'LatoRegular',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66
    },
    overline: {
      fontFamily: 'LatoRegular',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 2.66,
      textTransform: 'uppercase'
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
    },
    MuiTooltip: {
      arrow: true
    }
  },
  zIndex: {
    modal: 1001,
    gridAction: 100,
    sideNavDrawer: 100
  }
})

theme.typography.subtitle3 = {
  ...theme.typography.subtitle2,
  fontSize: '0.8125rem'
}

theme.typography.body3 = {
  ...theme.typography.body2,
  fontSize: '0.8125rem'
}

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  ; (window as any).theme = theme
}

export { theme }
