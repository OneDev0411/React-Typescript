import React from 'react'
import ClickOutside from 'react-click-outside'
import _ from 'underscore'

import Input from 'components/Input'
import ActionButton from 'components/Button/ActionButton'
import CancelButton from 'components/Button/CancelButton'
import { Container, InputContainer, ActionsContainer } from './styled'

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

  onClose = () => {
    if (this.props.isSaving) {
      return false
    }

    this.position = null
    this.props.onClose()
  }

  onChange = (e, data = {}) => {
    const value =
      _.isUndefined(data.value) === false ? data.value : e.target.value

    this.props.onContextChange(value, data.maskedValue)
  }

  get Position() {
    if (this.position) {
      return this.position
    }

    const position = {
      left: this.props.bounds.left + window.scrollX,
      top: this.props.bounds.top + window.scrollY
    }

    this.position = position

    return this.position
  }

  saveDefaultValue = value => {
    this.props.onClose()
    this.props.onValueUpdate(this.props.contextName, value, true)
  }

  render() {
    if (!this.props.isOpen) {
      return false
    }

    const position = this.Position

    return (
      <ClickOutside onClickOutside={this.onClose}>
        <Container position={position}>
          <InputContainer>
            <Input
              data-type={
                this.props.context.format || this.props.context.data_type
              }
              {...this.props.context.properties}
              style={{
                width: '100%'
              }}
              maxLength={15}
              value={this.getValue()}
              onKeyPress={e => this.onKeyPress(e)}
              onChange={this.onChange}
            />
          </InputContainer>

          <ActionsContainer>
            <ActionButton
              onClick={this.props.handleSave}
              disabled={this.props.isSaving}
            >
              {this.props.isSaving ? 'Saving...' : 'Save Value'}
            </ActionButton>

            <CancelButton onClick={() => this.saveDefaultValue('TBD')}>
              TBD
            </CancelButton>
            <CancelButton onClick={() => this.saveDefaultValue('N/A')}>
              N/A
            </CancelButton>
          </ActionsContainer>
        </Container>
      </ClickOutside>
    )
  }
}
