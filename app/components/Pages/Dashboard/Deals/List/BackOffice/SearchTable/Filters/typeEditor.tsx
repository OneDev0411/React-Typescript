import { FormControlLabel, Grid, Switch, Typography } from '@material-ui/core'
import { isEqual } from 'underscore'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { DealsListFilters } from '../../types'

import { FilterEditorFooter } from './filterEditorFooter'
import { useStyles } from './styles'

export const DEAL_TYPES_ITEMS: Record<IDealType, string> = {
  Selling: 'Listings',
  Buying: 'Buyings'
}

export const TypeEditor = ({
  filters,
  defaultFilters,
  updateFilters
}: FilterButtonDropDownProp<DealsListFilters>) => {
  const classes = useStyles()

  const toggleValues = (
    currentDealTypes: IDealType[] = [],
    newDealType: IDealType
  ) => {
    let toggledDealTypes: IDealType[] = []

    if (currentDealTypes.includes(newDealType)) {
      // User should select at least one option
      // switch option in this case
      if (currentDealTypes.length === 1) {
        toggledDealTypes = newDealType === 'Buying' ? ['Selling'] : ['Buying']
      } else {
        toggledDealTypes = currentDealTypes.filter(item => {
          return item !== newDealType
        })
      }
    } else {
      toggledDealTypes = [...currentDealTypes, newDealType]
    }

    updateFilters({
      deal_type: toggledDealTypes.sort()
    })
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <Typography variant="subtitle1" className={classes.title}>
          Side
        </Typography>
      </Grid>

      {Object.keys(DEAL_TYPES_ITEMS).map((type: IDealType) => (
        <FormControlLabel
          key={type}
          classes={{
            root: classes.switchControlLabel
          }}
          control={
            <Switch
              checked={filters.deal_type?.includes(type)}
              className={classes.switchControlButton}
              color="primary"
              name={DEAL_TYPES_ITEMS[type]}
              onChange={() => {
                toggleValues(filters.deal_type, type)
              }}
              inputProps={{
                'aria-label': `${DEAL_TYPES_ITEMS[type]} checkbox`
              }}
            />
          }
          label={
            <Grid container alignItems="center">
              <Typography variant="body1">{`${DEAL_TYPES_ITEMS[type]}`}</Typography>
            </Grid>
          }
        />
      ))}
      <FilterEditorFooter
        disabledReset={isEqual(filters.deal_type, defaultFilters.deal_type)}
        onClickReset={() => {
          updateFilters({ deal_type: defaultFilters.deal_type })
        }}
      />
    </Grid>
  )
}
