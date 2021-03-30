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
import {
  mdiHomeOutline,
  mdiMagnify,
  mdiMapMarkerOutline,
  mdiCurrencyUsdCircleOutline
} from '@mdi/js'

import { useSelector } from 'react-redux'

import { selectDealsList } from 'selectors/deals'

import { addressTitle } from 'utils/listing'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { IAppState } from 'reducers'

import { searchDealsAndListingsAndPlaces } from './helpers'
import { SearchResult, SearchResultType } from './types'

const useStyles = makeStyles<Theme, { inputValue: string }>(
  () => ({
    listBox: {
      maxHeight: 300
    },
    popper: ({ inputValue }) => ({
      display: inputValue.length < 3 ? 'none' : 'block'
    })
  }),
  {
    name: 'DealsAndListingsAndPlacesSearchInput'
  }
)

interface Props {
  placeholder?: string
  onSelect: (result: SearchResult) => void
  autoFocus?: boolean
  searchTypes?: SearchResultType[]
}

const DEFAULT_SEARCH_TYPES: SearchResultType[] = ['listing', 'place']

export default function DealsAndListingsAndPlacesSearchInput({
  placeholder = 'Search address or MLS#',
  onSelect,
  autoFocus = false,
  searchTypes = DEFAULT_SEARCH_TYPES
}: Props) {
  const [inputValue, setInputValue] = useState<string>('')
  const classes = useStyles({ inputValue })
  const hasDealSearchType = searchTypes.includes('deal')

  const [options, setOptions] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [value, setValue] = useState<Optional<SearchResult>>(undefined)

  const deals = useSelector((state: IAppState) =>
    hasDealSearchType ? selectDealsList(state) : undefined
  )

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

        const fetchedOptions = await searchDealsAndListingsAndPlaces(
          deals,
          searchTypes,
          inputValue
        )

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
  }, [inputValue, deals, searchTypes])

  function getOptionLabel(option: SearchResult) {
    switch (option.type) {
      case 'deal':
        return option.deal.title
      case 'listing':
        return option.listing.address.street_address
      case 'place':
      default:
        return option.place.formatted_address
    }
  }

  function getOptionSelected(option: SearchResult) {
    if (value?.type === 'deal' && option.type === 'deal') {
      return value.deal.id === option.deal.id
    }

    if (value?.type === 'listing' && option.type === 'listing') {
      return value.listing.id === option.listing.id
    }

    if (value?.type === 'place' && option.type === 'place') {
      return value.place.place_id === option.place.place_id
    }

    return false
  }

  function renderOption(option: SearchResult) {
    if (option.type === 'deal') {
      const deal = option.deal

      return (
        <ListItem dense disableGutters component="div">
          <ListItemAvatar>
            <Avatar>
              <SvgIcon path={mdiCurrencyUsdCircleOutline} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={deal.title} />
        </ListItem>
      )
    }

    if (option.type === 'listing') {
      const listing = option.listing

      return (
        <ListItem dense disableGutters component="div">
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
      <ListItem dense disableGutters component="div">
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
        autoFocus={autoFocus}
      />
    )
  }

  function groupBy(option: SearchResult) {
    switch (option.type) {
      case 'deal':
        return 'Deals'
      case 'listing':
        return 'Listings'
      case 'place':
      default:
        return 'Places'
    }
  }

  return (
    <Autocomplete<SearchResult, false, true>
      fullWidth
      disableClearable
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
      groupBy={groupBy}
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
