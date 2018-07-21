import React from 'react'
import PropTypes from 'prop-types'

import _ from 'underscore'

import IconSearch from '../../SvgIcons/Search/IconSearch'
import { Container, TextInput, Icon } from './styled'

class Search extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    debounceTime: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    minimumLength: PropTypes.number,
    isSearching: PropTypes.bool,
    disableOnSearch: PropTypes.bool,
    showLoadingOnSearch: PropTypes.bool,
    inputRef: PropTypes.func
  }

  static defaultProps = {
    placeholder: '',
    debounceTime: 0,
    minimumLength: 0,
    isSearching: false,
    showLoadingOnSearch: false,
    disableOnSearch: true,
    inputRef: () => null
  }

  constructor(props) {
    super(props)

    const { onChange, debounceTime } = props

    this.onChangeHandler =
      debounceTime > 0 ? _.debounce(onChange, debounceTime) : onChange
  }

  handleChange = e => {
    const { value } = e.target
    const { minimumLength } = this.props

    if (value.length === 0 || value.length >= minimumLength) {
      this.onChangeHandler(value)
    }
  }

  render() {
    const {
      placeholder,
      style,
      isSearching,
      disableOnSearch,
      showLoadingOnSearch,
      inputRef
    } = this.props

    return (
      <Container style={style}>
        <Icon isSearching={isSearching}>
          {isSearching && showLoadingOnSearch ? (
            <i className="fa fa-spin fa-spinner" />
          ) : (
            <IconSearch color="#8da2b5" />
          )}
        </Icon>

        <TextInput
          placeholder={placeholder}
          onChange={this.handleChange}
          readOnly={isSearching && disableOnSearch === true}
          innerRef={ref => inputRef(ref)}
        />
      </Container>
    )
  }
}

export default Search
