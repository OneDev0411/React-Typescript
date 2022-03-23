import React, { CSSProperties, ReactNode } from 'react'

import _ from 'underscore'

import CircleSpinner from '../../SvgIcons/CircleSpinner/IconCircleSpinner'
import IconClose from '../../SvgIcons/Close/CloseIcon'

import {
  Container,
  ErrorMessage,
  Icon,
  IconButton,
  IconSearch,
  TextInput
} from './styled'

interface Props {
  onChange: (value) => any
  placeholder?: string
  debounceTime?: number
  minimumLength?: number
  isSearching?: boolean
  disableOnSearch?: boolean
  autoFocus?: boolean
  className?: string
  showLoadingOnSearch?: boolean
  showClearSearch?: boolean
  style?: CSSProperties
  onClearSearch?: (string) => any
  inputRef?: (ref: HTMLInputElement) => void
  errorMessage?: ReactNode
}

interface State {
  isFocused: boolean
  searchValue: string
}

class Search extends React.Component<Props, State> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    placeholder: '',
    className: '',
    debounceTime: 0,
    minimumLength: 0,
    isSearching: false,
    showLoadingOnSearch: false,
    style: {},
    disableOnSearch: true,
    showClearSearch: true,
    autoFocus: false
  }

  constructor(props) {
    super(props)

    const { onChange, autoFocus, debounceTime, defaultValue } = props

    this.state = {
      searchValue: defaultValue || '',
      isFocused: autoFocus
    }

    this.onChangeHandler =
      debounceTime > 0 ? _.debounce(onChange, debounceTime) : onChange
  }

  private onChangeHandler: any

  handleChange = e => {
    const { value } = e.target
    const { minimumLength = 0 } = this.props

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
      style,
      autoFocus,
      placeholder,
      isSearching,
      disableOnSearch,
      showLoadingOnSearch,
      showClearSearch,
      errorMessage
    } = this.props

    return (
      <>
        <Container
          style={style}
          isFocused={this.state.isFocused}
          className={this.props.className}
          hasError={!!errorMessage}
        >
          <Icon isSearching={isSearching}>
            {isSearching && showLoadingOnSearch ? (
              <CircleSpinner style={{ width: '24px', height: '24px' }} />
            ) : (
              <IconSearch hasError={!!errorMessage} />
            )}
          </Icon>

          <TextInput
            autoFocus={autoFocus}
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
        {errorMessage && (
          <ErrorMessage variant="body1">{errorMessage}</ErrorMessage>
        )}
      </>
    )
  }
}

export default Search
