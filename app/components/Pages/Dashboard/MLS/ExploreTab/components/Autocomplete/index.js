import React, { Component } from 'react'

import Downshift from 'downshift'
import debounce from 'lodash/debounce'
import { browserHistory } from 'react-router'

import { getPlace } from '@app/models/listings/search/get-place'
import { searchListings } from '@app/models/listings/search/search-listings'
import { changeUrl } from '@app/utils/change-url'
import { getListingAddress } from '@app/utils/listing'
import { SearchInput } from '@app/views/components/GlobalHeaderWithSearch/SearchInput'
import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'
import { MlsItem } from '@app/views/components/SearchListingDrawer/ListingItem/MlsItem'

import {
  AUTOCOMPLETE_RADIUS_M,
  AUTOCOMPLETE_MINIMUM_LENGTH_FOR_SEARCH,
  AUTOCOMPLETE_SEARCH_DEBOUNCE_TIME_MS,
  AUTOCOMPLETE_LISTINGS_ITEM_LIMIT
} from '../../../constants'

import {
  SearchContainer,
  ListContainer,
  ListTitle,
  Item,
  NoResults
} from './styled'

class MlsAutocompleteSearch extends Component {
  state = {
    isLoading: false,
    isOpen: false,
    places: [],
    listings: [],
    input: '',
    selectedListingId: null,
    isListingDetailsModalOpen: false
  }

  inputRef = React.createRef()

  handleChangeInput = e => {
    const { value } = e.target

    this.setState({ input: value }, () => this.search(value))
  }

  onClear = () => {
    this.setState({ input: '', isOpen: false })

    if (typeof this.props.onClear === 'function') {
      this.props.onClear()
    }
  }

