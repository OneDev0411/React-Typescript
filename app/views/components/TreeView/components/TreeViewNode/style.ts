import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {},
    contentContainer: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(4),
      ...theme.typography.body2
    },
    selectableContentContainer: {
      '&:hover': {
        background: theme.palette.grey[200]
      }
    },
    expandableContentContainer: {
      // marginLeft: 0
      paddingLeft: 0
    },
    expandButton: {
      padding: 0,
      margin: theme.spacing(0, 1),
      background: 'none',
      lineHeight: 0,
      border: 'none',
      borderRadius: '100%',
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
    isExpanded: {
      // position: 'relative',
      // '&::before': {
      //   position: 'absolute',
      //   top: '50%',
      //   left: 0,
      //   content: "''",
      //   zIndex: 0,
      //   width: '1px',
      //   height: '1rem',
      //   borderLeft: `1px dashed ${theme.palette.action.disabledBackground}`
      // }
    },
    expandArrow: {
      fill: 'currentColor',
      paddingTop: '0.15rem',
      flexShrink: 0
    },
    childrenContainer: {
      // background: 'red',
      borderLeft: `1px solid ${theme.palette.action.disabledBackground}`,
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
