import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

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
import IconButton from '../../../../../../../views/components/Button/IconButton'
import IconClose from '../../../../../../../views/components/SvgIcons/Close/CloseIcon'
import IconSearch from '../../../../../../../views/components/SvgIcons/Search/IconSearch'

import { Form, Input } from './styled'

const findPlace = address => dispatch => {
  if (!address) {
    return
  }

  if (/^\d{5}(?:[-\s]\d{4})?$/.test(address)) {
    dispatch(searchActions.searchByPostalCode(address))

    return
  }

  if (!isNaN(address) && address.length > 7) {
    dispatch(searchActions.searchByMlsNumber(address))

    return
  }

  dispatch(searchActions.getPlace(address))
}

let inputNode

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
    <IconSearch style={{ marginLeft: '1em', fill: '#7f7f7f' }} />
    <Input
      type="text"
      value={searchInput}
      disabled={isFetching}
      ref={node => (inputNode = node)}
      onFocus={onFocus}
      onChange={event =>
        dispatch(searchActions.setSearchInput(event.target.value))
      }
      placeholder="Search location or MLS#"
      className="c-mls-toolbar__search-box__field__input"
      style={{ paddingRight: searchInput === submitedValue && '39px' }}
    />

    {searchInput && (
      <IconButton
        isFit
        inverse
        iconSize="large"
        disabled={isFetching}
        onClick={onClear}
      >
        <IconClose />
      </IconButton>
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
        dispatch(removePolygon(drawing.shape))
        dispatch(inactiveDrawing())
      }
    }
  }),
  withHandlers({
    autoCompletePlaceChanged: ({ dispatch }) => address => {
      dispatch(resetAreasOptions())

      if (!address.formatted_address) {
        findPlace(address.name)(dispatch)

        return
      }

      const zoom = 16
      const center = {
        lat: address.geometry.location.lat(),
        lng: address.geometry.location.lng()
      }

      dispatch(goToPlace({ center, zoom }))
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
      autoCompletePlaceChanged
    }) => () => {
      if (!window.google) {
        return false
      }

      if (!inputNode) {
        return false
      }

      if (!autocompleteInstance) {
        const google = window.google
        const autocomplete = new google.maps.places.Autocomplete(inputNode)

        autocomplete.setComponentRestrictions({ country: ['us'] })

        const circle = new google.maps.Circle({
          center: mapCenter,
          radius: 500
        })

        autocomplete.setBounds(circle.getBounds())
        setAutocompleteInstance(autocomplete)

        autocomplete.addListener('place_changed', async () => {
          const address =
            autocomplete.getPlace().formatted_address ||
            autocomplete.getPlace().name

          updateSubmitedValue(address)
          dispatch(searchActions.setSearchInput(address))
          dispatch(setSearchType(SEARCH_BY_GOOGLE_SUGGESTS))
          dispatch(hideFilterArea())
          disableDrawing()
          autoCompletePlaceChanged(autocomplete.getPlace())
        })

        inputNode.addEventListener('keypress', formPreventDefaultHandler)
      }
    },
    onSubmit: ({
      dispatch,
      searchInput,
      disableDrawing,
      updateSubmitedValue
    }) => async event => {
      event.preventDefault()
      updateSubmitedValue(searchInput)
      dispatch(resetAreasOptions())
      dispatch(hideFilterArea())
      disableDrawing()
      findPlace(searchInput)(dispatch)
    },
    onClear: ({ dispatch }) => event => {
      event.preventDefault()
      dispatch(searchActions.setSearchInput(''))
      dispatch(resetSearchType())
    }
  })
)

export default fieldHOC(field)

function formPreventDefaultHandler(event) {
  if (event.keyCode === 13) {
    event.preventDefault()
  }
}
