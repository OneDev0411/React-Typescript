import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        position: 'relative'
      },
      header: {
        padding: theme.spacing(4, 3),
        position: 'sticky',
        top: 0,
        left: 0,
        background: '#fff',
        zIndex: 1,
        borderBottom: '1px solid #ccc'
      },
      gallery: {
        padding: theme.spacing(4, 3),
        justifyContent: 'flex-start'
      },
      mediaCard: {
        width: 287,
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
          '& $sortHandle': {
            opacity: 0.8
          },
          '& $mediaThumbnail': {
            opacity: 0.9,
            boxShadow: [
              '0px 1px 5px rgba(0, 0, 0, 0.2)',
              '0px 3px 4px rgba(0, 0, 0, 0.12)',
              '0px 2px 0px rgba(0, 0, 0, 0.14)'
            ].join(' ,')
          }
        },
        '&.selected': {
          '& $selectCheckbox': {
            opacity: 1
          }
        }
      },
      mediaCardUploading: {
        '& $mediaThumbnail': {
          opacity: 0.5
        }
      },
      mediaThumbnailContainer: {
        position: 'relative'
      },
      mediaThumbnail: {
        height: 250,
        marginBottom: theme.spacing(1),
        borderRadius: 4,
        transition: '0.2s ease-in opacity',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
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
        width: 30,
        height: 30,
        transition: '0.2s ease-in opacity'
      },

      sortHandle: {
        position: 'absolute',
        top: 15,
        right: 15,
        opacity: 0,
        background: '#fff',
        width: 30,
        height: 30,
        cursor: 'move',
        padding: theme.spacing(0.7, 1),
        borderRadius: 4
      },
      placeholderCard: {
        display: 'flex',
        alignItems: 'center',
        border: '1px dashed #D4D4D4',
        background: '#FAFAFA',
        height: 250,
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
      },
      iconButton: {
        padding: 5
      },
      uploadPlaceholder: {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1002
      },
      uploadArea: {
        position: 'absolute',
        left: '25%',
        top: '30vh',
        width: 700,
        height: 250,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        border: '2px dotted #979797',
        textAlign: 'center',
        paddingTop: 70
      },
      uploadProgressbar: {
        position: 'absolute',
        width: '80%',
        top: '80%',
        left: '10%'
      },
      downloadModal: {
        textAlign: 'center'
      },
      modalCloseButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 20,
        height: 20
      }
    }),
  // Making the class names deterministic by setting theme name starting with `Mui`
  // See: https://material-ui.com/styles/advanced/#with-material-ui-core
  { name: 'MuiMediaManager' }
)
