import { useCallback } from 'react'

import { Grid, Typography } from '@material-ui/core'
import { mdiCalendarCheckOutline } from '@mdi/js'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { DealsListFilters, TDateRange } from '../../../types'
import { FilterEditorFooter } from '../filterEditorFooter'
import { RangeDateSelector } from '../rangeDateSelector'
import { useStyles } from '../styles'

export const ClosingDateEditor = ({
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
          closing_date: {
            date: {
              ...(filters?.contexts?.closing_date?.date ?? {}),
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
        <SvgIcon path={mdiCalendarCheckOutline} size={muiIconSizes.medium} />
        <Typography variant="subtitle1" className={classes.title}>
          Closing Date
        </Typography>
      </Grid>
      <RangeDateSelector
        onChange={onChange}
        value={filters.contexts.closing_date?.date}
      />
      <FilterEditorFooter
        disabledReset={
          filters.contexts.closing_date?.date.from ===
            defaultFilters.contexts.closing_date?.date.from &&
          filters.contexts.closing_date?.date.to ===
            defaultFilters.contexts.closing_date?.date.to
        }
        onClickReset={() => {
          onChange({ from: undefined, to: undefined })
        }}
      />
    </Grid>
  )
}
