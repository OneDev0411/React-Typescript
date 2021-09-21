import { Button } from '@material-ui/core'
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined'

import { FilterButtonToggler } from '@app/views/components/Filters/FilterButton'

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
      size="medium"
      startIcon={<AttachMoneyOutlinedIcon fontSize="small" />}
    >
      {isActive ? (
        <>
          {`${
            filters.minimum_price
              ? ConvertPriceShortFormat(filters.minimum_price)
              : 'any'
          } - ${
            filters.maximum_price
              ? ConvertPriceShortFormat(filters.maximum_price)
              : 'any'
          }`}
        </>
      ) : (
        <>Any Price</>
      )}
    </Button>
  )
}
