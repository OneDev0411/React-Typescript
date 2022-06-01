import { makeStyles } from '@material-ui/core'

import ConfirmationDialog, {
  ConfirmationDialogProps
} from '@app/views/components/ConfirmationDialog'

const useStyles = makeStyles(
  theme => ({
    list: { paddingLeft: theme.spacing(3) }
  }),
  { name: 'HowToConnectToInstagramDialog' }
)

interface HowToConnectToInstagramDialogProps extends ConfirmationDialogProps {
  onConnectClick: () => void
}

function HowToConnectToInstagramDialog({
  onConnectClick,
  ...otherDialogProps
}: HowToConnectToInstagramDialogProps) {
  const classes = useStyles()
  const handleLearnMore = () => {
    // TODO: Set the final address that will be provided by Abi
    window.open(
      'https://help.rechat.com/guides/marketing/social-marketing',
      '_blank'
    )
  }

  return (
    <ConfirmationDialog {...otherDialogProps}>
      <ConfirmationDialog.Header title="How to Connect to Instagram" />
      <ConfirmationDialog.Body>
        <ol className={classes.list}>
          <li>You need to have a Facebook page.</li>
          <li>
            You need to have an Instagram business account (or update your
            personal account to business account).
          </li>
          <li>
            Your Facebook and Instagram page should be connected to each other.
          </li>
          <li>Connect your Instagram business account to Rechat.</li>
        </ol>
      </ConfirmationDialog.Body>
      <ConfirmationDialog.Footer
        confirmLabel="Connect Instagram Account"
        onConfirm={onConnectClick}
        cancelLabel="Learn More"
        onCancel={handleLearnMore}
      />
    </ConfirmationDialog>
  )
}

export default HowToConnectToInstagramDialog
