import { Grid, TextField, Typography } from '@material-ui/core'
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined'
import { Autocomplete } from '@material-ui/lab'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { FilterEditorFooter } from '../filterEditorFooter'
import { useStyles } from '../styles'

import { createPriceArray, ConvertPriceShortFormat } from './helpers'

export const PriceEditor = ({
  filters,
  updateFilters,
  defaultFilters,
  resultsCount
}: FilterButtonDropDownProp<AlertFilters>) => {
  const classes = useStyles()

  const handleChange = (
    fieldName: keyof typeof defaultFilters,
    newValue: Nullable<number>
  ) => {
    const fieldValue = Number(newValue || 0) || null

    updateFilters({ [fieldName]: fieldValue })
  }

  return (
    <Grid className={classes.editorRoot}>
      <Grid container alignItems="center" className={classes.header}>
        <AttachMoneyOutlinedIcon />
        <Typography variant="subtitle1" className={classes.title}>
          Price
        </Typography>
      </Grid>

      <Grid container alignItems="center" wrap="nowrap">
        <Grid item xs={5}>
          <Autocomplete
            size="small"
            value={filters.minimum_price}
            // TODO: should consider the selected maximum price
            options={createPriceArray()}
            onChange={(e: any, newValue: Nullable<number>) =>
              handleChange('minimum_price', newValue)
            }
            getOptionLabel={option =>
              option ? ConvertPriceShortFormat(option) : 'No Min'
            }
            renderInput={params => (
              <TextField {...params} label="Min" variant="outlined" />
            )}
          />
        </Grid>
        <Grid item container justifyContent="center" xs={2}>
          <Typography className={classes.to} variant="body1">
            To
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Autocomplete
            size="small"
            value={filters.maximum_price}
            // TODO: should consider the selected minimum price
            options={createPriceArray()}
            onChange={(e: any, newValue: Nullable<number>) =>
              handleChange('maximum_price', newValue)
            }
            getOptionLabel={option =>
              option ? ConvertPriceShortFormat(option) : 'No Max'
            }
            renderInput={params => (
              <TextField
                {...params}
                placeholder="No Max"
                label="Max"
                variant="outlined"
              />
            )}
          />
        </Grid>
      </Grid>
      <FilterEditorFooter
        resultCount={resultsCount}
        onClickReset={() => {
          updateFilters({
            minimum_price: defaultFilters.minimum_price,
            maximum_price: defaultFilters.maximum_price
          })
        }}
      />
    </Grid>
  )
}
