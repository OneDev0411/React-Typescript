import React, { useState, useEffect } from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  InputAdornment,
  TextField,
  makeStyles,
  Theme
} from '@material-ui/core'
import Autocomplete, {
  AutocompleteRenderInputParams
} from '@material-ui/lab/Autocomplete'
import { useDebouncedCallback } from 'use-debounce'
import { mdiHomeOutline, mdiMagnify, mdiMapMarkerOutline } from '@mdi/js'

import { addressTitle } from 'utils/listing'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { searchListingsAndPlaces } from './helpers'
import { SearchResult } from './types'

const useStyles = makeStyles<Theme, { inputValue: string }>(
  () => ({
    listBox: {
      maxHeight: 300
    },
    popper: ({ inputValue }) => ({
      display: inputValue === '' ? 'none' : 'block'
    })
  }),
  {
    name: 'ListingsAndPlacesSearchInput'
  }
)

interface Props {
  placeholder?: string
  onSelect: (result: SearchResult) => void
}

export default function ListingsAndPlacesSearchInput({
  placeholder = 'Search address or MLS#',
  onSelect
}: Props) {
  const [inputValue, setInputValue] = useState<string>('')
  const classes = useStyles({ inputValue })

  const [options, setOptions] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [value, setValue] = useState<Nullable<SearchResult>>(null)

  const [debouncedHandleInputChange] = useDebouncedCallback(
    (event: unknown, newInputValue: string) => {
      setInputValue(newInputValue)
    },
    300
  )

  function handleChange(event: unknown, newValue: Nullable<SearchResult>) {
    if (newValue) {
      setValue(newValue)
      onSelect(newValue)
    }
  }

  useEffect(() => {
    async function fetchListingsAndPlaces() {
      if (inputValue.length === 0) {
        setOptions([])

        return
      }

      if (inputValue.length < 3) {
        return
      }

      try {
        setIsLoading(true)

        const fetchedOptions = await searchListingsAndPlaces(inputValue)

        setOptions(fetchedOptions)
      } catch (error) {
        console.error(
          'Something went wrong while searching for place or listing',
          error
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchListingsAndPlaces()
  }, [inputValue])

  function getOptionLabel(option: SearchResult) {
    return option.type === 'listing'
      ? option.listing.address.street_address
      : option.place.formatted_address
  }

  function getOptionSelected(option: SearchResult) {
    if (value?.type === 'listing' && option.type === 'listing') {
      return value.listing.id === option.listing.id
    }

    if (value?.type === 'place' && option.type === 'place') {
      return value.place.place_id === option.place.place_id
    }

    return false
  }

  function renderOption(option: SearchResult) {
    if (option.type === 'listing') {
      const listing = option.listing

      return (
        <ListItem dense disableGutters>
          <ListItemAvatar>
            <Avatar src={listing.cover_image_url}>
              <SvgIcon path={mdiHomeOutline} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={addressTitle(listing.address)}
            secondary={`${listing.address.city}, ${listing.address.state}, ${
              listing.address.postal_code
            }, $${listing.price.toLocaleString()}`}
          />
        </ListItem>
      )
    }

    const place = option.place

    return (
      <ListItem dense disableGutters>
        <ListItemAvatar>
          <Avatar>
            <SvgIcon path={mdiMapMarkerOutline} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={place.formatted_address} />
      </ListItem>
    )
  }

  function renderInput(params: AutocompleteRenderInputParams) {
    return (
      <TextField
        {...params}
        placeholder={placeholder}
        variant="outlined"
        autoComplete="new-password"
        size="small"
        InputProps={{
          ...params.inputProps,
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <SvgIcon path={mdiMagnify} />
            </InputAdornment>
          )
        }}
      />
    )
  }

  return (
    <Autocomplete<SearchResult>
      fullWidth
      clearOnBlur={false}
      forcePopupIcon={false}
      noOptionsText="No Results"
      classes={{
        listbox: classes.listBox,
        popper: classes.popper
      }}
      loading={isLoading}
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      groupBy={option => (option.type === 'listing' ? 'Listings' : 'Places')}
      value={value}
      filterOptions={option => option}
      ListboxComponent={List}
      renderInput={renderInput}
      renderOption={renderOption}
      onChange={handleChange}
      onInputChange={debouncedHandleInputChange}
    />
  )
}
