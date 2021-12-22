import { Button } from '@material-ui/core'
import { mdiListStatus } from '@mdi/js'
import cn from 'classnames'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { DealsListFilters } from '../../../types'
import { useStyles } from '../styles'

export function isStatusFilterChanged(
  defaults: DealsListFilters,
  current: DealsListFilters
) {
  return (
    !!current.status.is_active !== !!defaults.status.is_active ||
    !!current.status.is_archived !== !!defaults.status.is_archived ||
    !!current.status.is_closed !== !!defaults.status.is_closed ||
    !!current.status.is_null !== !!defaults.status.is_null ||
    !!current.status.is_pending !== !!defaults.status.is_pending
  )
}
export const StatusButton = ({
  onClick,
  filters,
  defaultFilters
}: FilterButtonToggler<DealsListFilters>) => {
  const classes = useStyles()

  const isActive = isStatusFilterChanged(defaultFilters, filters)

  return (
    <Button
      onClick={onClick}
      color={isActive ? 'primary' : undefined}
      variant="outlined"
      size="small"
      className={cn({
        [classes.button]: true,
        active: true
      })}
      startIcon={<SvgIcon path={mdiListStatus} size={muiIconSizes.small} />}
    >
      Status
    </Button>
  )
}
