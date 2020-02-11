import { createStyles, CreateCSSProperties } from '@material-ui/styles'
import { Theme } from '@material-ui/core'

interface StylesProps {
  isTablet: boolean
  isDesktop: boolean
  brandSearchBackgroundImage: string
}

export const styles = (theme: Theme) =>
  createStyles({
    searchBox__input: (props: StylesProps) => {
      const initialStyles: CreateCSSProperties<StylesProps> = {
        width: `calc(100% - ${theme.spacing(4)}px)`,
        height: '100%',
        padding: theme.spacing(1, 1.25),
        border: 'none',
        borderRadius: theme.shape.borderRadius,

        '&:focus': {
          outline: 'none'
        }
      }

      if (props.isDesktop) {
        return {
          ...initialStyles,
          width: `calc(100% - ${theme.spacing(5)}px)`,
          padding: theme.spacing(1, 2)
        }
      }

      return initialStyles
    },
    backgroundCover: (props: StylesProps) => ({
      backgroundColor: theme.palette.grey[300],
      backgroundImage: `url(${props.brandSearchBackgroundImage})`,
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      position: 'absolute',
      height: '100%',
      width: '100%',
      zIndex: 0
    }),
    backgroundCoverFilter: {
      backgroundColor: theme.palette.common.black,
      height: '100%',
      width: '100%',
      position: 'absolute',
      opacity: 0.5,
      zIndex: 1
    },
    title: (props: StylesProps) => {
      const mobileStyle: CreateCSSProperties<StylesProps> = {
        fontSize: '1.5rem',
        color: theme.palette.common.white
      }

      if (props.isTablet) {
        return {
          ...mobileStyle,
          fontSize: '2.2rem'
        }
      }

      return mobileStyle
    },
    wrapper: (props: StylesProps) => {
      const mobileStyle: CreateCSSProperties<StylesProps> = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        width: '280px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 2
      }

      if (props.isTablet && !props.isDesktop) {
        return {
          ...mobileStyle,
          width: '400px'
        }
      }

      if (props.isDesktop) {
        return {
          ...mobileStyle,
          width: '550px'
        }
      }

      return mobileStyle
    },
    searchBox: {
      width: '100%',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.white
    },
    searchBox__icon: {
      marginLeft: theme.spacing(2),
      opacity: 0.3
    }
  })
