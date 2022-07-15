import { Button, Grid, makeStyles } from '@material-ui/core'

import { Modal, ModalHeader, ModalFooter } from 'components/Modal'

import { IAdjustment, IListingWithAdjustment } from './types'

interface Props {
  listing: IListingWithAdjustment
  onChange: (id: UUID, changedValue: IAdjustment[]) => void
  onClose: () => void
}

const useStyles = makeStyles(
  theme => ({
    body: {
      position: 'relative',
      padding: theme.spacing(0, 10),
      overflowY: 'scroll',
      height: '75vh'
    },
    saveButton: {
      minWidth: 120,
      marginLeft: theme.spacing(2)
    }
  }),
  { name: 'EditAdjustmentModal' }
)

export function EditAdjustmentModal({ listing, onChange, onClose }: Props) {
  const classes = useStyles()

  // TODO: change this line
  const handleSave = () => {
    onChange(listing.id, listing.adjustments!!)
  }

  return (
    <Modal isOpen autoHeight>
      <ModalHeader title="Listings Adjustment" />
      <div className={classes.body}>
        {listing.property.address.full_address}
      </div>
      <ModalFooter>
        <Grid container direction="row-reverse" justifyContent="space-between">
          <Grid
            item
            container
            direction="row-reverse"
            xs={7}
            justifyContent="flex-start"
          >
            <Button
              className={classes.saveButton}
              variant="contained"
              type="submit"
              color="primary"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button variant="outlined" type="reset" color="default">
              Clear Form
            </Button>
          </Grid>
          <Grid item container xs={5} justifyContent="space-between">
            <Button variant="text" color="default" onClick={onClose}>
              Back to listings
            </Button>
          </Grid>
        </Grid>
      </ModalFooter>
    </Modal>
  )
}
