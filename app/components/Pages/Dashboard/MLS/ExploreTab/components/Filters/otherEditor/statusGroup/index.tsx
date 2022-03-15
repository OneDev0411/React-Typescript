import { useCallback, useEffect, useState } from 'react'

import {
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Checkbox,
  FormGroup
} from '@material-ui/core'
import { mdiCircleMedium } from '@mdi/js'

import {
  STATUSES,
  PENDING_STATUSES,
  OTHER_STATUSES
} from '@app/components/Pages/Dashboard/MLS/constants'
import { getPropertyTypeFirstElement } from '@app/components/Pages/Dashboard/MLS/helpers/get-listings-helpers'
import { getStatusColorClass } from '@app/utils/listing'
import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const StatusGroup = ({
  filters,
  defaultFilters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'>) => {
  const classes = useStyles()
  const listingStatuses = filters.listing_statuses || []

  const statusValue = useCallback(
    (key: IListingStatus) => {
      return !!filters.listing_statuses?.find(s => s === key)
    },
    [filters.listing_statuses]
  )

  const [isPendingExtended, setIsPendingExtended] = useState<boolean>(
    statusValue(PENDING_STATUSES.pending) ||
      statusValue(PENDING_STATUSES.active_contingent) ||
      statusValue(PENDING_STATUSES.active_kick_out) ||
      statusValue(PENDING_STATUSES.active_option_contract)
  )

  const [isOtherExtended, setIsOtherExtended] = useState<boolean>(
    statusValue(OTHER_STATUSES.expired) ||
      statusValue(OTHER_STATUSES.cancelled) ||
      statusValue(OTHER_STATUSES.withdrawn) ||
      statusValue(OTHER_STATUSES.temp_off_market) ||
      statusValue(OTHER_STATUSES.withdrawn_sublistin)
  )

  const handleChangePending = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPendingExtended(event.target.checked)

    if (event.target.checked === true) {
      updateFilters({
        listing_statuses: [
          ...listingStatuses,
          ...Object.values(PENDING_STATUSES)
        ]
      })
    } else {
      const newStatuses = listingStatuses.filter(
        el => !Object.values(PENDING_STATUSES).includes(el)
      )

      updateFilters({
        listing_statuses: newStatuses.length
          ? [...newStatuses]
          : defaultFilters.listing_statuses
      })
    }
  }

  const handleChangeOther = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOtherExtended(event.target.checked)

    if (event.target.checked === true) {
      updateFilters({
        listing_statuses: [...listingStatuses, ...Object.values(OTHER_STATUSES)]
      })
    } else {
      const newStatuses = listingStatuses.filter(
        el => !Object.values(OTHER_STATUSES).includes(el)
      )

      updateFilters({
        listing_statuses: newStatuses.length
          ? [...newStatuses]
          : defaultFilters.listing_statuses
      })
    }
  }

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      updateFilters({
        listing_statuses: [
          ...new Set([
            ...listingStatuses,
            event.target.name
          ] as IListingStatus[])
        ]
      })
    } else {
      const newStatuses = listingStatuses.filter(el => el !== event.target.name)

      updateFilters({
        listing_statuses: newStatuses.length
          ? [...newStatuses]
          : defaultFilters.listing_statuses
      })
    }
  }

  useEffect(() => {
    setIsPendingExtended(
      statusValue(PENDING_STATUSES.pending) ||
        statusValue(PENDING_STATUSES.active_contingent) ||
        statusValue(PENDING_STATUSES.active_kick_out) ||
        statusValue(PENDING_STATUSES.active_option_contract)
    )

    setIsOtherExtended(
      statusValue(OTHER_STATUSES.expired) ||
        statusValue(OTHER_STATUSES.cancelled) ||
        statusValue(OTHER_STATUSES.withdrawn) ||
        statusValue(OTHER_STATUSES.temp_off_market) ||
        statusValue(OTHER_STATUSES.withdrawn_sublistin)
    )
  }, [statusValue])

  return (
    <EditorGroup>
      {getPropertyTypeFirstElement(filters) === 'Residential Lease' ? (
        <FormControlLabel
          classes={{
            root: classes.switchControlLabel
          }}
          control={
            <Switch
              checked={statusValue('Leased')}
              className={classes.switchControlButton}
              color="primary"
              name="Leased"
              onChange={handleValueChange}
              inputProps={{ 'aria-label': 'Leased checkbox' }}
            />
          }
          label={
            <Grid container alignItems="center">
              <SvgIcon
                path={mdiCircleMedium}
                className={classes.switchIcon}
                style={{ color: getStatusColorClass('Leased') }}
              />
              <Typography variant="body1">{STATUSES.leased}</Typography>
            </Grid>
          }
        />
      ) : (
        <FormControlLabel
          classes={{
            root: classes.switchControlLabel
          }}
          control={
            <Switch
              checked={statusValue('Sold')}
              className={classes.switchControlButton}
              color="primary"
              name="Sold"
              onChange={handleValueChange}
              inputProps={{ 'aria-label': 'sold checkbox' }}
            />
          }
          label={
            <Grid container alignItems="center">
              <SvgIcon
                path={mdiCircleMedium}
                className={classes.switchIcon}
                style={{ color: getStatusColorClass('Sold') }}
              />
              <Typography variant="body1">{STATUSES.sold}</Typography>
            </Grid>
          }
        />
      )}
      <FormControlLabel
        classes={{
          root: classes.switchControlLabel
        }}
        control={
          <Switch
            className={classes.switchControlButton}
            color="primary"
            checked={statusValue('Active')}
            name="Active"
            onChange={handleValueChange}
            inputProps={{ 'aria-label': 'active checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <SvgIcon
              path={mdiCircleMedium}
              className={classes.switchIcon}
              style={{ color: getStatusColorClass('Active') }}
            />
            <Typography variant="body1">{STATUSES.active}</Typography>
          </Grid>
        }
      />
      <FormControlLabel
        classes={{
          root: classes.switchControlLabel
        }}
        control={
          <Switch
            className={classes.switchControlButton}
            checked={isPendingExtended}
            color="primary"
            name="Pending"
            onChange={handleChangePending}
            inputProps={{ 'aria-label': 'Pending checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <SvgIcon
              path={mdiCircleMedium}
              className={classes.switchIcon}
              style={{ color: getStatusColorClass('Pending') }}
            />
            <Typography variant="body1">{STATUSES.pending}</Typography>
          </Grid>
        }
      />
      {isPendingExtended && (
        <FormGroup className={classes.subStatusGroup} row>
          {Object.values(PENDING_STATUSES).map(key => (
            <Grid item key={key} xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={statusValue(key)}
                    onChange={handleValueChange}
                    name={key}
                  />
                }
                label={key}
              />
            </Grid>
          ))}
        </FormGroup>
      )}
      <FormControlLabel
        classes={{
          root: classes.switchControlLabel
        }}
        control={
          <Switch
            className={classes.switchControlButton}
            color="primary"
            name="other"
            checked={isOtherExtended}
            onChange={handleChangeOther}
            inputProps={{ 'aria-label': 'Other checkbox' }}
          />
        }
        label={
          <Grid container alignItems="center">
            <SvgIcon
              path={mdiCircleMedium}
              className={classes.switchIcon}
              style={{ color: getStatusColorClass('Withdrawn') }}
            />
            <Typography variant="body1">{STATUSES.other}</Typography>
          </Grid>
        }
      />
      {isOtherExtended && (
        <FormGroup className={classes.subStatusGroup} row>
          {Object.values(OTHER_STATUSES).map(key => (
            <Grid item key={key} xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={statusValue(key)}
                    onChange={handleValueChange}
                    name={key}
                  />
                }
                label={key}
              />
            </Grid>
          ))}
        </FormGroup>
      )}
    </EditorGroup>
  )
}
