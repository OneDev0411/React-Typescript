import React, { useState, useContext } from 'react'
import { Button } from '@material-ui/core'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import CreateTourDrawer from 'components/tour/CreateTourDrawer/CreateTourDrawer'

interface Props {
  disabled: boolean
  listings: ICompactListing[]
  submitCallback: () => void
  user: IUser
}

export default function CreateTourAction(props: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const modal = useContext(ConfirmationModalContext)

  const handleCreateTourDrawer = () => {
    if (props.listings.length > 27) {
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
        variant="contained"
        disabled={props.disabled}
        color="primary"
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
