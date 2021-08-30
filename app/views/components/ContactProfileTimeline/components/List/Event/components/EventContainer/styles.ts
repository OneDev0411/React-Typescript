import { Theme, createStyles } from '@material-ui/core/styles'

import { ClassesProps } from 'utils/ts-utils'

interface StyleProps extends ClassesProps<typeof styles> {
  clickable: boolean
  evenRow: boolean
}

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      minHeight: theme.spacing(8),
      cursor: (props: StyleProps) => (props.clickable ? 'pointer' : 'auto'),
      '& button, a.MuiButtonBase-root': {
        display: 'none'
      },
      '&:hover': {
        '& button, a.MuiButtonBase-root': {
          display: 'block',
          border: 'none',
          color: 'inherit'
        }
      },
      '& a, & button, & svg': {
        zIndex: 1,
        position: 'relative'
      },
      '& a': {
        color: '#1D1F26' // TODO: use palette
      },
      '&:hover a': {
        color: theme.palette.secondary.main,
        textDecoration: 'underline'
      },
      '&:hover $actions': {
        opacity: 1
      }
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      opacity: 0,
      transition: '0.1s ease-in opacity',
      '& button, & a': {
        marginRight: theme.spacing(2),
        textDecoration: 'none'
      }
    }
  })
