import {
  makeStyles,
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  Typography
} from '@material-ui/core'

interface Props {
  open: boolean
  currentAgentName: string | undefined
  currentContactName: string | undefined
  handleClose: () => void
  handleConfirm: () => void
}

const useStyles = makeStyles(
  theme => ({
    dialogContainer: {
      textAlign: 'center',
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    actionImage: { padding: theme.spacing(4), marginBottom: theme.spacing(4) }
  }),
  { name: 'ContactAssigneeDialog' }
)

const AssigneeDialog = ({
  open,
  currentAgentName,
  currentContactName,
  handleClose,
  handleConfirm
}: Props) => {
  const classes = useStyles()

  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <DialogContent className={classes.dialogContainer}>
        <img
          className={classes.actionImage}
          src="/static/images/contacts/assignee.svg"
          alt="assignee"
        />
        <div>
          <Typography variant="h6" component="h1">
            {currentAgentName} is notified about {currentContactName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can also send an email to introduce {currentContactName} and{' '}
            {currentAgentName} if you'd like.
          </Typography>
        </div>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Skip
        </Button>
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Send Intro Email
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssigneeDialog
