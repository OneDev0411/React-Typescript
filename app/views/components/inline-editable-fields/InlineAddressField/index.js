import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import idx from 'idx'
import Popover from '@material-ui/core/Popover'

import { loadJS } from '../../../../utils/load-js'
import { bootstrapURLKeys } from '../../../../components/Pages/Dashboard/Listings/mapOptions'

import { Suggestions } from './Suggestions'
import { InlineAddressForm } from './InlineAddressForm'

const POP_OVER_PROPS = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left'
  }
}

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
    isDrity: false,
    places: [],
    anchorEl: null,
    updateAddressFormPosition: false
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.address && !state.isDrity && props.address !== state.address) {
      return { address: props.address, isDrity: true }
    }

    return null
  }

  componentDidMount() {
    if (!window.isLoadingGoogleApi && !idx(window, w => w.google.maps.places)) {
      window.isLoadingGoogleApi = true

      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${
          bootstrapURLKeys.key
        }&libraries=places`
      )
    }
  }

  componentWillUnmount() {
    delete window.isLoadingGoogleApi
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

        return { address: value, isDrity: true }
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
      isShowSuggestion: false,
      isShowForm: true
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
          isShowSuggestion: false,
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
      isShowSuggestion: false,
      isShowForm: true
    })

  handleClose = () => this.setState({ anchorEl: null })

  handleAddressFormPosition = () =>
    this.setState({ updateAddressFormPosition: true })

  render() {
    const { address, anchorEl } = this.state

    const isOpen = Boolean(anchorEl)
    const isOpenSuggestion = isOpen && this.state.isShowSuggestion
    const isOpenForm =
      isOpen && this.props.needsAddressForm && this.state.isShowForm
    const formId = isOpenForm ? 'address-form-popover' : undefined
    const suggestonsId = isOpenSuggestion
      ? 'google-address-suggestons-popover'
      : undefined

    return (
      <div style={this.props.style}>
        {this.props.renderSearchField({
          id: suggestonsId || formId,
          isLoading: this.state.isLoading,
          onChange: this.handleChangeInput,
          value: address,
          autoComplete: 'disabled'
        })}
        <Popover
          id={suggestonsId}
          open={isOpenSuggestion}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          {...POP_OVER_PROPS}
        >
          <Suggestions
            style={this.props.suggestionsStyle}
            items={this.state.places}
            searchText={address}
            onClickDefaultItem={this.onClickDefaultItem}
            onClickSuggestionItem={this.onClickSuggestionItem}
          />
        </Popover>
        <Popover
          {...POP_OVER_PROPS}
          id={formId}
          open={isOpenForm}
          anchorEl={anchorEl}
          onClose={this.handleClose}
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
            style={this.props.formStyle}
            address={address}
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
