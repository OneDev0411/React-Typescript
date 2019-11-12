import { Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/styles'

import { ClassesProps } from 'utils/ts-utils'

interface StyleProps extends ClassesProps<typeof styles> {
  hasBorderBottom: boolean | null
  clickable: boolean
}

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      height: '100%',
      cursor: (props: StyleProps) => (props.clickable ? 'pointer' : 'auto'),
      borderBottom: (props: StyleProps) =>
        props.hasBorderBottom ? '1px solid rgba(219, 230, 253, 0.5)' : 'none',
      '& button, a.MuiButtonBase-root': {
        borderColor: '#eee',
        color: '#eee'
      },
      '&:hover': {
        transition: '0.2s ease-in background-color',
        backgroundColor: theme.palette.action.hover,
        '& button, a.MuiButtonBase-root': {
          borderColor: 'inherit',
          color: 'inherit'
        }
      },
      '& a, & button': {
        zIndex: 1,
        position: 'relative'
      },
      '& a': {
        color: theme.palette.secondary.dark
      },
      '&:hover a': {
        color: theme.palette.primary.main
      }
    }
  })
