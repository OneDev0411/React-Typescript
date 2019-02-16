import React from 'react'
import PropTypes from 'prop-types'

import _ from 'underscore'

import { Container, TextInput } from './styled'

class IconTextInput extends React.Component {
  constructor(props) {
    super(props)

    const { onChange, debounceTime } = props

    this.state = {
      isFocused: false
    }

    this.onChangeHandler =
      debounceTime > 0 ? _.debounce(onChange, debounceTime) : onChange
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.props.onEnterKeyPress()
    }
  }

  handleChange = e => {
    const { value } = e.target
    const { minimumLength } = this.props

    if (value.length === 0 || value.length >= minimumLength) {
      this.onChangeHandler(value)
    }
  }

  onBlur = () => this.setState({ isFocused: false })

  onFocus = () => this.setState({ isFocused: true })

  render() {
    const {
      value,
      placeholder,
      style,
      prefixElementRenderer,
      suffixElementRenderer
    } = this.props

    return (
      <Container style={style} isFocused={this.state.isFocused}>
        {prefixElementRenderer()}
        <TextInput
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onKeyPress={this.handleKeyPress}
        />
        {suffixElementRenderer()}
      </Container>
    )
  }
}

IconTextInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  debounceTime: PropTypes.number,
  minimumLength: PropTypes.number,
  prefixElementRenderer: PropTypes.func,
  suffixElementRenderer: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onEnterKeyPress: PropTypes.func
}

IconTextInput.defaultProps = {
  value: '',
  placeholder: '',
  debounceTime: 0,
  minimumLength: 0,
  prefixElementRenderer: () => null,
  suffixElementRenderer: () => null,
  onEnterKeyPress: () => null
}

export default IconTextInput
