import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#fff',
      maxWidth: 900,
      margin: 'auto',
      border: '1px solid #ccc',
      borderRadius: 4,
      padding: theme.spacing(1.5)
    },
    modalFooter: {
      padding: theme.spacing(2, 3.5),
      background: '#F2F2F2',
      borderTop: 0
    },
    actions: {
      direction: 'rtl',
      '& div': {
        display: 'inline-block'
      },
      '& button': {
        fontWeight: 'bold',
        direction: 'ltr'
      }
    },
    detailsTextField: {
      '& label': {
        marginBottom: 0,
        fontSize: 13,
        color: theme.palette.common.black,
        '& span.MuiFormLabel-asterisk': {
          color: theme.palette.error.main
        }
      }
    },
    detailsFieldsRow: {
      marginBottom: theme.spacing(0.5)
    },
    formRow: {
      '&>div:nth-last-child(2)': {
        // background: "red",
        // marginBottom: theme.spacing(2)
      }
    }
  })
)
