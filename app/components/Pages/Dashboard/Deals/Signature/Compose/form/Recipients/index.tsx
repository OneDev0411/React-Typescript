import React from 'react'
import { useField } from 'react-final-form'

import {
  InputContainer,
  InputLabel,
  InputRequired
} from 'components/Forms/styled'

import { AddNewRecipient } from './AddRecipient'
import { RecipientsList } from './List'

interface Props {
  deal: IDeal
}

export function Recipients({ deal }: Props) {
  const field = useField('recipients')

  const handleAddRecipient = (recipient: IDealRole) => {
    if (field.input.value[recipient.id]) {
      return false
    }

    field.input.onChange({
      ...field.input.value,
      [recipient.id]: {
        ...recipient,
        order: 1,
        envelope_recipient_type: 'Signer'
      }
    })
  }

  return (
    <>
      <InputContainer>
        {Object.values(field.input.value || {}).length === 0 && (
          <InputLabel hasError={field.meta.submitFailed && field.meta.error}>
            To: &nbsp;
            <InputRequired>*</InputRequired>
          </InputLabel>
        )}
      </InputContainer>

      <RecipientsList />
      <AddNewRecipient
        deal={deal}
        selectedRoles={field.input.value}
        onAddRecipient={handleAddRecipient}
      />
    </>
  )
}
