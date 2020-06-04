import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  IconButton,
  Button,
  makeStyles,
  createStyles,
  useTheme,
  Theme
} from '@material-ui/core'

import SearchListingDrawer from 'components/SearchListingDrawer'

import { useIconStyles } from 'views/../styles/use-icon-styles'
import { updateListing } from 'actions/deals'

import { getField } from 'models/Deal/helpers/context'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import SiteLinkIcon from 'components/SvgIcons/SiteLink/SiteLinkIcon'
import TrashIcon from 'components/SvgIcons/Trash/TrashIcon'

import LoadingContainer from 'components/LoadingContainer'

interface Props {
  deal: IDeal
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mls: {
      display: 'flex',
      alignItems: 'center',
      '&:hover $removeButton': {
        display: 'block'
      }
    },
    removeButton: {
      display: 'none',
      '&:hover svg path': {
        fill: theme.palette.error.main
      }
    }
  })
)

export function MlsConnect({ deal }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const theme = useTheme<Theme>()
  const classes = useStyles()
  const iconClasses = useIconStyles()
  const dispatch = useDispatch()
  const confirmation = useContext(ConfirmationModalContext)

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)

  const handleSelectListing = async listings => {
    setIsDrawerOpen(false)
    setIsSaving(true)

    const listingId = Array.isArray(listings) ? listings[0].id : null

    try {
      await dispatch(updateListing(deal.id, listingId))
    } catch (e) {
      console.log(e)
    }

    setIsSaving(false)
  }

  const removeMlsConnection = () => {
    confirmation.setConfirmationModal({
      message: 'Remove MLS Listing?',
      description: 'Removing the MLS# will remove the property from your deal.',
      confirmLabel: 'Yes, I am sure',
      onConfirm: () => handleSelectListing({ id: null })
    })
  }

  if (isSaving) {
    return <LoadingContainer size="2rem" style={{ padding: '0' }} />
  }

  return (
    <>
      {deal.listing ? (
        <div className={classes.mls}>
          <Button color="secondary" size="medium" onClick={toggleDrawer}>
            MLS# {getField(deal, 'mls_number')}
          </Button>

          <IconButton
            color="secondary"
            size="small"
            target="_blank"
            href={`/dashboard/mls/${deal.listing}`}
          >
            <SiteLinkIcon
              className={iconClasses.small}
              fillColor={theme.palette.common.black}
            />
          </IconButton>

          <IconButton
            color="default"
            size="small"
            onClick={removeMlsConnection}
            className={classes.removeButton}
          >
            <TrashIcon
              className={iconClasses.small}
              fillColor={theme.palette.common.black}
            />
          </IconButton>
        </div>
      ) : (
        <Button color="secondary" size="medium" onClick={toggleDrawer}>
          Add MLS# number
        </Button>
      )}

      <SearchListingDrawer
        title="Connect Deal to MLS"
        isOpen={isDrawerOpen}
        allowedStatuses={['Pending', 'Leased', 'Active']}
        onClose={toggleDrawer}
        onSelectListingsCallback={handleSelectListing}
      />
    </>
  )
}

export default MlsConnect
