import { Button } from '@material-ui/core'
import { mdiCalendarPlus } from '@mdi/js'
import cn from 'classnames'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { DealsListFilters } from '../../../types'
import { useStyles } from '../styles'

export const ListDateButton = ({
  onClick,
  filters,
  defaultFilters
}: FilterButtonToggler<DealsListFilters>) => {
  const classes = useStyles()

  const isActive =
    defaultFilters.contexts.list_date?.date.from !==
      filters.contexts.list_date?.date.from ||
    defaultFilters.contexts.list_date?.date.to !==
      filters.contexts.list_date?.date.to

  return (
    <Button
      onClick={onClick}
      color={isActive ? 'primary' : undefined}
      variant="outlined"
      size="medium"
      className={cn({
        [classes.button]: true,
        active: true
      })}
      startIcon={<SvgIcon path={mdiCalendarPlus} size={muiIconSizes.small} />}
    >
      Listing Date
    </Button>
  )
}
