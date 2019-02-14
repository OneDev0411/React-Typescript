import React from 'react'
import PropTypes from 'prop-types'

import _ from 'underscore'

import { Container, TextInput } from './styled'

class IconTextInput extends React.Component {
  constructor(props) {
    super(props)

    const { onChange, debounceTime, defaultValue } = props

    this.state = {
      value: defaultValue || '',
      isFocused: false
    }

    this.onChangeHandler =
      debounceTime > 0 ? _.debounce(onChange, debounceTime) : onChange
  }

  handleChange = e => {
    const { value } = e.target
    const { minimumLength } = this.props

    this.setState({
      value
    })

    if (value.length === 0 || value.length >= minimumLength) {
      this.onChangeHandler(value)
    }
  }

  onRef = ref => {
    if (!ref || !this.props.inputRef) {
      return false
    }

    // add a functionality to be able clear input outside of the form
    ref.clear = () => this.setState({ value: '' })

    this.props.inputRef(ref)
  }

  onBlur = () => this.setState({ isFocused: false })

  onFocus = () => this.setState({ isFocused: true })

  render() {
    const {
      placeholder,
      style,
      prefixElementRenderer,
      suffixElementRenderer
    } = this.props

    return (
      <Container style={style} isFocused={this.state.isFocused}>
        {prefixElementRenderer()}
        <TextInput
          value={this.state.value}
          placeholder={placeholder}
          onChange={this.handleChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          ref={this.onRef}
        />
        {suffixElementRenderer()}
      </Container>
    )
  }
}

IconTextInput.propTypes = {
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  debounceTime: PropTypes.number,
  minimumLength: PropTypes.number,
  prefixElementRenderer: PropTypes.func,
  suffixElementRenderer: PropTypes.func,
  onChange: PropTypes.func.isRequired
}

IconTextInput.defaultProps = {
  defaultValue: '',
  placeholder: '',
  debounceTime: 0,
  minimumLength: 0,
  prefixElementRenderer: () => null,
  suffixElementRenderer: () => null
}

export default IconTextInput