  autocompleteAddress(input) {
    const { google } = window

    const service = new google.maps.places.AutocompleteService()

    let request = {
      input,
      componentRestrictions: { country: 'us' },
      location: new google.maps.LatLng(this.props.mapCenter),
      radius: AUTOCOMPLETE_RADIUS_M // in meters
    }

    return new Promise(resolve => {
      service.getPlacePredictions(request, (results, status) => {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          resolve([])
        } else {
          resolve(results)
        }
      })
    })
  }

  search = debounce(async input => {
    input = input.trim()

    if (
      input.length <= AUTOCOMPLETE_MINIMUM_LENGTH_FOR_SEARCH ||
      this.state.isSearchingByQuery
    ) {
      return
    }

    try {
      this.setState({ isLoading: true, isOpen: false })

      const [places, listings] = await Promise.all([
        this.autocompleteAddress(input),
        searchListings(input, { limit: AUTOCOMPLETE_LISTINGS_ITEM_LIMIT })
      ])

      // For cancel search after starting search by query
      if (this.state.isSearchingByQuery) {
        return
      }

      this.setState({
        isLoading: false,
        isOpen: true,
        places,
        listings: listings.data.map(l => ({
          ...l,
          description: getListingAddress(l)
        }))
      })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false, isOpen: false })
    }
  }, AUTOCOMPLETE_SEARCH_DEBOUNCE_TIME_MS)

  handleSelectedPlace = async place => {
    this.setState({
      isLoading: true
    })

    try {
      const placeResponse = await getPlace(place.description, false)

      const types = placeResponse.types
      const center = placeResponse.geometry.location

      const bounds = {
        ne: placeResponse.geometry.viewport.northeast,
        sw: placeResponse.geometry.viewport.southwest
      }

      this.props.onSelectPlace(center, bounds, types, place.description)
    } finally {
      this.setState({
        isLoading: false
      })
    }
  }

  handleItemToString = item => (item == null ? '' : item.description)

  handleSelectedListing = item => {
    if (!this.props.isWidget) {
      changeUrl(`/dashboard/mls/${item.id}`)
    }

    this.setState({
      isListingDetailsModalOpen: true,
      selectedListingId: item.id
    })
  }

  closeListingDetailsModal = () => {
    if (!this.props.isWidget) {
      window.history.back()
    }

    this.setState({
      isListingDetailsModalOpen: false,
      selectedListingId: null
    })
  }

  handleClose = () => this.setState({ isOpen: false })

  handleInputFocus = () => {
    if (this.state.input && !this.state.isOpen) {
      if (this.state.listings.length > 0 || this.state.places.length > 0) {
        this.setState({ isOpen: true })
      } else {
        this.search(this.state.input)
      }
    }
  }

  handleSelectedItem = item => {
    this.setState({ input: item.description })

    if (item.type === 'compact_listing') {
      // It's a listing

      this.handleSelectedListing(item)
    } else if (this.props.landingPageSearch) {
      // It's a place and we are in search landing page
      const query = encodeURIComponent(item.description)

      browserHistory.push(`/dashboard/mls?q=${query}`)
      this.handleSelectedPlace(item)
    } else {
      this.handleSelectedPlace(item)
    }

    this.setState({ isOpen: false })
  }

  renderPlacesItem = item => (
    <>
      <span className="item__query">
        <span className="item__matched">
          {item.matched_substrings
            .map(s =>
              item.structured_formatting.main_text.substr(s.offset, s.length)
            )
            .join(' ')}
        </span>
        {item.structured_formatting.main_text.substr(
          item.matched_substrings[item.matched_substrings.length - 1].offset +
            item.matched_substrings[item.matched_substrings.length - 1].length,
          item.structured_formatting.main_text.length - 1
        )}
      </span>
      <span>{item.structured_formatting.secondary_text}</span>
    </>
  )

  render() {
    return (
      <>
        <SearchContainer>
          <Downshift
            isOpen={this.state.isOpen}
            onSelect={this.handleSelectedItem}
            itemToString={this.handleItemToString}
            onOuterClick={this.handleClose}
            render={props => {
              const { getItemProps, isOpen, highlightedIndex } = props

              return (
                <div>
                  <SearchInput
                    ref={this.inputRef}
                    value={this.state.input}
                    onChange={this.handleChangeInput}
                    onFocus={this.handleInputFocus}
                    onBlur={this.handleInputBlur}
                    placeholder="Search by MLS, City ..."
                    onClear={this.onClear}
                    isLoading={this.state.isLoading}
                    fullWidth={this.props.fullWidth}
                  />
                  {isOpen && (
                    <ListContainer>
                      {this.state.listings.length > 0 && (
                        <div
                          style={{
                            marginBottom: '0.5rem'
                          }}
                        >
                          <ListTitle>Listings</ListTitle>
                          {this.state.listings.map(item => (
                            <MlsItem
                              item={item}
                              key={item.id}
                              onClick={() => this.handleSelectedItem(item)}
                              style={{
                                padding: '0.5em 0.75em',
                                borderBottom: '1px solid #d4d4d4'
                              }}
                            />
                          ))}
                        </div>
                      )}
                      {this.state.places.length > 0 && (
                        <div>
                          <ListTitle>Places</ListTitle>
                          {this.state.places.map((item, index) => (
                            <Item
                              key={index}
                              {...getItemProps({
                                item,
                                isHighlighted: highlightedIndex === index
                              })}
                            >
                              {this.renderPlacesItem(item)}
                            </Item>
                          ))}
                        </div>
                      )}
                      {!this.state.listings.length &&
                        !this.state.places.length && (
                          <NoResults>No results</NoResults>
                        )}
                    </ListContainer>
                  )}
                </div>
              )
            }}
          />
        </SearchContainer>
        <ListingDetailsModal
          isWidget={!!this.props.isWidget}
          isOpen={this.state.isListingDetailsModalOpen}
          listingId={this.state.selectedListingId}
          closeHandler={this.closeListingDetailsModal}
        />
      </>
    )
  }
}

export default MlsAutocompleteSearch
