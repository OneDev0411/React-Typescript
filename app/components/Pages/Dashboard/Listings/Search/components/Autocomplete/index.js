import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Downshift from 'downshift'
import debounce from 'lodash/debounce'
import { batchActions } from 'redux-batched-actions'

import { SearchInput } from 'components/GlobalHeaderWithSearch/SearchInput'

import { getPlace } from 'models/listings/search/get-place'
import { searchListings } from 'models/listings/search/search-listings'

import { getBounds } from 'utils/map'
import { getMapBoundsInCircle } from 'utils/get-coordinates-points'
import { getListingAddress } from 'utils/listing'

import {
  reset as resetSearchType,
  setSearchType
} from 'actions/listings/search/set-type'
import searchActions from 'actions/listings/search'
import { getListingsByQuery } from 'actions/listings/search/get-listings-by-query'
import { goToPlace, setMapProps } from 'actions/listings/map'
import resetAreasOptions from 'actions/listings/search/reset-areas-options'
import { removePolygon, inactiveDrawing } from 'actions/listings/map/drawing'

import { MlsItem } from 'components/SearchListingDrawer/ListingItem/MlsItem'

import {
  SEARCH_BY_GOOGLE_SUGGESTS,
  SEARCH_BY_QUERY
} from '../../../../../../../constants/listings/search'

import { SearchContainer, ListContainer, ListTitle, Item } from './styled'

class MlsAutocompleteSearch extends Component {
  state = {
    isLoading: false,
    isOpen: false,
    isSearchingByQuery: false,
    places: [],
    listings: [],
    input: '',
    // eslint-disable-next-line
    isDrity: false
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.input && !state.isDrity && props.searchInput !== state.input) {
      return { input: props.searchInput }
    }

    return null
  }

  componentWillUnmount() {
    this.props.dispatch(searchActions.setSearchInput(this.state.input))
  }

  inputRef = React.createRef()

  handleChangeInput = e => {
    const { value } = e.target

    this.setState({ input: value, isDrity: true }, () => this.search(value))
  }

  handleKeyDownInput = e => {
    if (e.keyCode === 13) {
      this.handleEnterKey()
    }
  }

  handleInputBlur = () => {
    if (this.state.isSearchingByQuery) {
      this.setState({
        isLoading: false,
        isOpen: false,
        isSearchingByQuery: false
      })
    }
  }

  onClear = () => {
    const { dispatch } = this.props

    this.setState({ input: '', isOpen: false }, () =>
      batchActions([
        dispatch(resetSearchType()),
        dispatch(searchActions.setSearchInput('')),
        dispatch(searchActions.setSearchLocation(null))
      ])
    )
  }

  disableDrawing = () => {
    const { drawing, dispatch } = this.props

    if (drawing.points.length > 2) {
      batchActions([
        dispatch(removePolygon(drawing.shape)),
        dispatch(inactiveDrawing())
      ])
    }
  }

  goToAddress = async address => {
    const { dispatch } = this.props

    const place = await getPlace(address.description, false)

    this.setState({ isOpen: false })

    const zoom = 16
    let center = place.geometry.location

    if (this.props.activeView === 'map') {
      dispatch(goToPlace({ center, zoom }))
    } else {
      const { points, bounds } = getMapBoundsInCircle(
        center,
        1.61803398875 / 2,
        true
      )

      batchActions([
        dispatch(
          searchActions.getListings.byValert({
            ...this.props.filterOptions,
            limit: 200,
            points
          })
        ),
        dispatch(
          setMapProps('search', { center, zoom, bounds: getBounds(bounds) })
        )
      ])
    }

    batchActions([
      dispatch(searchActions.setSearchLocation(center)),
      dispatch(searchActions.setSearchInput(this.state.input))
    ])
  }

  autocompleteAddress(input) {
    const { google } = window

    const service = new google.maps.places.AutocompleteService()

    let request = {
      input,
      componentRestrictions: { country: 'us' },
      location: new google.maps.LatLng(this.props.mapCenter),
      radius: 100000 // in meters
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

    if (input.length <= 3 || this.state.isSearchingByQuery) {
      return
    }

    try {
      this.setState({ isLoading: true, isOpen: false })

      const [places, listings] = await Promise.all([
        this.autocompleteAddress(input),
        searchListings(input, { limit: 5 })
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
  }, 300)

  handleSelectedPlace = async place => {
    const { dispatch } = this.props

    batchActions([
      dispatch(resetAreasOptions()),
      this.disableDrawing(),
      dispatch(setSearchType(SEARCH_BY_GOOGLE_SUGGESTS))
    ])

    return this.goToAddress(place)
  }

  handleItemToString = item => (item == null ? '' : item.description)

  handleSelectedListing = item => {
    browserHistory.push(`/dashboard/mls/${item.id}`)
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
      this.handleSelectedListing(item)
    } else {
      this.handleSelectedPlace(item)
    }
  }

  handleEnterKey = async () => {
    const { dispatch } = this.props

    if (this.state.input.trim().length < 3) {
      return
    }

    this.setState({ isSearchingByQuery: true, isLoading: true })

    try {
      batchActions([
        dispatch(resetAreasOptions()),
        this.disableDrawing(),
        dispatch(setSearchType(SEARCH_BY_QUERY))
      ])

      await dispatch(getListingsByQuery(this.state.input, { limit: 200 }))
      this.setState({ isLoading: false })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    } finally {
      this.inputRef.current.blur()
    }
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
                  onKeyDown={this.handleKeyDownInput}
                  onFocus={this.handleInputFocus}
                  onBlur={this.handleInputBlur}
                  placeholder="Search location or MLS number"
                  onClear={this.onClear}
                  isLoading={this.state.isLoading}
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
                  </ListContainer>
                )}
              </div>
            )
          }}
        />
      </SearchContainer>
    )
  }
}

function mapStateToProps({ search }) {
  const { input, map, options, listings } = search

  return {
    searchInput: input,
    drawing: map.drawing,
    filterOptions: options,
    mapCenter: map.props.center,
    isFetching: listings.isFetching
  }
}

export default connect(mapStateToProps)(MlsAutocompleteSearch)
