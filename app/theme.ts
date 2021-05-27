import { createMuiTheme, Theme, ThemeOptions } from '@material-ui/core'
import merge from 'merge'

const white = '#fff'

const themeGenerator = (brandTheme: ThemeOptions = {}): Theme => {
  const defaultValue: ThemeOptions = {
    breakpoints: {
      values: {
        xs: 320,
        sm: 768,
        md: 1024,
        lg: 1280,
        xl: 1440
      }
    },
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
      navbar: {
        background: '#050E21',
        contrastText: 'rgba(255, 255, 255, 0.7)'
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: '#7F7F7F',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)'
      },
      divider: 'rgba(0, 0, 0, 0.12)',
      background: {
        paper: white,
        default: '#fafafa'
      },
      action: {
        active: 'rgba(0, 0, 0, 0.54)',
        hover: 'rgba(0, 0, 0, 0.08)',
        hoverOpacity: 0.08,
        selected: 'rgba(0, 0, 0, 0.14)',
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)'
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
        lineHeight: 1.5
      },
      subtitle2: {
        fontFamily: 'LatoBold',
        fontWeight: 700,
        fontSize: '0.875rem',
        lineHeight: 1.42
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
        lineHeight: 1.42
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
      // The max value zIndex can have is 2147483647.
      // Appcues' checklist beacon uses maxvalue - 100
      // We needed our modal to be rendered on top of that
      // checklist, hence this stupid workaround. I deduced 2
      // from that max value because I saw people using
      // theme.zIndex.modal + 2 in some parts of our code base!
      // The whole thing is stupid and I know it.
      modal: 2147483645,
      gridAction: 100,
      sideNavDrawer: 100
    }
  }

  const mergedValue: ThemeOptions = merge.recursive(defaultValue, {
    palette: {
      ...brandTheme.palette,
      type: 'light'
    }
  })

  const theme: Theme = createMuiTheme(mergedValue)

  theme.typography.subtitle3 = {
    ...theme.typography.subtitle2,
    fontSize: '0.8125rem',
    lineHeight: 1.53
  }

  theme.typography.body3 = {
    ...theme.typography.body2,
    fontSize: '0.8125rem',
    lineHeight: 1.53
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line
    ; (window as any).theme = theme
  }

  return theme
}

export { themeGenerator }
