import React, { useContext, useState } from 'react'

import { Button, Tooltip } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import CreateTourDrawer from 'components/tour/CreateTourDrawer/CreateTourDrawer'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { useListSelection } from 'components/ListSelection/use-list-selection'

export function CreateTourAction() {
  const { selections } = useListSelection()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const modal = useContext(ConfirmationModalContext)

  const user = useSelector<IAppState, IUser>(({ user }) => user)

  const handleOpen = () => {
    if (selections.length > 27) {
      modal.setConfirmationModal({
        message: 'Error',
        description:
          "You can't have more than 27 listings selected for a toursheet. Please deselect some and try again.",
        confirmLabel: 'Got it'
      })

      return
    }

    setIsDrawerOpen(true)
  }

  const onCreate = () => {
    setIsDrawerOpen(false)
  }

  return (
    <>
      <Tooltip title="Create Tour">
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={handleOpen}
        >
          Tour
        </Button>
      </Tooltip>

      <CreateTourDrawer
        isOpen={isDrawerOpen}
        listings={selections as ICompactListing[]}
        onClose={() => setIsDrawerOpen(false)}
        submitCallback={onCreate}
        user={user}
      />
    </>
  )
}
