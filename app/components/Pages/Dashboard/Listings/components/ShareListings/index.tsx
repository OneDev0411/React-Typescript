import React, { useState } from 'react'

import {
  Slide,
  Box,
  Button,
  Theme,
  makeStyles,
  Typography,
  Divider,
  Avatar,
  IconButton
} from '@material-ui/core'
import pluralize from 'pluralize'

import { mdiHomeCityOutline, mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { useListSelection } from 'components/ListSelection/use-list-selection'
import SearchListingDrawer from 'components/SearchListingDrawer'

import { TextTransition } from 'components/TextTransition'

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
      padding: theme.spacing(0, 4),
      '& button': {
        marginLeft: theme.spacing(1)
      }
    },
    divider: {
      height: theme.spacing(5),
      margin: theme.spacing(0, 2)
    },
    avatar: {
      backgroundColor: theme.palette.grey['100'],
      marginRight: theme.spacing(2)
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

  const clearSelections = () => reinitialize([])

  if (selections.length === 0) {
    return null
  }

  return (
    <>
      <Slide in direction="up">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={classes.root}
        >
          <Box display="flex" alignItems="center">
            <Avatar className={classes.avatar}>
              <SvgIcon path={mdiHomeCityOutline} />
            </Avatar>
            <TextTransition
              variant="button"
              duration={0.75}
              repeat={2}
              text={`${selections.length} ${pluralize(
                'Listing',
                selections.length
              )}
              `}
            />
            Selected
            <Button
              variant="text"
              color="secondary"
              onClick={() => setIsListingDrawerOpen(true)}
            >
              Edit/View
            </Button>
            <Divider orientation="vertical" className={classes.divider} />
            <EmailAction />
            <CreateTourAction />
          </Box>

          <div>
            <IconButton onClick={clearSelections}>
              <SvgIcon path={mdiClose} />
            </IconButton>
          </div>
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
