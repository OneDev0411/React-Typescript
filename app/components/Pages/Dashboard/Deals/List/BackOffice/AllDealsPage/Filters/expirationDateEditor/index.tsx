import { useCallback } from 'react'

import { Grid, Typography } from '@material-ui/core'
import { mdiCalendarRemove } from '@mdi/js'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { DealsListFilters, TDateRange } from '../../../types'
import { FilterEditorFooter } from '../filterEditorFooter'
import { RangeDateSelector } from '../rangeDateSelector'
import { useStyles } from '../styles'

export const ExpirationDateEditor = ({
  filters,
  defaultFilters,
  updateFilters
}: FilterButtonDropDownProp<DealsListFilters>) => {
  const classes = useStyles()

  const onChange = useCallback(
    (newValues: Partial<TDateRange>) => {
      updateFilters({
        contexts: {
          ...(filters.contexts ?? {}),
          expiration_date: {
            date: {
              ...(filters?.contexts?.expiration_date?.date ?? {}),
              ...newValues
            }
          }
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.contexts]
  )

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <SvgIcon path={mdiCalendarRemove} size={muiIconSizes.medium} />
        <Typography variant="subtitle1" className={classes.title}>
          Listing Expiration
        </Typography>
      </Grid>
      <RangeDateSelector
        onChange={onChange}
        value={filters.contexts.expiration_date?.date}
      />
      <FilterEditorFooter
        disabledReset={
          filters.contexts.expiration_date?.date.from ===
            defaultFilters.contexts.expiration_date?.date.from &&
          filters.contexts.expiration_date?.date.to ===
            defaultFilters.contexts.expiration_date?.date.to
        }
        onClickReset={() => {
          onChange({ from: undefined, to: undefined })
        }}
      />
    </Grid>
  )
}
