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

export const ListExpirationEditor = ({
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
          list_expiration: {
            date: {
              ...(filters?.contexts?.list_expiration?.date ?? {}),
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
          List Expiration
        </Typography>
      </Grid>
      <RangeDateSelector
        onChange={onChange}
        value={filters.contexts.list_expiration?.date}
      />
      <FilterEditorFooter
        disabledReset={
          filters.contexts.list_expiration?.date.from ===
            defaultFilters.contexts.list_expiration?.date.from &&
          filters.contexts.list_expiration?.date.to ===
            defaultFilters.contexts.list_expiration?.date.to
        }
        onClickReset={() => {
          onChange({ from: undefined, to: undefined })
        }}
      />
    </Grid>
  )
}
