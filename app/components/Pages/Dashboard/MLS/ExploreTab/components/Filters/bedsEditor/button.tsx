import { Button } from '@material-ui/core'
import { mdiBedKingOutline } from '@mdi/js'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
      size="small"
      startIcon={<SvgIcon path={mdiBedKingOutline} size={muiIconSizes.small} />}
    >
      {isActive ? (
        <>
          {`${filters.minimum_bedrooms || 'Any'} - ${
            filters.maximum_bedrooms || 'Any'
          }`}
        </>
      ) : (
        <>Beds</>
      )}
    </Button>
  )
}
