import { useCallback } from 'react'

import { Grid, Typography } from '@material-ui/core'
import { mdiCalendarPlus } from '@mdi/js'
import { omit } from 'lodash'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { DealsListFilters, TDateRange } from '../../../types'
import { FilterEditorFooter } from '../filterEditorFooter'
import { RangeDateSelector } from '../rangeDateSelector'
import { useStyles } from '../styles'

export const ListDateEditor = ({
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
          list_date: {
            date: {
              ...(filters?.contexts?.list_date?.date ?? {}),
              ...newValues
            }
          }
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.contexts]
  )

  const onReset = useCallback(
    () => {
      updateFilters({
        contexts: {
          ...omit(filters.contexts, 'list_date')
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.contexts]
  )

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <SvgIcon path={mdiCalendarPlus} size={muiIconSizes.medium} />
        <Typography variant="subtitle1" className={classes.title}>
          Listing Date
        </Typography>
      </Grid>
      <RangeDateSelector
        onChange={onChange}
        value={filters.contexts.list_date?.date}
      />
      <FilterEditorFooter
        disabledReset={
          filters.contexts.list_date?.date.from ===
            defaultFilters.contexts.list_date?.date.from &&
          filters.contexts.list_date?.date.to ===
            defaultFilters.contexts.list_date?.date.to
        }
        onClickReset={onReset}
      />
    </Grid>
  )
}
