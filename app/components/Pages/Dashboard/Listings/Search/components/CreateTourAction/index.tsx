import React, { useState } from 'react'
import { Button } from '@material-ui/core'

import CreateTourDrawer from 'components/tour/CreateTourDrawer/CreateTourDrawer'

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
      <CreateTourDrawer
        isOpen={isOpen}
        listings={props.listings}
        onClose={() => setIsOpen(false)}
        submitCallback={props.submitCallback}
        user={props.user}
      />
    </>
  )
}
