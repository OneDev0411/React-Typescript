import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        position: 'relative',
        borderStyle: 'Solid',
        borderWidth: 1,
        borderColor: theme.palette.grey['300'],
        borderRadius: theme.shape.borderRadius,
        background: theme.palette.background.paper,
        marginBottom: theme.spacing(2)
      },
      header: {
        padding: theme.spacing(4, 3),
        position: 'sticky',
        top: 0,
        left: 0,
        background: theme.palette.background.paper,
        zIndex: 1,
        borderBottomColor: theme.palette.grey['300'],
        borderBottomStyle: 'solid',
        borderBottomWidth: 1
      },
      gallery: {
        padding: theme.spacing(4, 3),
        justifyContent: 'flex-start'
      },
      mediaCard: {
        width: 287,
        padding: theme.spacing(1),
        marginBottom: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,

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
        borderRadius: theme.shape.borderRadius,
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
        background: theme.palette.background.paper,
        width: 30,
        height: 30,
        cursor: 'move',
        padding: theme.spacing(0.7, 1),
        borderRadius: theme.shape.borderRadius
      },
      placeholderCard: {
        display: 'flex',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.grey['300'],
        background: theme.palette.grey['100'],
        height: 250,
        width: 270,
        margin: theme.spacing(1),
        marginBottom: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,

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
        background: theme.palette.background.paper,
        borderTopColor: theme.palette.grey['300'],
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        boxShadow: '0px -2px 5px 0px rgba(0,0,0,0.10)'
      },
      mediaLabel: {
        display: 'block',
        postion: 'relative',
        textAlign: 'left',
        textTransform: 'none',
        wordWrap: 'break-word',

        '&:hover': {
          background: 'none',

          '& $editButton': {
            opacity: 1
          }
        }
      },
      editButton: {
        float: 'right',
        opacity: 0
      },
      editTextArea: {
        fontFamily: 'inherit',
        width: '100%',
        lineHeight: 'inherit',
        fontSize: 'inherit',
        padding: theme.spacing(1),
        resize: 'vertical',

        '&:focus': {
          outline: 'none',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: '#0000ff'
        }
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
        backgroundColor: theme.palette.background.paper,
        borderWidth: 2,
        borderStyle: 'dotted',
        borderColor: theme.palette.grey['500'],
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
        top: 5,
        right: 5
      }
    }),
  // Making the class names deterministic by setting theme name starting with `Mui`
  // See: https://material-ui.com/styles/advanced/#with-material-ui-core
  { name: 'MuiMediaManager' }
)
