import React from 'react'
import PropTypes from 'prop-types'

import _ from 'underscore'

import IconClose from '../../SvgIcons/Close/CloseIcon'

import { Container, TextInput, Icon, IconSearch, IconButton } from './styled'

class Search extends React.Component {
  constructor(props) {
    super(props)

    const { onChange, debounceTime, defaultValue } = props

    this.state = {
      searchValue: defaultValue || ''
    }

    this.onChangeHandler =
      debounceTime > 0 ? _.debounce(onChange, debounceTime) : onChange
  }

  handleChange = e => {
    const { value } = e.target
    const { minimumLength } = this.props

    this.setState({
      searchValue: value
    })

    if (value.length === 0 || value.length >= minimumLength) {
      this.onChangeHandler(value)
    }
  }

  handleClearSearch = () => {
    this.setState({
      searchValue: ''
    })

    this.props.onClearSearch('')
  }

  render() {
    const {
      placeholder,
      style,
      isSearching,
      disableOnSearch,
      showLoadingOnSearch,
      showClearSearch,
      inputRef
    } = this.props

    return (
      <Container style={style}>
        <Icon isSearching={isSearching}>
          {isSearching && showLoadingOnSearch ? (
            <i className="fa fa-spin fa-spinner" />
          ) : (
            <IconSearch />
          )}
        </Icon>

        <TextInput
          value={this.state.searchValue}
          placeholder={placeholder}
          onChange={this.handleChange}
          innerRef={inputRef}
          readOnly={disableOnSearch && isSearching}
        />

        {showClearSearch &&
          this.state.searchValue.length > 0 && (
            <IconButton onClick={this.handleClearSearch}>
              <IconClose />
            </IconButton>
          )}
      </Container>
    )
  }
}

Search.propTypes = {
  placeholder: PropTypes.string,
  debounceTime: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  minimumLength: PropTypes.number,
  isSearching: PropTypes.bool,
  disableOnSearch: PropTypes.bool,
  showLoadingOnSearch: PropTypes.bool,
  showClearSearch: PropTypes.bool,
  onClearSearch: PropTypes.func
}

Search.defaultProps = {
  placeholder: '',
  debounceTime: 0,
  minimumLength: 0,
  isSearching: false,
  showLoadingOnSearch: false,
  disableOnSearch: true,
  showClearSearch: true,
  onClearSearch: () => null
}

export default Search
