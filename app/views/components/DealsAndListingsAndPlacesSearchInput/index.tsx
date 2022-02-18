import { useState, useEffect } from 'react'

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  TextFieldProps,
  InputAdornment,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import Autocomplete, {
  AutocompleteRenderInputParams
} from '@material-ui/lab/Autocomplete'
import {
  mdiMapMarkerOutline,
  mdiMagnify,
  mdiHomeOutline,
  mdiDatabaseOutline
} from '@mdi/js'
import { merge } from 'lodash'
import { useSelector } from 'react-redux'
import { useDebouncedCallback } from 'use-debounce'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { IAppState } from 'reducers'
import { selectDealsList } from 'selectors/deals'
import { addressTitle } from 'utils/listing'

import { searchDealsAndListingsAndPlaces } from './helpers'
import ListingStatus from './ListingStatus'
import { SearchResult, SearchResultType } from './types'

const useStyles = makeStyles<Theme, { inputValue: string }>(
  theme => ({
    listBox: {
      maxHeight: 300
    },
    popper: ({ inputValue }) => ({
      display: inputValue.length < 3 ? 'none' : 'block'
    }),
    mlsDetailsContainer: {
      display: 'flex',
      paddingLeft: theme.spacing(1),
      flexDirection: 'column',
      alignItems: 'flex-end'
    },
    listingStatus: {
      width: 'fit-content',
      marginBottom: theme.spacing(1)
    },
    mlsSource: {
      ...theme.typography.caption,
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey[700]
    },
    mlsSourceIcon: {
      maxWidth: 14, // From figma
      maxHeight: 14, // From figma
      marginRight: theme.spacing(0.5)
    }
  }),
  {
    name: 'DealsAndListingsAndPlacesSearchInput'
  }
)

const DEFAULT_SEARCH_TYPES: SearchResultType[] = ['listing', 'place']
const DEFAULT_TEXT_FIELD_PROPS: TextFieldProps = {
  placeholder: 'Search address or MLS#',
  autoComplete: 'new-password',
  variant: 'outlined',
  size: 'small',
  InputProps: {
    startAdornment: (
      <InputAdornment position="start">
        <SvgIcon path={mdiMagnify} />
      </InputAdornment>
    )
  }
}

interface Props {
  textFieldProps?: TextFieldProps
  searchTypes?: SearchResultType[]
  onSelect: (result: SearchResult) => void
}

export default function DealsAndListingsAndPlacesSearchInput({
  textFieldProps = DEFAULT_TEXT_FIELD_PROPS,
  searchTypes = DEFAULT_SEARCH_TYPES,
  onSelect
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
              <SvgIcon path={mdiHomeOutline} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={deal.title} />
        </ListItem>
      )
    }

    if (option.type === 'listing') {
      const listing = option.listing

      const address = [
        listing.address.neighborhood,
        listing.address.city,
        listing.address.state,
        listing.address.postal_code,
        `$${listing.price.toLocaleString()}`
      ]
        .filter(part => !!part)
        .join(', ')

      return (
        <ListItem dense disableGutters component="div">
          <ListItemAvatar>
            <Avatar src={listing.cover_image_url}>
              <SvgIcon path={mdiHomeOutline} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={addressTitle(listing.address)}
            secondary={address}
          />
          <ListItemAvatar>
            <div className={classes.mlsDetailsContainer}>
              <ListingStatus
                listing={listing}
                className={classes.listingStatus}
              />

              <Typography
                component="p"
                variant="caption"
                color="textSecondary"
                title="Listing Provider (MLS) Source"
                className={classes.mlsSource}
              >
                <SvgIcon
                  className={classes.mlsSourceIcon}
                  path={mdiDatabaseOutline}
                />
                {listing.mls_display_name}
              </Typography>
            </div>
          </ListItemAvatar>
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
    return <TextField {...merge(params, textFieldProps)} />
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
