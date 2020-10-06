import React, { useState } from 'react'

import { Box, Button, makeStyles, Theme, Tooltip } from '@material-ui/core'
import pluralize from 'pluralize'

import { useShareAction } from 'components/ShareAction/use-share-action'
import SearchListingDrawer from 'components/SearchListingDrawer'

import { EmailAction } from './Email'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'sticky',
      borderTop: `1px solid ${theme.palette.divider}`,
      bottom: 0,
      backgroundColor: '#fff',
      height: theme.spacing(10),
      padding: theme.spacing(0, 2),
      zIndex: theme.zIndex.gridAction,
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

  const { selections, reinitialize } = useShareAction()

  const getDefaultSelectedItems = () => {
    return selections.reduce(
      (acc, listing) => ({
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

        <Tooltip title="Send as Text">
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => {}}
          >
            Text
          </Button>
        </Tooltip>
      </Box>

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
