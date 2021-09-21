import { Button } from '@material-ui/core'
import KingBedOutlinedIcon from '@material-ui/icons/KingBedOutlined'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../styles'

export const BedsButton = ({
  onClick,
  filters,
  defaultFilters
}: FilterButtonToggler<AlertFilters>) => {
  const classes = useStyles()

  const isActive =
    filters.minimum_bedrooms !== defaultFilters.minimum_bedrooms ||
    filters.maximum_bedrooms !== defaultFilters.maximum_bedrooms

  return (
    <Button
      className={classes.button}
      onClick={onClick}
      color={isActive ? 'primary' : undefined}
      variant="outlined"
      size="medium"
      startIcon={<KingBedOutlinedIcon fontSize="small" />}
    >
      {isActive ? (
        <>
          {`${filters.minimum_bedrooms || 'any'} - ${
            filters.maximum_bedrooms || 'any'
          }`}
        </>
      ) : (
        <>Beds</>
      )}
    </Button>
  )
}
