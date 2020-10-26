import React, { ComponentProps, MouseEvent, useState } from 'react'
import { Grid, Button, Popover } from '@material-ui/core'

import ListingAlertFiltersList from 'components/ListingAlertFiltersList'
import ListingAlertFiltersEditor from 'components/ListingAlertFiltersEditor'

type Props = Omit<
  ComponentProps<typeof ListingAlertFiltersList>,
  'children' | 'onClick'
> &
  ComponentProps<typeof ListingAlertFiltersEditor>

export default function ListingAlertFilters({
  title,
  filters,
  limit,
  onApply
}: Props) {
  const [alertFiltersAnchor, setAlertFiltersAnchor] = useState<
    Nullable<HTMLButtonElement>
  >(null)

  function handleShowAlertFiltersDialog(event: MouseEvent<HTMLButtonElement>) {
    setAlertFiltersAnchor(event.currentTarget)
  }

  function handleCloseAlertFiltersDialog() {
    setAlertFiltersAnchor(null)
  }

  function handleApplyFilters(filters: AlertFiltersWithRadiusAndCenter) {
    onApply(filters)
    handleCloseAlertFiltersDialog()
  }

  const isAlertFiltersDialogOpen = Boolean(alertFiltersAnchor)

  return (
    <>
      <ListingAlertFiltersList
        filters={filters}
        limit={limit}
        onClick={handleShowAlertFiltersDialog}
      >
        <Grid item>
          <Button variant="outlined" onClick={handleShowAlertFiltersDialog}>
            More
          </Button>
        </Grid>
      </ListingAlertFiltersList>
      <Popover
        id="listing-alert-filters-popover"
        open={isAlertFiltersDialogOpen}
        anchorEl={alertFiltersAnchor}
        onClose={handleCloseAlertFiltersDialog}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <ListingAlertFiltersEditor
          title={title}
          filters={filters}
          onApply={handleApplyFilters}
        />
      </Popover>
    </>
  )
}
