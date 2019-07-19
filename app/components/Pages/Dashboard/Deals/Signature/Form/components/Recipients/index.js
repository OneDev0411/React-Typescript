import React from 'react'
import _ from 'underscore'

import {
  InputContainer,
  InputLabel,
  InputRequired
} from 'components/Forms/styled'

import { FieldError } from 'components/final-form-fields/FieldError'

import { AddRecipient } from './AddRecipient'
import { RecipientsList } from './List'

export class Recipients extends React.Component {
  onAddRecipient = recipient => {
    if (this.props.input.value[recipient.id]) {
      return false
    }

    this.props.input.onChange({
      ...this.props.input.value,
      [recipient.id]: {
        ...recipient,
        order: this.MaxOrder + 1,
        envelope_recipient_type: 'Signer'
      }
    })
  }

  handleChangeRecipientOrder = (role, order) =>
    this.props.input.onChange({
      ...this.props.input.value,
      [role.id]: {
        ...role,
        order
      }
    })

  handleChangeRecipientType = (role, type) => {
    this.props.input.onChange({
      ...this.props.input.value,
      [role.id]: {
        ...role,
        envelope_recipient_type: type
      }
    })
  }

  handleRemoveRecipient = role => {
    this.props.input.onChange(
      _.omit(this.props.input.value, recp => recp.id === role.id)
    )
  }

  get MaxOrder() {
    let max = 0

    _.each(this.props.input.value, role => {
      max = role.order ? Math.max(max, role.order) : max
    })

    return max
  }

  render() {
    const { props } = this

    return (
      <InputContainer>
        {_.size(props.input.value) === 0 && (
          <InputLabel hasError={props.meta.submitFailed && props.meta.error}>
            {props.labelText || props.placeholder}
            &nbsp;
            <InputRequired>*</InputRequired>
          </InputLabel>
        )}

        <RecipientsList
          items={props.input.value}
          onChangeRecipientOrder={this.handleChangeRecipientOrder}
          onChangeRecipientType={this.handleChangeRecipientType}
          onRemoveRecipient={this.handleRemoveRecipient}
        />

        <AddRecipient
          deal={props.deal}
          onAddRecipient={this.onAddRecipient}
          selectedRoles={props.input.value}
        />

        <FieldError name={props.input.name} />
      </InputContainer>
    )
  }
}
