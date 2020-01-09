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
        zIndex: 1,
        borderBottom: '1px solid #ccc'
      },
      gallery: {
        padding: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
        justifyContent: 'flex-start'
      },
      mediaCard: {
        maxWidth: 287,
        padding: theme.spacing(1),
        marginBottom: theme.spacing(2),
        borderRadius: 4,

        '&:hover': {
          backgroundColor: theme.palette.action.hover,

          '& $actions': {
            opacity: 1
          },
          '& $selectCheckbox': {
            opacity: 1
          },
          '& $mediaThumbnail': {
            opacity: 0.9
          }
        },
        '&.selected': {
          '& $selectCheckbox': {
            opacity: 1
          }
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
        maxHeight: 228,
        width: 270,
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
        background: '#fff',
        borderTop: '1px solid #ccc',
        boxShadow: '0px -2px 5px 0px rgba(0,0,0,0.10)'
      },
      mediaLabel: {
        postion: 'relative',
        justifyContent: 'left',
        textAlign: 'left',
        textTransform: 'none',
        '&:hover': {
          background: 'none',

          '& $editButton': {
            opacity: 1
          }
        }
      },
      editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        opacity: 0
      }
    }),
  // Making the class names deterministic by setting theme name starting with `Mui`
  // See: https://material-ui.com/styles/advanced/#with-material-ui-core
  { name: 'MuiMediaManager' }
)
