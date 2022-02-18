import { Button } from '@material-ui/core'
import { mdiCurrencyUsd } from '@mdi/js'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useStyles } from '../styles'

import { ConvertPriceShortFormat } from './helpers'

export const PriceButton = ({
  onClick,
  filters,
  defaultFilters
}: FilterButtonToggler<AlertFilters>) => {
  const classes = useStyles()

  const isActive =
    filters.minimum_price !== defaultFilters.minimum_price ||
    filters.maximum_price !== defaultFilters.maximum_price

  return (
    <Button
      className={classes.button}
      onClick={onClick}
      color={isActive ? 'primary' : undefined}
      variant="outlined"
      size="small"
      startIcon={<SvgIcon path={mdiCurrencyUsd} size={muiIconSizes.small} />}
    >
      {isActive ? (
        <>
          {`${
            filters.minimum_price
              ? ConvertPriceShortFormat(filters.minimum_price)
              : 'Any'
          } - ${
            filters.maximum_price
              ? ConvertPriceShortFormat(filters.maximum_price)
              : 'Any'
          }`}
        </>
      ) : (
        <>Any Price</>
      )}
    </Button>
  )
}
