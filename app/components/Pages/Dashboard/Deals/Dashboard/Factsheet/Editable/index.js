import React from 'react'
import ClickOutside from 'react-click-outside'
import _ from 'underscore'

import Input from 'components/Input'

import { Editable as Container, ActionButton } from '../styled'

export default class Editable extends React.Component {
  state = {
    value: ''
  }

  onKeyPress(e) {
    if (e.which === 13 || e.keyCode === 13) {
      this.onClickSave()
    }
  }

  onClickSave = () => this.props.onClickSave(this.state.value)

  render() {
    const { field } = this.props

    return (
      <ClickOutside
        onClickOutside={this.props.onClickOutside}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Container>
          <Input
            data-type={field.format || field.data_type}
            {...field.properties}
            maxLength={15}
            defaultValue={this.props.defaultValue}
            value={this.state.value}
            placeholder={field.label}
            onKeyPress={this.onKeyPress}
            style={{
              width: '80%',
              border: 'none'
            }}
            onChange={(e, data = {}) =>
              this.setState({
                value: !_.isUndefined(data.value) ? data.value : e.target.value
              })
            }
          />

          <ActionButton onClick={this.onClickSave}>Save</ActionButton>
        </Container>
      </ClickOutside>
    )
  }
}
