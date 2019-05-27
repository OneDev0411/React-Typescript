import React, { RefObject } from 'react'

import _ from 'underscore'

import IconClose from '../../SvgIcons/Close/CloseIcon'

import { Container, Icon, IconButton, IconSearch, TextInput } from './styled'

interface Props {
  onChange: (value) => any
  placeholder?: string
  debounceTime?: number
  minimumLength?: number
  isSearching?: boolean
  disableOnSearch?: boolean
  className?: string
  showLoadingOnSearch?: boolean
  showClearSearch?: boolean
  onClearSearch?: (string) => any

  inputRef?: RefObject<HTMLInputElement>
}

interface State {
  isFocused: boolean
}

class Search extends React.Component<Props, State> {
  static defaultProps = {
    placeholder: '',
    className: '',
    debounceTime: 0,
    minimumLength: 0,
    isSearching: false,
    showLoadingOnSearch: false,
    disableOnSearch: true,
    showClearSearch: true
  }

  private onChangeHandler: any

  constructor(props) {
    super(props)

    const { onChange, debounceTime, defaultValue } = props

    this.state = {
      searchValue: defaultValue || '',
      isFocused: false
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
    const { onClearSearch } = this.props

    this.setState({
      searchValue: ''
    })

    if (onClearSearch) {
      onClearSearch('')
    } else {
      this.onChangeHandler('')
    }
  }

  onRef = ref => {
    if (!ref || !this.props.inputRef) {
      return false
    }

    // add a functionality to be able clear input outside of the form
    ref.clear = () => this.setState({ searchValue: '' })

    this.props.inputRef(ref)
  }

  onBlur = () => this.setState({ isFocused: false })

  onFocus = () => this.setState({ isFocused: true })

  render() {
    const {
      placeholder,
      style,
      isSearching,
      disableOnSearch,
      showLoadingOnSearch,
      showClearSearch
    } = this.props

    return (
      <Container style={style} isFocused={this.state.isFocused} className={this.props.className}>
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
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          ref={this.onRef}
          readOnly={disableOnSearch && isSearching}
        />

        {showClearSearch && this.state.searchValue.length > 0 && (
          <IconButton onClick={this.handleClearSearch}>
            <IconClose />
          </IconButton>
        )}
      </Container>
    )
  }
}

export default Search
