import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { FilterButtonDropDownProp } from '@app/views/components/Filters/FilterButton'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'
import { mapPostcodesToOptions } from '../helpers'

export interface ZipcodeOption {
  id: string
  title: string
}

export interface ZipCodeGroupProps {
  hasMapDrawing?: boolean
}

export const ZipcodeGroup = ({
  hasMapDrawing,
  filters,
  updateFilters
}: Omit<FilterButtonDropDownProp<AlertFilters>, 'resultsCount'> &
  ZipCodeGroupProps) => {
  const classes = useStyles()

  const onZipcodeChange = (_: unknown, values: ZipcodeOption[]) => {
    const selectedValues =
      values && values.length ? values.map(item => item.id) : null

    updateFilters({
      postal_codes: selectedValues
    })
  }

  return (
    <EditorGroup title="Zipcode">
      <Autocomplete
        disabled={hasMapDrawing}
        className={classes.select}
        classes={{ popper: 'u-scrollbar--thinner' }}
        id="zipcodes-select"
        options={mapPostcodesToOptions(filters.postal_codes)}
        size="small"
        multiple
        limitTags={1}
        value={hasMapDrawing ? [] : mapPostcodesToOptions(filters.postal_codes)}
        filterOptions={(options, params) => {
          if (params.inputValue) {
            return [
              {
                id: params.inputValue,
                title: `Add "${params.inputValue}"`
              }
            ]
          }

          return []
        }}
        getOptionLabel={option => option.title}
        onChange={onZipcodeChange}
        noOptionsText="Type in a ZIP code"
        freeSolo
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label=""
            placeholder="Type in a ZIP code ..."
            helperText="You can search in an area by either selecting the ZIP codes or drawing on the map, clear one to enable the other."
            InputProps={{
              ...params.InputProps,
              autoComplete: 'new-password' // disable autocomplete and autofill
            }}
          />
        )}
      />
    </EditorGroup>
  )
}
