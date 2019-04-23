import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import ClickOutside from 'react-click-outside'
import idx from 'idx'

import { loadJS } from '../../../../utils/load-js'
import { bootstrapURLKeys } from '../../../../components/Pages/Dashboard/Listings/mapOptions'

import { Suggestions } from './Suggestions'
import { InlineAddressForm } from './InlineAddressForm'

const propTypes = {
  renderSearchField: PropTypes.func.isRequired,
  address: PropTypes.string,
  style: PropTypes.shape(),
  handleDelete: PropTypes.func,
  handleInputChange: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  needsAddressForm: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  preSaveFormat: PropTypes.func.isRequired,
  postLoadFormat: PropTypes.func.isRequired
}

const defaultTypes = {
  address: '',
  style: {},
  handleDelete() {},
  handleInputChange() {},
  showDeleteButton: false,
  needsAddressForm: true
}

export class InlineAddressField extends React.Component {
  state = {
    address: '',
    isShowSuggestion: false,
    // eslint-disable-next-line
    isDrity: false,
    isGoogleApiReady: false,
    places: []
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.address && !state.isDrity && props.address !== state.address) {
      return { address: props.address, isDrity: true }
    }

    return null
  }

  componentDidMount() {
    window.initInlineAddressField = this.initialize

    if (!idx(window, w => w.google.maps.places)) {
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${
          bootstrapURLKeys.key
        }&libraries=places&callback=initInlineAddressField`
      )
    } else {
      this.initialize()
    }
  }

  componentWillUnmount() {
    delete window.initInlineAddressField
  }

  initialize = () => this.setState({ isGoogleApiReady: true })

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
      this.setState({
        isLoading: true,
        isShowForm: false,
        isShowSuggestion: false
      })

      const places = await this.autocompleteAddress(input)

      this.setState({
        places,
        isLoading: false,
        isShowSuggestion: true
      })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }, 300)

  handleChangeInput = e => {
    const input = e.target.value

    this.setState(
      () => {
        if (input.length === 0) {
          return {
            address: input,
            isShowForm: false,
            isShowSuggestion: false
          }
        }

        return { address: input, isDrity: true }
      },
      () => {
        this.props.handleInputChange(input)
        this.search(input)
      }
    )
  }

  onClickSuggestionItem = item => {
    let newState = {
      address: item.description,
      isShowSuggestion: false,
      isShowForm: this.props.needsAddressForm
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

  handleInputFocus = () => {
    if (
      this.state.address &&
      !this.state.isShowSuggestion &&
      this.state.address !== this.props.address
    ) {
      if (this.state.places.length > 0) {
        this.setState({ isShowSuggestion: true })
      } else {
        this.search(this.state.address)
      }
    }
  }

  onClickDefaultItem = () =>
    this.setState({
      isShowSuggestion: false,
      isShowForm: this.props.needsAddressForm
    })

  onClickOutside = () => this.setState({ isShowSuggestion: false })

  handleFormCancel = () => this.setState({ isShowForm: false })

  render() {
    if (!this.state.isGoogleApiReady) {
      return null
    }

    const { address } = this.state

    return (
      <ClickOutside onClickOutside={this.onClickOutside}>
        <div style={{ position: 'relative', ...this.props.style }}>
          {this.props.renderSearchField({
            isLoading: this.state.isLoading,
            onChange: this.handleChangeInput,
            onFocus: this.handleInputFocus,
            value: address
          })}
          {this.state.isShowSuggestion && (
            <Suggestions
              items={this.state.places}
              searchText={address}
              onClickDefaultItem={this.onClickDefaultItem}
              onClickSuggestionItem={this.onClickSuggestionItem}
            />
          )}

          {this.state.isShowForm && (
            <InlineAddressForm
              address={address}
              handleCancel={this.handleFormCancel}
              handleDelete={this.props.handleDelete}
              handleSubmit={this.props.handleSubmit}
              preSaveFormat={this.props.preSaveFormat}
              postLoadFormat={this.props.postLoadFormat}
              showDeleteButton={this.props.showDeleteButton}
            />
          )}
        </div>
      </ClickOutside>
    )
  }
}

InlineAddressField.propTypes = propTypes
InlineAddressField.defaultTypes = defaultTypes
