import React from 'react'
import { Grid, TextField, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useEffectOnce } from 'react-use'
import usePlacesAutocomplete, { Suggestion } from 'use-places-autocomplete'
import addressParser from 'parse-address'

import { mdiMapMarker } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { BaseFieldProps } from './types'

const FULL_ADDRESS_VARIABLE_NAME = 'listing.property.address.full_address'

interface AddressVariables {
  'listing.property.address.street_number': string
  'listing.property.address.street_name': string
  'listing.property.address.street_address': string
  'listing.property.address.city': string
  'listing.property.address.state': string
  'listing.property.address.postal_code': string
  'listing.property.address.full_address': string
}

function getAddressVariables(address: string): AddressVariables {
  const parsed = addressParser.parseLocation(address)

  const streetAddressParts = [
    parsed.number,
    parsed.prefix,
    parsed.street,
    parsed.type,
    parsed.city,
    parsed.sec_unit_type,
    parsed.sec_unit_num
  ].filter(item => !!item)

  const fullAddressParts = [
    ...streetAddressParts,
    parsed.city,
    parsed.state,
    parsed.zip
  ].filter(item => !!item)

  return {
    'listing.property.address.street_number': parsed.number,
    'listing.property.address.street_name': parsed.street,
    'listing.property.address.street_address': streetAddressParts.join(' '),
    'listing.property.address.city': parsed.city,
    'listing.property.address.state': parsed.state,
    'listing.property.address.postal_code': parsed.zip,
    'listing.property.address.full_address': fullAddressParts.join(' ')
  }
}

type Props = BaseFieldProps<'address'>

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
      variable.fields.find(item => item.name === FULL_ADDRESS_VARIABLE_NAME)
        ?.value ?? ''

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

        const addressVariables = getAddressVariables(
          selectedSuggestion.description
        )

        const newVariableValue = {
          ...variable,
          fields: variable.fields.map(addressField => {
            const value =
              addressVariables[addressField.name] || addressField.label

            return {
              ...addressField,
              value
            }
          })
        }

        onChange(newVariableValue)
      }}
    />
  )
}
