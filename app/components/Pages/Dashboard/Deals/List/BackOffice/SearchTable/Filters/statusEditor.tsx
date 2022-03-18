import { FormControlLabel, Grid, Switch, Typography } from '@material-ui/core'
import { mdiListStatus } from '@mdi/js'
import { isEqual, omit } from 'lodash'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { DEALS_STATUSES } from '../../constants'
import { DealsListFilters, TDealsStatus, TDealsStatusList } from '../../types'

import { FilterEditorFooter } from './filterEditorFooter'
import { useStyles } from './styles'

export const StatusEditor = ({
  filters,
  updateFilters,
  defaultFilters
}: FilterButtonDropDownProp<DealsListFilters>) => {
  const classes = useStyles()

  const toggleValue = (
    currentStatuses: TDealsStatusList = {} as TDealsStatusList,
    changedStatusKey: TDealsStatus
  ) => {
    const newStatuses = currentStatuses[changedStatusKey]
      ? omit(currentStatuses, changedStatusKey)
      : {
          ...currentStatuses,
          [changedStatusKey]: true
        }

    updateFilters({
      status: newStatuses
    })
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <SvgIcon path={mdiListStatus} size={muiIconSizes.medium} />

        <Typography variant="subtitle1" className={classes.title}>
          Deals status
        </Typography>
      </Grid>

      {Object.keys(DEALS_STATUSES).map((status: TDealsStatus) => (
        <FormControlLabel
          key={status}
          classes={{
            root: classes.switchControlLabel
          }}
          control={
            <Switch
              checked={!!filters.status[status]}
              className={classes.switchControlButton}
              color="primary"
              name={status}
              onChange={() => {
                toggleValue(filters.status, status)
              }}
              inputProps={{
                'aria-label': `${DEALS_STATUSES[status]} checkbox`
              }}
            />
          }
          label={
            <Grid container alignItems="center">
              <Typography variant="body1">{DEALS_STATUSES[status]}</Typography>
            </Grid>
          }
        />
      ))}

      <FilterEditorFooter
        disabledReset={isEqual(filters.status, defaultFilters.status)}
        onClickReset={() => {
          updateFilters({ status: defaultFilters.status })
        }}
      />
    </Grid>
  )
}
