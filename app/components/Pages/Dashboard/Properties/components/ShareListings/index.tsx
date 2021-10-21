import React, { useState } from 'react'

import { Slide, Box, Button, Theme, makeStyles, alpha } from '@material-ui/core'
import { mdiClose, mdiShoePrint, mdiEmailOutline } from '@mdi/js'

import { GridActionButton } from '@app/views/components/Grid/Table/features/Actions/Button'
import { useListSelection } from '@app/views/components/ListSelection/use-list-selection'
import SearchListingDrawer from '@app/views/components/SearchListingDrawer'
import { TextTransition } from '@app/views/components/TextTransition'

import { EmailAction } from './Email'
import { CreateTourAction } from './Tour'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      zIndex: 3,
      position: 'sticky',
      bottom: `${theme.spacing(3.5)}px`,
      width: '95%',
      height: theme.spacing(10),
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: theme.spacing(0, 2),
      background: theme.palette.tertiary.main,
      borderRadius: `${theme.spacing(2)}px`,
      boxShadow: `0 ${theme.spacing(0.5)}px ${theme.spacing(2)}px ${alpha(
        theme.palette.common.black,
        0.4
      )}`
    },
    selectedCount: {
      color: theme.palette.background.paper
    },
    summary: {
      display: 'flex'
    },
    reviewSelection: {
      marginLeft: theme.spacing(1),
      color: theme.palette.secondary.main,
      cursor: 'pointer'
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
      (acc: Record<string, ICompactListing>, listing: ICompactListing) => ({
        ...acc,
        [listing.id]: listing
      }),
      {}
    )
  }

  const handleUpdateSelectedListings = (listings: ICompactListing[]) => {
    setIsListingDrawerOpen(false)
    reinitialize(listings)
  }

  const clearSelections = () => reinitialize([])

  if (selections.length === 0) {
    return null
  }

  return (
    <>
      <Slide in direction="up">
        <Box className={classes.root}>
          <GridActionButton
            label="Cancel"
            icon={mdiClose}
            onClick={clearSelections}
          />
          <GridActionButton
            label={
              <Box className={classes.summary}>
                <span>Selected</span>
                <span
                  className={classes.reviewSelection}
                  onClick={() => setIsListingDrawerOpen(true)}
                >
                  View
                </span>
              </Box>
            }
            textIcon={
              <Box className={classes.selectedCount}>
                <TextTransition
                  variant="h6"
                  duration={0.75}
                  repeat={2}
                  text={`${selections.length}`}
                />
              </Box>
            }
          />
          <EmailAction
            buttonRenderer={({ onClick }) => (
              <GridActionButton
                label="Email"
                icon={mdiEmailOutline}
                onClick={onClick}
              />
            )}
          />
          <CreateTourAction
            buttonRenderer={({ onClick }) => (
              <GridActionButton
                label="Tour"
                icon={mdiShoePrint}
                onClick={onClick}
              />
            )}
          />
        </Box>
      </Slide>

      {isListingDrawerOpen && (
        <SearchListingDrawer
          isOpen
          withMlsDisclaimer
          title="Manage Listings"
          multipleSelection
          // @ts-ignore
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
