import { Button, ButtonProps, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { color: theme.palette.error.main }
  }),
  { name: 'SuperCampaignPreviewDrawerOptOutButton' }
)

interface SuperCampaignPreviewDrawerOptOutButtonProps
  extends Omit<ButtonProps, 'className' | 'color' | 'variant' | 'onClick'> {
  onOptOut: () => void
  onOptOutAndCopy: () => void
}

function SuperCampaignPreviewDrawerOptOutButton({
  onOptOut,
  onOptOutAndCopy,
  ...otherProps
}: SuperCampaignPreviewDrawerOptOutButtonProps) {
  const classes = useStyles()

  return (
    <>
      <Button
        {...otherProps}
        className={classes.root}
        color="inherit"
        variant="outlined"
        onClick={onOptOut}
      >
        Opt-Out
      </Button>
      <button type="button" onClick={onOptOutAndCopy}>
        Opt-Out and Copy
      </button>
    </>
  )
}

export default SuperCampaignPreviewDrawerOptOutButton
