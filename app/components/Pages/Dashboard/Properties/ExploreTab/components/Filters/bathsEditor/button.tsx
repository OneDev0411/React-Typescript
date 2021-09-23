import { Button } from '@material-ui/core'
import BathtubOutlinedIcon from '@material-ui/icons/BathtubOutlined'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'

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
      size="medium"
      startIcon={<BathtubOutlinedIcon fontSize="small" />}
    >
      {isActive ? <>{filters.minimum_bathrooms}+</> : <>Baths</>}
    </Button>
  )
}
