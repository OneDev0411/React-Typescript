import React from 'react'
import { connect } from 'react-redux'
import pure from 'recompose/pure'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import searchActions from
  '../../../../../../../store_actions/listings/search'
import * as mapActions from
  '../../../../../../../store_actions/listings/map'

const actions = {
  ...mapActions,
  ...searchActions
}

const findPlace = address => (dispatch) => {
  if (!address) {
    return
  }

  if (/^\d{5}(?:[-\s]\d{4})?$/.test(address)) {
    console.log('click search: post code', address)
    dispatch(actions.getPlace(address))
    return
  }

  if (!isNaN(address) && address.length > 7) {
    console.log('click search: MLS Number', address)
    dispatch(actions.searchByMlsNumber(address))
    return
  }

  console.log('click search: place', address)
  dispatch(actions.getPlace(address))
}

const autoCompletePlaceChanged = address => (dispatch) => {
  if (!address.formatted_address) {
    console.log('unformated')
    findPlace(address.name)(dispatch)
    return
  }

  const zoom = 16
  const center = {
    lat: address.geometry.location.lat(),
    lng: address.geometry.location.lng()
  }

  dispatch(actions.goToPlace({ center, zoom }))
}

let inputNode

const field = ({
  value,
  onClear,
  onClick,
  onFocus,
  onChange,
  submitedValue
}) => (
  <form
    method="post"
    className="c-mls-toolbar__search-box__field"
  >
    <input
      type="text"
      value={value}
      onFocus={onFocus}
      onChange={onChange}
      ref={node => inputNode = node}
      placeholder="Search location or MLS#"
      className="c-mls-toolbar__search-box__field__input"
      style={{ paddingRight: value === submitedValue && '39px' }}
    />
    <span className="c-mls-toolbar__search-box__field-buttons">
      {
        value !== submitedValue && <button
          onClick={onClick}
          className="c-mls-toolbar__search-box__field__submit-btn"
        >
          <svg fill="#aaa" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.411,21.595 C21.262,21.745 21.068,21.820 20.872,21.820 C20.677,21.820 20.481,21.745 20.331,21.595 L15.399,16.646 C13.847,17.958 11.847,18.753 9.664,18.753 C4.747,18.753 0.748,14.740 0.748,9.808 C0.748,4.876 4.747,0.864 9.664,0.864 C14.579,0.864 18.578,4.876 18.578,9.808 C18.578,11.999 17.787,14.005 16.479,15.562 L21.411,20.511 C21.711,20.810 21.711,21.295 21.411,21.595 ZM9.664,2.397 C5.590,2.397 2.277,5.722 2.277,9.808 C2.277,13.895 5.590,17.220 9.664,17.220 C13.736,17.220 17.051,13.895 17.051,9.808 C17.051,5.722 13.736,2.397 9.664,2.397 Z" />
          </svg>
        </button>
      }
      {
        value && <button
          onClick={onClear}
          className="c-mls-toolbar__search-box__field__clear-btn"
        >
          <svg fill="#aaa" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>
      }
    </span>
  </form>
)

const fieldHOC = compose(
  pure,
  connect(
    ({ search }) => ({
      center: search.map.props.center
    })
  ),
  withState(
    'value',
    'updateValue',
    ''
  ),
  withState(
    'autocompleteInstance',
    'setAutocompleteInstance',
    ''
  ),
  withState(
    'submitedValue',
    'updateSubmitedValue',
    ''
  ),
  // describe events
  withHandlers({
    onFocus: ({
      center,
      dispatch,
      updateValue,
      updateSubmitedValue,
      autocompleteInstance,
      setAutocompleteInstance
    }) => ({ target }) => {
      if (!window.google) {
        console.log('google api is not loaded')
        return false
      }

      if (!inputNode) {
        console.log('google search input is undefined')
        return false
      }

      if (!autocompleteInstance) {
        const google = window.google
        const autocomplete = new google.maps
          .places.Autocomplete(inputNode)

        const circle = new google.maps.Circle({
          center,
          radius: 500
        })

        autocomplete.setBounds(circle.getBounds())
        setAutocompleteInstance(autocomplete)

        autocomplete.addListener('place_changed', () => {
          updateValue(inputNode.value)
          updateSubmitedValue(inputNode.value)
          autoCompletePlaceChanged(autocomplete.getPlace())(dispatch)
        })

        inputNode.addEventListener('keypress', formPreventDefaultHandler)
      }
    },
    onChange: ({ updateValue, value }) => (event) => {
      updateValue(event.target.value)
    },
    onClear: ({ updateValue }) => (event) => {
      event.preventDefault()
      updateValue('')
    },
    onClick: ({
      value,
      dispatch,
      updateSubmitedValue
    }) => (event) => {
      updateSubmitedValue(value)
      findPlace(value)(dispatch)
    }
  })
)

export default fieldHOC(field)

function formPreventDefaultHandler(event) {
  if (event.keyCode === 13) {
    event.preventDefault()
  }
}