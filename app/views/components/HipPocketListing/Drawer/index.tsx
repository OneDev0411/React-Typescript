import { makeStyles } from '@material-ui/core'

import OverlayDrawer from 'components/OverlayDrawer'

import HipPocketListingForm from '../Form'
import { HipPocketListingDrawerProps } from '../types'

const useStyles = makeStyles(
  theme => ({
    overlayBody: {
      paddingTop: theme.spacing(2)
    }
  }),
  {
    name: 'HipPocketListingDrawer'
  }
)

export default function HipPocketListingDrawer({
  title = 'Listing Details',
  isOpen,
  onClose,
  ...listingFormProps
}: HipPocketListingDrawerProps) {
  const classes = useStyles()

  return (
    <OverlayDrawer open={isOpen} onClose={onClose}>
      <OverlayDrawer.Header title={title} />
      <OverlayDrawer.Body className={classes.overlayBody}>
        <HipPocketListingForm {...listingFormProps} />
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}
