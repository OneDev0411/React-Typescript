import { createStyles, Theme } from '@material-ui/core'

export const marketingTemplateCardStyles = (theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      marginBottom: theme.spacing(4),

      '&:hover $suffix': {
        opacity: 1,
        transform: 'translateY(0)'
      }
    },
    rootHasSuffix: {
      marginBottom: theme.spacing(10)
    },
    card: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative' as any,
      borderRadius: 3,
      transition: '0.3s',
      minHeight: '15.8rem',
      background: theme.palette.grey['200'],
      overflow: 'hidden',
      boxShadow: theme.shadows[2],
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.2)',
        opacity: 0,
        zIndex: 1,
        transition: 'all 0.5s'
      },
      '&:not($cardLoading):hover': {
        '& $actions': {
          opacity: 1,
          transform: 'translateY(0)'
        },

        '&::after': {
          opacity: 1
        }
      },
      '&$cardLoading + $suffix': {
        opacity: 1,
        transform: 'translateY(0)'
      }
    },
    cardHasPreview: {
      cursor: 'zoom-in'
    },
    cardLoading: {
      cursor: 'wait',
      '&:after': {
        background: 'rgba(255, 255, 255, 0.7)',
        opacity: 1
      }
    },

    suffix: {
      marginTop: theme.spacing(1),
      position: 'absolute',
      bottom: -theme.spacing(6),
      opacity: 0,
      transform: `translateY(${theme.spacing(1)}px)`,
      transition: 'all 0.35s'
    },
    suffixCaption: {
      letterSpacing: '1.5px',
      fontSize: '0.75rem',
      color: theme.palette.grey.A700
    },

    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      padding: '0.5rem',
      zIndex: 2,
      opacity: 0,
      transform: 'translateY(0.5rem)',
      transition: 'all 0.35s',

      '& button': {
        marginRight: '0.5rem'
      },
      '& button:last-child': {
        marginRight: 0
      }
    }
  })
