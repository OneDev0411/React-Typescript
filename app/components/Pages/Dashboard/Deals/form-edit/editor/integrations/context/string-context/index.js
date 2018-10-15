import React from 'react'
import styled from 'styled-components'
import _ from 'underscore'

import Input from 'components/Input'

export const InputContainer = styled.div`
  width: 100%;
`

export default class StringContext extends React.Component {
  getValue() {
    const { value } = this.props

    return value !== null ? value : ''
  }

  onKeyPress(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.props.handleSave()
    }
  }

  onChange = (e, data = {}) => {
    const value =
      _.isUndefined(data.value) === false ? data.value : e.target.value

    this.props.onContextChange(value, data.maskedValue)
  }

  render() {
    return (
      <InputContainer>
        <InputContainer>
          <Input
            data-type={
              this.props.context.format || this.props.context.data_type
            }
            {...this.props.context.properties}
            style={{
              width: '100%'
            }}
            value={this.getValue()}
            onKeyPress={e => this.onKeyPress(e)}
            onChange={this.onChange}
          />
        </InputContainer>
      </InputContainer>
    )
  }
}
