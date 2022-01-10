import { Grid, Typography } from '@material-ui/core'
import { isEqual, omit } from 'lodash'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { DealsListFilters, TDateRange, TDealsContexts } from '../../types'

import { FilterEditorFooter } from './filterEditorFooter'
import { RangeDateSelector } from './rangeDateSelector'
import { useStyles } from './styles'

interface Props extends FilterButtonDropDownProp<DealsListFilters> {
  id: keyof TDealsContexts
  title: string
  iconPath: string
}

export const DateFilterEditor = ({
  id,
  title,
  iconPath,
  filters,
  defaultFilters,
  updateFilters
}: Props) => {
  const classes = useStyles()

  const onChange = (newValues: Partial<TDateRange>) => {
    updateFilters({
      contexts: {
        ...(filters.contexts ?? {}),
        [id]: {
          date: {
            ...(filters.contexts[id]?.date ?? {}),
            ...newValues
          }
        }
      }
    })
  }

  const onReset = () => {
    updateFilters({
      contexts: omit(filters.contexts, id)
    })
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <SvgIcon path={iconPath} size={muiIconSizes.medium} />
        <Typography variant="subtitle1" className={classes.title}>
          {title}
        </Typography>
      </Grid>
      <RangeDateSelector
        onChange={onChange}
        value={filters.contexts[id]?.date}
      />
      <FilterEditorFooter
        disabledReset={isEqual(
          defaultFilters.contexts[id]?.date,
          filters.contexts[id]?.date
        )}
        onClickReset={onReset}
      />
    </Grid>
  )
}
