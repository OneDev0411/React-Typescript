import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Downshift from 'downshift'
import debounce from 'lodash/debounce'
import { batchActions } from 'redux-batched-actions'

import getPlace from '../../../../../../../models/listings/search/get-place'
import { searchListings } from '../../../../../../../models/listings/search/search-listings'
import { getMapBoundsInCircle } from '../../../../../../../utils/get-coordinates-points'
import { getBounds } from '../../../../../../../utils/map'
import resetAreasOptions from '../../../../../../../store_actions/listings/search/reset-areas-options'
import {
  goToPlace,
  setMapProps
} from '../../../../../../../store_actions/listings/map'
import searchActions from '../../../../../../../store_actions/listings/search'
import { SEARCH_BY_GOOGLE_SUGGESTS } from '../../../../../../../constants/listings/search'
import {
  removePolygon,
  inactiveDrawing
} from '../../../../../../../store_actions/listings/map/drawing'
import {
  reset as resetSearchType,
  setSearchType
} from '../../../../../../../store_actions/listings/search/set-type'
import IconClose from '../../../../../../../views/components/SvgIcons/Close/CloseIcon'
import Loading from '../../../../../../../views/components/SvgIcons/BubblesSpinner/IconBubblesSpinner'
import {
  getStatusColor,
  getListingAddressObj,
  getListingAddress
} from '../../../../../../../utils/listing'
import {
  ListContainer,
  Input,
  ListTitle,
  ClearButton,
  SearchIcon,
  Item,
  LoadingContainer
} from './styled'

class MlsAutocompleteSearch extends Component {
  state = {
    isOpen: false,
    isLoading: false,
    places: [],
    listings: [],
    input: '',
    // eslint-disable-next-line
    isDrity: false
  }

  static getDerivedStateFromProps(props, state) {
    if (props.drawing.points.length > 4) {
      return { input: '' }
    }

    if (!state.input && !state.isDrity && props.searchInput !== state.input) {
      return { input: props.searchInput }
    }

    return null
  }

  componentWillUnmount() {
    this.props.dispatch(searchActions.setSearchInput(this.state.input))
  }

  handleChangeInput = e => {
    const input = e.target.value

    this.setState(() => ({ input, isDrity: true }), () => this.search(input))
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
      // Dallas
      location: new google.maps.LatLng({
        lat: 32.7767,
        lng: -96.797
      }),
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
    if (input.length <= 3) {
      return
    }

    try {
      this.setState({ isLoading: true, isOpen: false })

      const [places, listings] = await Promise.all([
        this.autocompleteAddress(input),
        searchListings(input, { limit: 5 }, false)
      ])

      this.setState({
        isLoading: false,
        isOpen: true,
        places,
        listings: listings.data.slice(0, 5).map(l => ({
          ...l,
          description: getListingAddress(getListingAddressObj(l))
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

  renderPlacesItem = item => (
    <React.Fragment>
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
    </React.Fragment>
  )

  renderListingItem = item => (
    <React.Fragment>
      <span className="item__query">
        <span className="item__matched">{item.description}</span>
        <span style={{ color: `#${getStatusColor(item.status)}` }}>
          {' '}
          {item.status}
        </span>
      </span>
    </React.Fragment>
  )

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <SearchIcon />
        <Downshift
          isOpen={this.state.isOpen}
          onSelect={this.handleSelectedItem}
          itemToString={this.handleItemToString}
          onOuterClick={this.handleClose}
          render={props => {
            const { getItemProps, isOpen, highlightedIndex } = props

            return (
              <div>
                <Input
                  value={this.state.input}
                  onChange={this.handleChangeInput}
                  onFocus={this.handleInputFocus}
                  placeholder="Search location or MLS#"
                />
                {isOpen && (
                  <ListContainer
                    style={{
                      padding: '0 0.75rem'
                    }}
                  >
                    {this.state.listings.length > 0 && (
                      <div
                        style={{
                          marginBottom: '1rem'
                        }}
                      >
                        <ListTitle>Listings</ListTitle>
                        {this.state.listings.map((item, index) => (
                          <Item
                            key={item.id}
                            {...getItemProps({
                              item,
                              isHighlighted: highlightedIndex === index
                            })}
                          >
                            {this.renderListingItem(item)}
                          </Item>
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

        {!this.state.isLoading && this.state.input && (
          <ClearButton isFit inverse iconSize="large" onClick={this.onClear}>
            <IconClose />
          </ClearButton>
        )}

        {this.state.isLoading && (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )}
      </div>
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
