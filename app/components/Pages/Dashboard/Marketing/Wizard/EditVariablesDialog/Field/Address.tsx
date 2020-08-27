import React from 'react'
import { Grid, TextField, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useEffectOnce } from 'react-use'
import usePlacesAutocomplete, { Suggestion } from 'use-places-autocomplete'
import addressParser from 'parse-address'

import { mdiMapMarker } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { BaseFieldProps } from './types'

interface Props extends BaseFieldProps<'address'> {}

export default function Address({ variable, onChange }: Props) {
  const {
    ready,
    value,
    suggestions: { loading, data },
    setValue
  } = usePlacesAutocomplete({
    debounce: 300
  })

  useEffectOnce(() => {
    const fullAddress =
      variable.fields.find(
        item => item.name === 'listing.property.address.full_address'
      )?.value ?? ''

    setValue(fullAddress, true)
  })

  return (
    <Autocomplete
      fullWidth
      clearOnBlur={false}
      loading={loading}
      disabled={!ready}
      inputValue={value}
      options={data}
      onInputChange={(event: unknown, newValue) => setValue(newValue)}
      renderInput={params => (
        <TextField
          {...params}
          label={variable.label}
          variant="outlined"
          size="small"
          fullWidth
        />
      )}
      getOptionLabel={option => option.description}
      getOptionSelected={(option, testingValue) =>
        option.reference === testingValue.reference
      }
      renderOption={option => (
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <SvgIcon path={mdiMapMarker} />
          </Grid>
          <Grid item xs>
            <Typography variant="body1">
              {option.structured_formatting.main_text}
            </Typography>
            <Typography variant="body2">
              {option.structured_formatting.secondary_text}
            </Typography>
          </Grid>
        </Grid>
      )}
      onChange={(event: unknown, selectedSuggestion: Suggestion | null) => {
        if (!selectedSuggestion) {
          return
        }

        const parsed = addressParser.parseLocation(
          selectedSuggestion.description
        )

        const locationPartsToVariablesMapping = {
          'listing.property.address.street_number': 'number',
          'listing.property.address.street_name': 'street',
          'listing.property.address.city': 'city',
          'listing.property.address.state': 'state',
          'listing.property.address.postal_code': 'zip',
          'listing.property.address.full_address': 'description'
        }

        const finalValue = {
          ...variable,
          fields: variable.fields.map(addressField => {
            const value =
              parsed[locationPartsToVariablesMapping[addressField.name]] ||
              selectedSuggestion[
                locationPartsToVariablesMapping[addressField.name]
              ] ||
              addressField.label

            return {
              ...addressField,
              value
            }
          })
        }

        onChange(finalValue)
      }}
    />
  )
}
