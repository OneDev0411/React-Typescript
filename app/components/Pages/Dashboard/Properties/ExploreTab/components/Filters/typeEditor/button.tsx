import { Button } from '@material-ui/core'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import cn from 'classnames'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'

import { PROPERTY_TYPES } from '../../../../constants/constants'
import { useStyles } from '../styles'

export const TypeButton = ({
  onClick,
  filters,
  defaultFilters
}: FilterButtonToggler<AlertFilters>) => {
  const classes = useStyles()

  const isActive =
    filters.property_types[0] !== defaultFilters.property_types[0]

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
      startIcon={<FiberManualRecordIcon fontSize="small" color="primary" />}
    >
      {PROPERTY_TYPES[filters.property_types[0]]}
    </Button>
  )
}
