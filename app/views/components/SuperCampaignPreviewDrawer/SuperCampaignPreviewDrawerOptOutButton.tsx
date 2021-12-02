import { useContext, MouseEvent } from 'react'

import { Button, ButtonProps, makeStyles } from '@material-ui/core'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

const useStyles = makeStyles(
  theme => ({
    root: { color: theme.palette.error.main }
  }),
  { name: 'SuperCampaignPreviewDrawerOptOutButton' }
)

type SuperCampaignPreviewDrawerOptOutButtonProps = Omit<
  ButtonProps,
  'className' | 'color' | 'variant'
>

function SuperCampaignPreviewDrawerOptOutButton({
  onClick,
  ...otherProps
}: SuperCampaignPreviewDrawerOptOutButtonProps) {
  const classes = useStyles()
  const confirmation = useContext(ConfirmationModalContext)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    confirmation.setConfirmationModal({
      message: 'Are you sure about opting out of the campaign?',
      confirmLabel: 'Yes, I am',
      onConfirm: () => {
        onClick?.(event)
      }
    })
  }

  return (
    <Button
      {...otherProps}
      className={classes.root}
      color="inherit"
      variant="outlined"
      onClick={handleClick}
    >
      Opt-Out
    </Button>
  )
}

export default SuperCampaignPreviewDrawerOptOutButton
