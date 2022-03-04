import { Theme, makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      '&.has-border': {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius
      }
    },
    status: {
      color: '#fff',
      marginTop: theme.spacing(0.5),
      padding: theme.spacing(0.25, 0.5),
      borderRadius: theme.shape.borderRadius
    },
    resultItem: {
      padding: theme.spacing(1),
      '&:hover': {
        background: theme.palette.action.hover,
        cursor: 'pointer'
      }
    },
    resultItemContent: {
      width: '100%',
      paddingLeft: theme.spacing(2)
    },
    lightText: {
      color: theme.palette.grey[500]
    },
    subtitle: {
      ...theme.typography.caption,
      margin: theme.spacing(2, 1),
      color: theme.palette.grey[500]
    },
    place: {
      ...theme.typography.caption,
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius
    },
    actions: {
      marginTop: theme.spacing(2)
    },
    avatarContainer: {
      marginRight: theme.spacing(2),
      width: '32px'
    },
    searchContainer: {
      marginBottom: theme.spacing(3)
    },
    loadingContainer: {
      margin: theme.spacing(1, 0)
    },
    skipContainer: {
      marginTop: theme.spacing(2),
      textAlign: 'right'
    },
    mlsSource: {
      ...theme.typography.caption,
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey[700]
    },
    mlsSourceIcon: {
      maxWidth: 14, // From figma
      maxHeight: 14, // From figma
      marginRight: theme.spacing(0.5)
    }
  }),
  {
    name: 'CreateDeal-Address'
  }
)
