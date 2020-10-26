import React, { useContext, useState } from 'react'

import { Button, Tooltip } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import CreateTourDrawer from 'components/tour/CreateTourDrawer/CreateTourDrawer'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { useListSelection } from 'components/ListSelection/use-list-selection'

import getListing from 'models/listings/listing/get-listing'

export function CreateTourAction() {
  const { selections } = useListSelection()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoadingListings, setIsLoadingListings] = useState(false)
  const [listings, setListings] = useState<IListing[]>([])

  const modal = useContext(ConfirmationModalContext)

  const user = useSelector<IAppState, IUser>(({ user }) => user)

  const handleOpen = async () => {
    if (selections.length > 27) {
      modal.setConfirmationModal({
        message: 'Error',
        description:
          "You can't have more than 27 listings selected for a toursheet. Please deselect some and try again.",
        confirmLabel: 'Got it'
      })

      return
    }

    setIsLoadingListings(true)

    try {
      const listings = await Promise.all(
        selections.map(async (selection: IListing) => {
          return getListing(selection.id)
        })
      )

      setListings(listings)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoadingListings(false)
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
          variant="outlined"
          disabled={isLoadingListings}
          onClick={handleOpen}
        >
          Tour
        </Button>
      </Tooltip>

      <CreateTourDrawer
        isOpen={isDrawerOpen}
        listings={listings}
        onClose={() => setIsDrawerOpen(false)}
        submitCallback={onCreate}
        user={user}
      />
    </>
  )
}
