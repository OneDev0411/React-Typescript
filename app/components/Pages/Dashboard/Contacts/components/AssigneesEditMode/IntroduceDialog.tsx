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
  assignees: BrandedUser[]
  contactName: string
  onClose: () => void
  onConfirm: () => void
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
    actionImage: { padding: theme.spacing(4), marginBottom: theme.spacing(4) },
    dialogAction: { margin: theme.spacing(2) }
  }),
  { name: 'IntroduceDialog' }
)

const IntroduceDialog = ({
  open,
  assignees,
  contactName,
  onClose,
  onConfirm
}: Props) => {
  const classes = useStyles()
  const hasOneAssignee = assignees.length === 1
  const assigneesName = hasOneAssignee
    ? assignees[0].display_name
    : assignees.map(assignee => assignee.display_name).join(', ')

  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <DialogContent className={classes.dialogContainer}>
        <img
          className={classes.actionImage}
          src="/static/icons/assignee.svg"
          alt="assignee"
        />
        <div>
          <Typography variant="h6" component="h1">
            {`${assigneesName} ${hasOneAssignee ? ' is ' : ' are '}`}
            notified about {contactName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can also send an email to introduce{' '}
            {hasOneAssignee ? assigneesName : 'them'} to {contactName} if you'd
            like.
          </Typography>
        </div>
      </DialogContent>

      <DialogActions className={classes.dialogAction}>
        <Button variant="outlined" onClick={onClose}>
          Skip
        </Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Send Intro Email
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default IntroduceDialog
