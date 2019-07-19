import React from 'react'

import Flex, { FlexItem } from 'styled-flex-component'

import { InputContainer, InputLabel, InputRequired } from '../styled'
import { RecipientContainer } from './styled'

import AddRecipient from './AddRecipient'
import { RecipientItem } from './RecipientItem'
import { FieldError } from '../../final-form-fields/FieldError'

export const MultipleContactsSelect = ({
  input,
  hasLabel = true,
  showError = true,
  disableAddNewRecipient = false,
  suggestTagsAndLists = true,
  meta,
  isRequired,
  placeholder,
  labelText,
  labelExtra = null
}) => (
  <InputContainer>
    {hasLabel && (
      <Flex>
        <FlexItem grow={1}>
          <InputLabel hasError={meta.submitFailed && meta.error}>
            {/* TODO: handle breaking change of removing placeholder. replace all usages with labelText */}
            {labelText}
            &nbsp;
            <InputRequired>{isRequired && '*'}</InputRequired>
          </InputLabel>
        </FlexItem>
        {labelExtra}
      </Flex>
    )}

    <RecipientContainer>
      {(input.value || []).map((recipient, index) => (
        <RecipientItem key={index} recipient={recipient} input={input} />
      ))}

      {!disableAddNewRecipient && (
        <AddRecipient
          placeholder={placeholder}
          input={input}
          suggestTagsAndLists={suggestTagsAndLists}
        />
      )}
    </RecipientContainer>

    {showError && <FieldError name={input.name} />}
  </InputContainer>
)
