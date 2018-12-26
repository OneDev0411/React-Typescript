import React from 'react'
import PropTypes from 'prop-types'

import {
  InputContainer,
  InputError,
  InputRequired,
  InputLabel
} from '../styled'
import { InputField } from './styled'

export class TextArea extends React.Component {
  state = {
    rows: 2,
    height: this.props.minHeight
  }

  onHeightChangeHandler = height => this.setState({ height: height + 5 })

  render() {
    const { meta, Container = InputContainer } = this.props

    return (
      <Container>
        {this.props.hasLabel && (
          <InputLabel hasError={meta.submitFailed && meta.error}>
            {this.props.labelText || this.props.placeholder}
            &nbsp;
            <InputRequired>{this.props.isRequired && '*'}</InputRequired>
          </InputLabel>
        )}

        <InputField
          {...this.props.input}
          placeholder={this.props.placeholder}
          hasError={
            this.props.highlightOnError && meta.submitFailed && meta.error
          }
          rows={this.state.rows}
          maxRows={this.props.maxRows}
          style={{
            width: '100%',
            height: `${this.state.height}px`
          }}
          onHeightChange={this.onHeightChangeHandler}
          {...this.props.rest}
        />

        {this.props.showError &&
          meta.error &&
          meta.touched && <InputError>{meta.error}</InputError>}
      </Container>
    )
  }
}

TextArea.propTypes = {
  minHeight: PropTypes.number,
  maxRows: PropTypes.number,
  hasLabel: PropTypes.bool,
  showError: PropTypes.bool,
  highlightOnError: PropTypes.bool
}

TextArea.defaultProps = {
  minHeight: 40,
  maxRows: 1000,
  hasLabel: true,
  showError: true,
  highlightOnError: false
}
