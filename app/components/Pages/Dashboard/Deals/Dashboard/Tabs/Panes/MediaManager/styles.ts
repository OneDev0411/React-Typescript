import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        position: 'relative'
      },
      header: {
        padding: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
        position: 'sticky',
        top: 0,
        left: 0,
        background: '#fff',
        zIndex: 1
      },
      gallery: {
        padding: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
        justifyContent: 'flex-start'
      },
      mediaCard: {
        maxWidth: 300,
        padding: theme.spacing(1),
        marginBottom: theme.spacing(2),
        borderRadius: 4,

        '&:hover': {
          backgroundColor: theme.palette.action.hover
        },
        '&:hover .MuiMediaManager-actions': {
          opacity: 1
        },
        '&:hover .MuiMediaManager-selectCheckbox': {
          opacity: 1
        },
        '&:hover .MuiMediaManager-mediaThumbnail': {
          opacity: 0.9
        }
      },
      mediaThumbnailContainer: {
        position: 'relative'
      },
      mediaThumbnail: {
        width: '100%',
        marginBottom: theme.spacing(1),
        boxShadow: [
          '0px 1px 5px rgba(0, 0, 0, 0.2)',
          '0px 3px 4px rgba(0, 0, 0, 0.12)',
          '0px 2px 0px rgba(0, 0, 0, 0.14)'
        ].join(' ,'),
        borderRadius: 4,
        transition: '0.2s ease-in opacity'
      },
      actions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0,
        padding: theme.spacing(2),
        transition: '0.2s ease-in opacity'
      },
      selectCheckbox: {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0,
        padding: theme.spacing(1),
        transition: '0.2s ease-in opacity'
      },
      placeholderCard: {
        display: 'flex',
        alignItems: 'center',
        border: '1px dashed #D4D4D4',
        background: '#FAFAFA',
        maxHeight: 240,
        width: 285,
        margin: theme.spacing(1),
        marginBottom: theme.spacing(2),
        borderRadius: 4,

        '&:hover': {
          backgroundColor: theme.palette.action.hover
        },
        '& p': {
          textAlign: 'center'
        }
      },
      menuButton: {
        minWidth: 'auto',
        marginLeft: theme.spacing(1),
        backgroundColor: theme.palette.action.active
      },
      trimmedText: {
        flex: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      },
      lowerCaseButton: {
        textTransform: 'none'
      },
      bold: {
        fontWeight: theme.typography.fontWeightBold
      },
      actionButtons: {
        '& > *': {
          marginLeft: theme.spacing(1)
        }
      },
      bulkActionsMenu: {
        position: 'sticky',
        bottom: 0,
        left: 0,
        height: 80,
        background: '#fff'
      }
    }),
  // Making the class names deterministic by setting theme name starting with `Mui`
  // See: https://material-ui.com/styles/advanced/#with-material-ui-core
  { name: 'MuiMediaManager' }
)
