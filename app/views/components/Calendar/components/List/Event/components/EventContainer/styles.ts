import { Theme } from '@material-ui/core/styles'
import { createStyles, fade } from '@material-ui/core/styles'

import { ClassesProps } from 'utils/ts-utils'

interface StyleProps extends ClassesProps<typeof styles> {
  clickable: boolean
  evenRow: boolean
}

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: (props: StyleProps) =>
        props.evenRow ? fade('#F2F3F7', 0.3) : theme.palette.common.white,
      cursor: (props: StyleProps) => (props.clickable ? 'pointer' : 'auto'),
      '& button, a.MuiButtonBase-root': {
        display: 'none'
      },
      '&:hover': {
        transition: '0.2s ease-in background-color',
        backgroundColor: theme.palette.action.hover,
        '& button, a.MuiButtonBase-root': {
          display: 'block',
          border: 'none',
          color: 'inherit'
        }
      },
      '& a, & button': {
        zIndex: 1,
        position: 'relative'
      },
      '& a': {
        color: '#1D1F26' // TODO: use palette
      },
      '&:hover a': {
        color: theme.palette.primary.main,
        textDecoration: 'underline'
      }
    }
  })
