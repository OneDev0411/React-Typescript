import React, { useState, useContext } from 'react'
import { Button } from '@material-ui/core'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import CreateTourDrawer from 'components/tour/CreateTourDrawer/CreateTourDrawer'

interface Props {
  disabled: boolean
  isExceeded: boolean
  listings: ICompactListing[]
  submitCallback: () => void
  user: IUser
}

export default function CreateTourAction(props: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const modal = useContext(ConfirmationModalContext)

  const handleCreateTourDrawer = () => {
    // Google JS API can't route for more than 25 waypoint along with an start and an end. Resulting 27 points.
    // Original issue: https://gitlab.com/rechat/web/-/issues/3922#note_303336248
    if (props.isExceeded) {
      modal.setConfirmationModal({
        message: 'Error',
        // eslint-disable-next-line
        description:
          "You can't have more than 27 listings selected for a toursheet. Please deselect some and try again.",
        needsCancel: false,
        confirmLabel: 'Got it'
      })
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        disabled={props.disabled}
        size="small"
        onClick={handleCreateTourDrawer}
      >
        Create Tour
      </Button>
      <CreateTourDrawer
        isOpen={isOpen}
        listings={props.listings}
        onClose={() => setIsOpen(false)}
        submitCallback={props.submitCallback}
        deleteCallback={props.submitCallback}
        user={props.user}
      />
    </>
  )
}
