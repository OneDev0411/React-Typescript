import React, { useState } from 'react'
import { Button } from '@material-ui/core'

import { TourDrawer } from 'components/tour/TourDrawer'

interface Props {
  disabled: boolean
  listings: ICompactListing[]
  submitCallback: () => void
  user: IUser
}

export default function CreateTourAction(props: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <Button
        disabled={props.disabled}
        variant="outlined"
        size="small"
        onClick={() => setIsOpen(true)}
      >
        Create Tour
      </Button>
      {isOpen && (
        <TourDrawer
          isOpen
          listings={props.listings}
          onClose={() => setIsOpen(false)}
          user={props.user}
          submitCallback={props.submitCallback}
        />
      )}
    </>
  )
}
