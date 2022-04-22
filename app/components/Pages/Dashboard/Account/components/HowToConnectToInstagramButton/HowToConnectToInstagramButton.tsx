import { useState } from 'react'

import { Button, ButtonProps, makeStyles } from '@material-ui/core'
import { mdiHelpCircleOutline } from '@mdi/js'

import ModernDialog from '@app/views/components/ModernDialog'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    list: { paddingLeft: theme.spacing(3) }
  }),
  { name: 'HowToConnectToInstagramButton' }
)

type HowToConnectToInstagramButtonProps = Omit<
  ButtonProps,
  'size' | 'startIcon' | 'children'
>

function HowToConnectToInstagramButton({
  onClick,
  ...otherProps
}: HowToConnectToInstagramButtonProps) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const openDialog = () => setOpen(true)

  const closeDialog = () => setOpen(false)

  const handleLearnMore = () => {
    // TODO: Set the address that will be provided by Sahar
    window.open('https://help.rechat.com/guides/marketing', '_blank')
  }

  return (
    <>
      <Button
        {...otherProps}
        size="small"
        startIcon={
          <SvgIcon path={mdiHelpCircleOutline} size={muiIconSizes.small} />
        }
        onClick={openDialog}
      >
        How to connect to Instagram
      </Button>
      <ModernDialog open={open} onClose={closeDialog}>
        <ModernDialog.Header title="How to Connect to Instagram" />
        <ModernDialog.Body>
          <ol className={classes.list}>
            <li>You need to have a Facebook page.</li>
            <li>
              You need to have an Instagram business account (or update your
              personal account to business account).
            </li>
            <li>
              Your Facebook and Instagram page should be connected to each
              other.
            </li>
            <li>Connect your Instagram business account to Rechat.</li>
          </ol>
        </ModernDialog.Body>
        <ModernDialog.Footer
          confirmLabel="Connect Instagram Account"
          onConfirm={onClick}
          cancelLabel="Learn More"
          onCancel={handleLearnMore}
        />
      </ModernDialog>
    </>
  )
}

export default HowToConnectToInstagramButton
