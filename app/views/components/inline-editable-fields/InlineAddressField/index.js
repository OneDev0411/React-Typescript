import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import idx from 'idx'
import { Popover, Popper } from '@material-ui/core'

import { loadJS } from '../../../../utils/load-js'
import { bootstrapURLKeys } from '../../../../components/Pages/Dashboard/Listings/mapOptions'

import { Suggestions } from './Suggestions'
import { InlineAddressForm } from './InlineAddressForm'

const propTypes = {
  renderSearchField: PropTypes.func.isRequired,
  address: PropTypes.string,
  style: PropTypes.shape(),
  suggestionsStyle: PropTypes.shape(),
  formStyle: PropTypes.shape(),
  handleDelete: PropTypes.func,
  handleInputChange: PropTypes.func,
  showDeleteButton: PropTypes.bool,
  needsAddressForm: PropTypes.bool,
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
  showDeleteButton: false,
  needsAddressForm: true
}

export class InlineAddressField extends React.Component {
  state = {
    address: '',
    isShowSuggestion: false,
    isDirty: false,
    places: [],
    anchorEl: null,
    updateAddressFormPosition: false,
    // Because the blur default action should be canceled when the mouse is over
    // the suggestion area, and there is a possibility of selecting suggestion
    // items.
    isBlurDisabled: false,
    location: null
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.address && !state.isDirty && props.address !== state.address) {
      return { address: props.address, isDirty: true }
    }

    return null
  }

  componentDidMount() {
    if (!window.isLoadingGoogleApi && !idx(window, w => w.google.maps.places)) {
      window.isLoadingGoogleApi = true
      window.getLocation = this.getLocation

      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${
          bootstrapURLKeys.key
        }&libraries=places&callback=getLocation`
      )
    }
  }

  componentWillUnmount() {
    delete window.isLoadingGoogleApi
  }

  getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) =>
          this.setLocation(latitude, longitude),
        () => this.setDallasLocation()
      )
    } else {
      this.setDallasLocation()
    }
  }

  setDallasLocation = () => this.setLocation(32.7767, -96.797)

  setLocation = (lat, lng) =>
    this.setState({
      location: new window.google.maps.LatLng({
        lat,
        lng
      })
    })

  autocompleteAddress = input => {
    const { google } = window
    const { location } = this.state

    if (!location || !google) {
      return Promise.resolve([])
    }

    const service = new google.maps.places.AutocompleteService()

    let request = {
      input,
      componentRestrictions: { country: 'us' },
      location,
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

  search = debounce(async (anchorEl, value) => {
    if (value.length <= 3) {
      return
    }

    try {
      this.setState({
        isLoading: true,
        isShowForm: false,
        anchorEl: null,
        isShowSuggestion: false
      })

      const places = await this.autocompleteAddress(value)

      this.setState({
        anchorEl,
        places,
        isLoading: false,
        isShowSuggestion: true
      })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }, 300)

  handleChangeInput = ({ target }) => {
    const { value } = target

    this.setState(
      () => {
        if (value.length === 0) {
          return {
            address: value,
            isShowForm: false,
            isShowSuggestion: false,
            anchorEl: null
          }
        }

        return { address: value, isDirty: true }
      },
      () => {
        this.props.handleInputChange(value)
        this.search(target, value)
      }
    )
  }

  onClickSuggestionItem = item => {
    let newState = {
      address: item.description,
      isBlurDisabled: false,
      isShowForm: true,
      isShowSuggestion: false
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

      if (!this.props.needsAddressForm) {
        newState = {
          anchorEl: null,
          address: item.description
        }

        return this.setState(newState, () => {
          this.props.handleInputChange(place.formatted_address)
        })
      }

      this.setState(newState)
    })
  }

  onClickDefaultItem = () =>
    this.setState({
      isBlurDisabled: false,
      isShowForm: true,
      isShowSuggestion: false
    })

  handleClose = () => this.setState({ anchorEl: null })

  handleInputBlur = () => {
    if (this.state.isBlurDisabled) {
      return
    }

    if (this.state.isShowSuggestion) {
      this.setState({ isShowSuggestion: false })
    }
  }

  handleMouseOverSuggestions = isBlurDisabled =>
    this.setState({ isBlurDisabled })

  handleAddressFormPosition = () =>
    this.setState({ updateAddressFormPosition: true })

  render() {
    const { address, anchorEl } = this.state

    const isOpen = Boolean(anchorEl)
    const isOpenSuggestion = isOpen && this.state.isShowSuggestion
    const isOpenForm =
      isOpen && this.props.needsAddressForm && this.state.isShowForm
    const formId = isOpenForm ? 'address-form-popover' : undefined

    return (
      <div style={this.props.style}>
        {this.props.renderSearchField({
          id: formId,
          isLoading: this.state.isLoading,
          onChange: this.handleChangeInput,
          value: address,
          onBlur: this.handleInputBlur,
          autoComplete: 'disabled'
        })}
        <Popper
          anchorEl={anchorEl}
          open={isOpenSuggestion}
          placement="bottom-start"
          style={{ zIndex: 1002 }}
        >
          <Suggestions
            items={this.state.places}
            searchText={address}
            style={this.props.suggestionsStyle}
            onClickDefaultItem={this.onClickDefaultItem}
            onClickSuggestionItem={this.onClickSuggestionItem}
            handleMouseOver={this.handleMouseOverSuggestions}
          />
        </Popper>
        <Popover
          id={formId}
          open={isOpenForm}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          style={{ zIndex: 1002 }}
          action={actions => {
            if (
              this.state.updateAddressFormPosition &&
              actions &&
              actions.updatePosition
            ) {
              this.setState(
                { updateAddressFormPosition: false },
                actions.updatePosition
              )
            }
          }}
        >
          <InlineAddressForm
            address={address}
            style={this.props.formStyle}
            handleCancel={this.handleClose}
            handleDelete={this.props.handleDelete}
            handleSubmit={this.props.handleSubmit}
            preSaveFormat={this.props.preSaveFormat}
            postLoadFormat={this.props.postLoadFormat}
            showDeleteButton={this.props.showDeleteButton}
            updatePosition={this.handleAddressFormPosition}
          />
        </Popover>
      </div>
    )
  }
}

InlineAddressField.propTypes = propTypes
InlineAddressField.defaultProps = defaultProps
