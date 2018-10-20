import React from 'react'

import {
  InputContainer,
  InputLabel,
  InputRequired,
  InputError
} from '../styled'
import { RecipientContainer } from './styled'

import AddRecipient from './AddRecipient'
import RecipientItem from './RecipientItem'

export const MultipleContactsSelect = ({
  input,
  hasLabel = true,
  showError = true,
  disableAddNewRecipient = false,
  meta,
  isRequired,
  placeholder,
  labelText
}) => (
  <InputContainer>
    {hasLabel && (
      <InputLabel hasError={meta.submitFailed && meta.error}>
        {labelText || placeholder}&nbsp;
        <InputRequired>{isRequired && '*'}</InputRequired>
      </InputLabel>
    )}

    <RecipientContainer>
      {(input.value || []).map((recipient, index) => (
        <RecipientItem key={index} recipient={recipient} input={input} />
      ))}

      {!disableAddNewRecipient && <AddRecipient input={input} />}
    </RecipientContainer>

    {showError &&
      meta.error &&
      meta.touched && <InputError>{meta.error}</InputError>}
  </InputContainer>
)
