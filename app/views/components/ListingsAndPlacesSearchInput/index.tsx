import React, { useState, useEffect, useMemo } from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  makeStyles,
  InputAdornment,
  TextField
} from '@material-ui/core'
import Autocomplete, {
  AutocompleteRenderInputParams
} from '@material-ui/lab/Autocomplete'
import throttle from 'lodash/throttle'
import { mdiHomeOutline, mdiMagnify, mdiMapMarkerOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { addressTitle } from 'utils/listing'
import { getPlaces } from 'models/listings/search/get-places'
import { searchListings } from 'models/listings/search/search-listings'

const useStyles = makeStyles(
  () => ({
    listBox: {
      maxHeight: 'initial'
    }
  }),
  {
    name: 'ListingsAndPlacesSearchInput'
  }
)

interface PlaceResult {
  type: 'place'
  place: google.maps.GeocoderResult
}

interface ListingResult {
  type: 'listing'
  listing: ICompactListing
}

export type SearchResult = PlaceResult | ListingResult

interface Props {
  placeholder?: string
  onSelect: (result: SearchResult) => void
}

export default function ListingsAndPlacesSearchInput({
  placeholder = 'Search address or MLS#',
  onSelect
}: Props) {
  const classes = useStyles()

  const [options, setOptions] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [inputValue, setInputValue] = useState<string>('')
  const [value, setValue] = useState<Nullable<SearchResult>>(null)

  const searchListinsAndPlaces = useMemo(
    () =>
      throttle(async (query: string) => {
        const listingsResponse = await searchListings(query, { limit: 5 })
        const placesResponse = await getPlaces(query)

        return [
          ...listingsResponse.data.map<ListingResult>(listing => ({
            type: 'listing',
            listing
          })),
          ...placesResponse.map<PlaceResult>(place => ({
            type: 'place',
            place
          }))
        ]
      }, 200),
    []
  )

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

        const fetchedOptions = await searchListinsAndPlaces(inputValue)

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
  }, [inputValue, searchListinsAndPlaces])

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
        listbox: classes.listBox
      }}
      loading={isLoading}
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      groupBy={option => (option.type === 'listing' ? 'Listings' : 'Places')}
      value={value}
      ListboxComponent={List}
      renderInput={renderInput}
      renderOption={renderOption}
      onChange={(event: unknown, newValue: Nullable<SearchResult>) => {
        if (newValue) {
          setValue(newValue)
          onSelect(newValue)
        }
      }}
      onInputChange={(event: unknown, newInputValue: string) => {
        setInputValue(newInputValue)
      }}
    />
  )
}
