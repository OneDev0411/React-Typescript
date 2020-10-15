import React, { useState } from 'react'

import { Slide, Box, Button, Theme, makeStyles } from '@material-ui/core'
import pluralize from 'pluralize'

import { useListSelection } from 'components/ListSelection/use-list-selection'
import SearchListingDrawer from 'components/SearchListingDrawer'

import { EmailAction } from './Email'
import { CreateTourAction } from './Tour'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'sticky',
      borderTop: `1px solid ${theme.palette.divider}`,
      bottom: 0,
      backgroundColor: theme.palette.common.white,
      height: theme.spacing(8),
      padding: theme.spacing(0, 2),
      '& button': {
        marginRight: theme.spacing(1)
      }
    }
  }),
  {
    name: 'ShareListings'
  }
)

export function ShareListings() {
  const classes = useStyles()
  const [isListingDrawerOpen, setIsListingDrawerOpen] = useState(false)

  const { selections, reinitialize } = useListSelection()

  const getDefaultSelectedItems = () => {
    return selections.reduce(
      (acc: Record<string, IListing>, listing: IListing) => ({
        ...acc,
        [listing.id]: listing
      }),
      {}
    )
  }

  const handleUpdateSelectedListings = (listings: IListing[]) => {
    setIsListingDrawerOpen(false)
    reinitialize(listings)
  }

  if (selections.length === 0) {
    return null
  }

  return (
    <>
      <Slide in direction="up">
        <Box display="flex" alignItems="center" className={classes.root}>
          <Button
            size="small"
            variant="text"
            onClick={() => setIsListingDrawerOpen(true)}
          >
            {selections.length}&nbsp;{pluralize('Listing', selections.length)}{' '}
            Selected
          </Button>

          <EmailAction />
          <CreateTourAction />
        </Box>
      </Slide>

      {isListingDrawerOpen && (
        <SearchListingDrawer
          isOpen
          title="Manage Listings"
          allowSkip={false}
          multipleSelection
          defaultSelectedItems={getDefaultSelectedItems()}
          onSelectListingsCallback={handleUpdateSelectedListings}
          renderAction={({ buttonProps }) => (
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={buttonProps.onClick}
            >
              Update List
            </Button>
          )}
          onClose={() => setIsListingDrawerOpen(false)}
        />
      )}
    </>
  )
}
