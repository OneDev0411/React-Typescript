import { Button } from '@material-ui/core'
import { mdiCheckboxBlankCircle } from '@mdi/js'
import cn from 'classnames'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { PROPERTY_TYPES } from '../../../../constants'
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
      startIcon={
        <SvgIcon
          path={mdiCheckboxBlankCircle}
          size={muiIconSizes.small}
          className={classes.typeIcon}
        />
      }
    >
      {PROPERTY_TYPES[filters.property_types[0]]}
    </Button>
  )
}
