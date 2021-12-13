import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {},
    contentContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.typography.body2
    },
    selectableContentContainer: {
      '&:hover': {
        background: theme.palette.grey[200]
      }
    },
    expandableContentContainer: {
      // marginLeft: 0
    },
    expandButton: {
      background: 'none',
      width: '2rem',
      height: '2rem',
      padding: 0,
      lineHeight: 0,
      border: 'none',
      // marginLeft: theme.spacing(-2),
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
      marginLeft: theme.spacing(3)
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
