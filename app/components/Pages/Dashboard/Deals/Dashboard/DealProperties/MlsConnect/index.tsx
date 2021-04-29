import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  IconButton,
  Button,
  makeStyles,
  useTheme,
  Theme
} from '@material-ui/core'

import { mdiTrashCanOutline, mdiOpenInNew, mdiPencil } from '@mdi/js'

import SearchListingDrawer from 'components/SearchListingDrawer'
import { updateListing } from 'actions/deals'
import { getField } from 'models/Deal/helpers/context'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import LoadingContainer from 'components/LoadingContainer'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { ItemValue, ItemActions } from '../../Factsheet/styled'

interface Props {
  deal: IDeal
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: 'relative'
  },
  editButton: {
    padding: theme.spacing(0, 1)
  },
  addButton: {
    padding: theme.spacing(0)
  }
}))

export function MlsConnect({ deal }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const theme = useTheme<Theme>()
  const classes = useStyles()
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
    return <LoadingContainer size="1.5rem" noPaddings />
  }

  return (
    <>
      <ItemValue>
        {deal.listing ? (
          <span>MLS# {getField(deal, 'mls_number')}</span>
        ) : (
          <Button
            size="small"
            className={classes.addButton}
            onClick={toggleDrawer}
          >
            Add MLS# Number
          </Button>
        )}
      </ItemValue>

      <ItemActions>
        {deal.listing && (
          <>
            <IconButton
              size="small"
              target="_blank"
              href={`/dashboard/mls/${deal.listing}`}
            >
              <SvgIcon
                path={mdiOpenInNew}
                color={theme.palette.common.black}
                size={muiIconSizes.small}
              />
            </IconButton>

            <IconButton onClick={toggleDrawer} size="small">
              <SvgIcon
                path={mdiPencil}
                color={theme.palette.common.black}
                size={muiIconSizes.small}
              />
            </IconButton>

            <IconButton
              color="default"
              size="small"
              onClick={removeMlsConnection}
            >
              <SvgIcon
                path={mdiTrashCanOutline}
                color={theme.palette.common.black}
                size={muiIconSizes.small}
              />
            </IconButton>
          </>
        )}
      </ItemActions>

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
