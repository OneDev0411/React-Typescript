import { Button } from '@material-ui/core'
import { mdiShower } from '@mdi/js'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useStyles } from '../styles'

export const BathsButton = ({
  onClick,
  filters,
  defaultFilters
}: FilterButtonToggler<AlertFilters>) => {
  const classes = useStyles()

  const isActive =
    filters.minimum_bathrooms !== defaultFilters.minimum_bathrooms

  return (
    <Button
      className={classes.button}
      onClick={onClick}
      color={isActive ? 'primary' : undefined}
      variant="outlined"
      size="small"
      startIcon={<SvgIcon size={muiIconSizes.small} path={mdiShower} />}
    >
      {isActive ? <>{filters.minimum_bathrooms}+</> : <>Baths</>}
    </Button>
  )
}
