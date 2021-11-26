import { Button } from '@material-ui/core'
import { mdiCalendarRemove } from '@mdi/js'
import cn from 'classnames'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { DealsListFilters } from '../../../types'
import { useStyles } from '../styles'

export const ListExpirationButton = ({
  onClick,
  filters,
  defaultFilters
}: FilterButtonToggler<DealsListFilters>) => {
  const classes = useStyles()

  const isActive =
    defaultFilters.contexts.list_expiration?.date.from !==
      filters.contexts.list_expiration?.date.from ||
    defaultFilters.contexts.list_expiration?.date.to !==
      filters.contexts.list_expiration?.date.to

  const getTitle = () => {
    if (
      !filters.contexts.list_expiration?.date.from &&
      !filters.contexts.list_expiration?.date.to
    ) {
      return 'Select List Expiration'
    }

    return 'List Expiration'
  }

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
      startIcon={<SvgIcon path={mdiCalendarRemove} size={muiIconSizes.small} />}
    >
      {getTitle()}
    </Button>
  )
}
