import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {},
    contentContainer: {
      display: 'flex',
      alignItems: 'center',
      lineHeight: 2.2,
      paddingLeft: theme.spacing(2),
      fontWeight: 500
    },
    expandableContentContainer: {
      marginLeft: theme.spacing(2.5)
    },
    selectableContentContainer: {
      '&:hover': {
        background: theme.palette.grey[200]
      }
    },
    expandButton: {
      background: 'none',
      width: '2rem',
      height: '2.5rem',
      padding: 0,
      lineHeight: 0,
      marginRight: '0.2rem',
      border: 'none',
      marginLeft: '-1rem',

      outline: 'none',
      color: theme.palette.grey[600],
      '&:hover': {
        color: theme.palette.primary.main,
        background: theme.palette.grey[300]
      },
      '&:focus': {
        color: theme.palette.primary.main
      }
    },
    expandArrow: {
      fill: 'currentColor',
      paddingTop: '0.15rem',
      flexShrink: 0
    },
    childrenContainer: {
      // background: 'red',
      borderLeft: `1px dashed ${theme.palette.action.disabledBackground}`,
      marginLeft: theme.spacing(2)
    },
    content: {
      order: 0,
      flexBasis: 'auto',
      flexShrink: 1,
      display: 'block',
      flexGrow: 1,
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }),
  {
    name: 'TreeViewNode'
  }
)
