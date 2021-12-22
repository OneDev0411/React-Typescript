import { Button } from '@material-ui/core'
import cn from 'classnames'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'

import { DEAL_TYPES } from '../../../constants'
import { DealsListFilters } from '../../../types'
import { useStyles } from '../styles'

import { DEAL_TYPES_ITEMS } from './index'

export const TypeButton = ({
  onClick,
  filters,
  defaultFilters
}: FilterButtonToggler<DealsListFilters>) => {
  const classes = useStyles()

  const isActive =
    defaultFilters.deal_type &&
    filters.deal_type &&
    filters.deal_type[0] !== defaultFilters.deal_type[0]

  const getTitle = () => {
    if (typeof filters.deal_type === 'undefined') {
      return 'Select Deals Type'
    }

    if (filters.deal_type.length === DEAL_TYPES.length) {
      return 'Listings & Contracts'
    }

    return `${DEAL_TYPES_ITEMS[filters.deal_type[0]]}`
  }

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
    >
      {getTitle()}
    </Button>
  )
}
