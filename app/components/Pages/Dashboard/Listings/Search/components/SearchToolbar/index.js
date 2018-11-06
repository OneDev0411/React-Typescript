import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { batchActions } from 'redux-batched-actions'

import getPlace from '../../../../../../../models/listings/search/get-place'
import { getMapBoundsInCircle } from '../../../../../../../utils/get-coordinates-points/index.js'
import resetAreasOptions from '../../../../../../../store_actions/listings/search/reset-areas-options'
import { goToPlace } from '../../../../../../../store_actions/listings/map'
import searchActions from '../../../../../../../store_actions/listings/search'
import { SEARCH_BY_GOOGLE_SUGGESTS } from '../../../../../../../constants/listings/search'
import {
  removePolygon,
  inactiveDrawing
} from '../../../../../../../store_actions/listings/map/drawing'
import { hideFilterArea } from '../../../../../../../store_actions/listings/search/filters/toggle-filters-area'
import {
  reset as resetSearchType,
  setSearchType
} from '../../../../../../../store_actions/listings/search/set-type'
import IconClose from '../../../../../../../views/components/SvgIcons/Close/CloseIcon'
import { mapInitialState } from '../../../mapOptions'
import { Form, Input, ClearButton, SearchIcon } from './styled'

let inputNode = React.createRef()

const field = ({
  onFocus,
  onClear,
  onSubmit,
  dispatch,
  isFetching,
  searchInput,
  submitedValue
}) => (
  <Form method="post" onSubmit={onSubmit}>
    <SearchIcon />
    <Input
      type="text"
      value={searchInput}
      disabled={isFetching}
      ref={inputNode}
      onFocus={onFocus}
      onChange={event =>
        dispatch(searchActions.setSearchInput(event.target.value))
      }
      placeholder="Search location or MLS#"
      className="c-mls-toolbar__search-box__field__input"
      style={{ paddingRight: searchInput === submitedValue && '39px' }}
    />

    {searchInput && (
      <ClearButton
        isFit
        inverse
        iconSize="large"
        disabled={isFetching}
        onClick={onClear}
      >
        <IconClose />
      </ClearButton>
    )}
  </Form>
)

const fieldHOC = compose(
  connect(({ search }) => {
    const { input, map, options, listings } = search

    return {
      searchInput: input,
      drawing: map.drawing,
      filterOptions: options,
      mapCenter: map.props.center,
      isFetching: listings.isFetching
    }
  }),
  withState('submitedValue', 'updateSubmitedValue', ''),
  withState('autocompleteInstance', 'setAutocompleteInstance', ''),
  withHandlers({
    disableDrawing: ({ drawing, dispatch }) => () => {
      if (drawing.points.length > 2) {
        batchActions([
          dispatch(removePolygon(drawing.shape)),
          dispatch(inactiveDrawing())
        ])
      }
    }
  }),
  withHandlers({
    findPlace: ({ activeView, filterOptions, dispatch }) => async address => {
      if (!address) {
        return null
      }

      // if (address.match(/^\d{5}(?:[-\s]\d{4})?$/)) {
      //   return dispatch(searchActions.searchByPostalCode(address))
      // }

      if (address.length > 7 && address.match(/^\d+$/)) {
        return dispatch(searchActions.searchByMlsNumber(address))
      }

      if (activeView === 'map') {
        return dispatch(searchActions.getPlace(address))
      }

      const location = await getPlace(address)

      if (location) {
        batchActions([
          dispatch(
            searchActions.setSearchLocation({
              lat: address.geometry.location.lat(),
              lng: address.geometry.location.lng()
            }),
            dispatch(
              searchActions.getListings.byValert({
                ...filterOptions,
                limit: 50,
                points: getMapBoundsInCircle(location.center, 1)
              })
            )
          )
        ])
      }
    }
  }),
  withHandlers({
    autoCompletePlaceChangedHandler: ({
      findPlace,
      activeView,
      dispatch,
      filterOptions
    }) => async address => {
      dispatch(resetAreasOptions())

      if (!address.formatted_address) {
        return findPlace(address.name)
      }

      const center = {
        lat: address.geometry.location.lat(),
        lng: address.geometry.location.lng()
      }

      dispatch(searchActions.setSearchLocation(center))

      if (activeView === 'map') {
        const zoom = 16

        dispatch(goToPlace({ center, zoom }))
      } else {
        dispatch(
          searchActions.getListings.byValert({
            ...filterOptions,
            limit: 50,
            points: getMapBoundsInCircle(address.geometry.location, 1)
          })
        )
      }
    }
  }),
  withHandlers({
    onFocus: ({
      dispatch,
      mapCenter,
      disableDrawing,
      updateSubmitedValue,
      autocompleteInstance,
      setAutocompleteInstance,
      autoCompletePlaceChangedHandler
    }) => () => {
      if (!window.google) {
        return false
      }

      if (!inputNode || !inputNode.current) {
        return false
      }

      if (!autocompleteInstance) {
        const google = window.google
        const autocomplete = new google.maps.places.Autocomplete(
          inputNode.current
        )

        autocomplete.setComponentRestrictions({ country: ['us'] })

        const circle = new google.maps.Circle({
          center: mapCenter || mapInitialState.center,
          radius: 500
        })

        autocomplete.setBounds(circle.getBounds())
        setAutocompleteInstance(autocomplete)

        autocomplete.addListener('place_changed', async () => {
          const address =
            autocomplete.getPlace().formatted_address ||
            autocomplete.getPlace().name

          updateSubmitedValue(address)
          batchActions([
            dispatch(searchActions.setSearchInput(address)),
            dispatch(hideFilterArea()),
            disableDrawing(),
            dispatch(setSearchType(SEARCH_BY_GOOGLE_SUGGESTS))
          ])
          autoCompletePlaceChangedHandler(autocomplete.getPlace())
        })

        inputNode.current.addEventListener(
          'keypress',
          formPreventDefaultHandler
        )
      }
    },
    onSubmit: ({
      findPlace,
      dispatch,
      searchInput,
      disableDrawing,
      updateSubmitedValue
    }) => async event => {
      event.preventDefault()
      updateSubmitedValue(searchInput)
      batchActions([dispatch(resetAreasOptions()), dispatch(hideFilterArea())])
      disableDrawing()
      findPlace(searchInput)
    },
    onClear: ({ dispatch }) => event => {
      event.preventDefault()
      batchActions([
        dispatch(searchActions.setSearchInput('')),
        dispatch(resetSearchType())
      ])
    }
  })
)

export default fieldHOC(field)

function formPreventDefaultHandler(event) {
  if (event.keyCode === 13) {
    event.preventDefault()
  }
}
