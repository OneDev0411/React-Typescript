import React from 'react'

import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'

import {
  loadMapLibraries,
  isMapLibrariesLoaded
} from '@app/utils/google-map-api'

import { bootstrapURLKeys } from '../../../../components/Pages/Dashboard/MLS/constants'
import { TEXAS_LOCATION } from '../../../../constants/listings/defaults'

import { AddressPopover } from './AddressPopover'
import { SuggestionsPopover } from './SuggestionsPopover'

const propTypes = {
  renderSearchField: PropTypes.func.isRequired,
  address: PropTypes.string,
  style: PropTypes.shape(),
  suggestionsStyle: PropTypes.shape(),
  formStyle: PropTypes.shape(),
  handleDelete: PropTypes.func,
  handleInputChange: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  handleSubmit: PropTypes.func,
  preSaveFormat: PropTypes.func,
  postLoadFormat: PropTypes.func
}

const defaultProps = {
  address: '',
  style: {},
  suggestionsStyle: {},
  formStyle: {},
  handleDelete() {},
  handleInputChange() {},
  showDeleteButton: false
}

export class InlineAddressField extends React.Component {
  state = {
    address: '',
    isSuggestionsOpen: false,
    isAddressFormOpen: false,
    isDirty: false,
    places: [],
    // Because the blur default action should be canceled when the mouse is over
    // the suggestion area, and there is a possibility of selecting suggestion
    // items.
    isBlurDisabled: false
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.address && !state.isDirty && props.address !== state.address) {
      return { address: props.address, isDirty: true }
    }

    if (
      !state.isDirty &&
      state.address &&
      props.address &&
      props.address !== state.address
    ) {
      return { address: props.address }
    }

    return null
  }

  componentDidMount() {
    const googleMapAPIParams = {
      key: bootstrapURLKeys.key,
      libraries: ['places']
    }

    // Load google maps places if is not loaded yet
    if (
      !window.isLoadingGoogleApi &&
      !isMapLibrariesLoaded(googleMapAPIParams.libraries)
    ) {
      window.isLoadingGoogleApi = true
      loadMapLibraries(googleMapAPIParams)
    }
  }

  componentWillUnmount() {
    delete window.isLoadingGoogleApi
  }

  autocompleteAddress = input => {
    const { google } = window

    if (!google) {
      return Promise.resolve([])
    }

    const service = new google.maps.places.AutocompleteService()

    let request = {
      input,
      componentRestrictions: { country: 'us' },
      location: new window.google.maps.LatLng(TEXAS_LOCATION),
      radius: 800000000 // in meters
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

  search = debounce(async value => {
    if (value.length <= 3 || this.state.isAddressFormOpen) {
      return
    }

    try {
      this.setState({
        isLoading: true,
        isAddressFormOpen: false,
        isSuggestionsOpen: false
      })

      const places = await this.autocompleteAddress(value)

      this.setState({
        places,
        isLoading: false,
        isSuggestionsOpen: true
      })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }, 300)

  handleInputOnChange = ({ target: { value } }) => {
    this.setState(
      state => {
        if (value.length === 0) {
          return {
            address: value,
            isAddressFormOpen: false,
            isSuggestionsOpen: false
          }
        }

        if (value === state.address) {
          return
        }

        return { address: value, isDirty: true }
      },
      () => {
        this.props.handleInputChange(value)
        this.search(value)
      }
    )
  }

  handleInputOnKeyDown = ({ key }) => {
    this.setState(
      state => {
        if (key === 'Enter' && state.address.length > 0) {
          return {
            isAddressFormOpen: true,
            isSuggestionsOpen: false
          }
        }
      },
      () => {
        this.props.handleInputChange(this.state.address)
      }
    )
  }

  onClickSuggestionItem = item => {
    let newState = {
      address: item.description,
      isBlurDisabled: false,
      isAddressFormOpen: true,
      isSuggestionsOpen: false
    }

    const request = {
      placeId: item.place_id,
      fields: ['name', 'formatted_address', 'place_id', 'geometry']
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    )

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        newState = {
          ...newState,
          address: place.formatted_address
        }
      }

      this.setState(newState)
    })
  }

  onClickDefaultItem = () =>
    this.setState({
      isBlurDisabled: false,
      isAddressFormOpen: true,
      isSuggestionsOpen: false
    })

  handleInputBlur = () => {
    if (this.state.isBlurDisabled) {
      return
    }

    if (this.state.isSuggestionsOpen) {
      this.setState({ isSuggestionsOpen: false })
    }
  }

  handleMouseOverSuggestions = isBlurDisabled =>
    this.setState({ isBlurDisabled })

  handleClose = () => {
    this.setState({
      isDirty: false,
      isAddressFormOpen: false,
      isSuggestionsOpen: false
    })
  }

  render() {
    const address = this.state.address

    return (
      <div style={this.props.style}>
        {this.props.renderSearchField({
          isLoading: this.state.isLoading,
          onChange: this.handleInputOnChange,
          onKeyDown: this.handleInputOnKeyDown,
          value: address,
          onBlur: this.handleInputBlur,
          autoComplete: 'disabled'
        })}

        <SuggestionsPopover
          isOpen={this.state.isSuggestionsOpen}
          address={address}
          style={this.props.suggestionsStyle}
          places={this.state.places}
          onClickDefaultItem={this.onClickDefaultItem}
          onClickSuggestionItem={this.onClickSuggestionItem}
          onMouseOverSuggestion={this.handleMouseOverSuggestions}
        />

        <AddressPopover
          isOpen={this.state.isAddressFormOpen}
          address={address}
          formStyle={this.props.formStyle}
          showDeleteButton={this.props.showDeleteButton}
          preSaveFormat={this.props.preSaveFormat}
          postLoadFormat={this.props.postLoadFormat}
          onDelete={this.props.handleDelete}
          onSubmit={this.props.handleSubmit}
          onClose={this.handleClose}
        />
      </div>
    )
  }
}

InlineAddressField.propTypes = propTypes
InlineAddressField.defaultProps = defaultProps
