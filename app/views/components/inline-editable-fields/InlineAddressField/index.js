import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import ClickOutside from 'react-click-outside'

import { loadJS } from '../../../../utils/load-js'
import { bootstrapURLKeys } from '../../../../components/Pages/Dashboard/Listings/mapOptions'

import { Suggestions } from './Suggestions'

const propTypes = {
  renderSearchField: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  style: PropTypes.shape()
}

const defaultTypes = {
  searchText: '',
  style: {}
}

export class InlineAddressField extends React.Component {
  state = {
    input: '',
    isShowSuggestion: false,
    // eslint-disable-next-line
    isDrity: false,
    isGoogleApiReady: false,
    places: []
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.input && !state.isDrity && props.searchText !== state.input) {
      return { input: props.searchText, isDrity: true }
    }

    return null
  }

  componentDidMount() {
    window.initInlineAddressField = this.initialize

    if (!window.google) {
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
            input,
            isShowForm: false,
            isShowSuggestion: false
          }
        }

        return { input, isDrity: true }
      },
      () => this.search(input)
    )
  }

  onClickSuggestionItem = item => {
    this.setState({
      input: item.description,
      isShowSuggestion: false,
      isShowForm: true
    })
  }

  handleInputFocus = () => {
    if (this.state.input && !this.state.isOpen) {
      if (this.state.places.length > 0) {
        this.setState({ isShowSuggestion: true })
      } else {
        this.search(this.state.input)
      }
    }
  }

  onClickDefaultItem = () =>
    this.setState({ isShowSuggestion: false, isShowForm: true })

  onClickOutside = () => this.setState({ isShowSuggestion: false })

  render() {
    if (!this.state.isGoogleApiReady) {
      return null
    }

    return (
      <ClickOutside onClickOutside={this.onClickOutside}>
        <div style={{ position: 'relative', ...this.props.style }}>
          {this.props.renderSearchField({
            isLoading: this.state.isLoading,
            onChange: this.handleChangeInput,
            onFocus: this.handleInputFocus,
            value: this.state.input
          })}
          {this.state.isShowSuggestion && (
            <Suggestions
              items={this.state.places}
              searchText={this.state.input}
              onClickDefaultItem={this.onClickDefaultItem}
              onClickSuggestionItem={this.onClickSuggestionItem}
            />
          )}
          {this.state.isShowForm && this.state.input}
        </div>
      </ClickOutside>
    )
  }
}

InlineAddressField.propTypes = propTypes
InlineAddressField.defaultTypes = defaultTypes
