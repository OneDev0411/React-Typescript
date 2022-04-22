import { makeStyles } from '@material-ui/core'

import ModernDialog, {
  ModernDialogProps
} from '@app/views/components/ModernDialog'

const useStyles = makeStyles(
  theme => ({
    list: { paddingLeft: theme.spacing(3) }
  }),
  { name: 'HowToConnectToInstagramDialog' }
)

interface HowToConnectToInstagramDialogProps extends ModernDialogProps {
  onConnectClick: () => void
}

function HowToConnectToInstagramDialog({
  onConnectClick,
  ...otherDialogProps
}: HowToConnectToInstagramDialogProps) {
  const classes = useStyles()
  const handleLearnMore = () => {
    // TODO: Set the address that will be provided by Sahar
    window.open('https://help.rechat.com/guides/marketing', '_blank')
  }

  return (
    <ModernDialog {...otherDialogProps}>
      <ModernDialog.Header title="How to Connect to Instagram" />
      <ModernDialog.Body>
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
      </ModernDialog.Body>
      <ModernDialog.Footer
        confirmLabel="Connect Instagram Account"
        onConfirm={onConnectClick}
        cancelLabel="Learn More"
        onCancel={handleLearnMore}
      />
    </ModernDialog>
  )
}

export default HowToConnectToInstagramDialog
