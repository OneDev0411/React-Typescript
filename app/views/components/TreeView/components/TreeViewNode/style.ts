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
      color: theme.palette.grey[700],
      ...theme.typography.body2
    },
    selectableContentContainer: {
      '&:hover': {
        background: theme.palette.grey[200]
      }
    },
    isContentContainerExpanded: {
      color: theme.palette.common.black,
      ...theme.typography.subtitle2
    },
    expandableContentContainer: {
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
      color: theme.palette.grey[700],
      '&:hover, &:focus': {
        color: theme.palette.primary.main
      }
    },
    isExpanded: {
      color: theme.palette.common.black
    },
    expandArrow: {
      fill: 'currentColor',
      paddingTop: '0.15rem',
      flexShrink: 0
    },
    childrenContainer: {
      position: 'relative',
      marginLeft: theme.spacing(2),

      '&::before': {
        position: 'absolute',
        top: theme.spacing(-1),
        left: 0,
        content: "''",
        zIndex: 0,
        width: 0,
        height: `calc(100% - ${theme.spacing(1)}px)`,
        borderLeft: `1px solid ${theme.palette.grey[100]}`
      }
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
