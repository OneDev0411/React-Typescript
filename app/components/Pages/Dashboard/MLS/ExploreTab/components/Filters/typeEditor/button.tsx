import { Button } from '@material-ui/core'
import { mdiCheckboxBlankCircle } from '@mdi/js'
import cn from 'classnames'

import { getPropertyTypeFirstElement } from '@app/components/Pages/Dashboard/MLS/helpers/get-listings-helpers'
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
    getPropertyTypeFirstElement(filters) !==
    getPropertyTypeFirstElement(defaultFilters)

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
      startIcon={
        <SvgIcon
          path={mdiCheckboxBlankCircle}
          size={muiIconSizes.small}
          className={classes.typeIcon}
        />
      }
    >
      {filters.property_types && PROPERTY_TYPES[filters.property_types[0]]}
    </Button>
  )
}
