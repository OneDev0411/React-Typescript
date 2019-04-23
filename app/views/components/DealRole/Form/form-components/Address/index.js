import React from 'react'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'
import { Input } from 'components/inline-editable-fields/styled'

import {
  InputContainer,
  InputError,
  InputRequired,
  InputLabel
} from 'components/Forms/styled'

import { postLoadFormat } from '../../../../../../components/Pages/Dashboard/Contacts/Profile/Addresses/AddressField/helpers/post-load-format'

export function Address(props) {
  return (
    <InputContainer style={props.style}>
      <InputLabel hasError={props.meta.submitFailed && props.meta.error}>
        {props.label}
        &nbsp;
        <InputRequired>{props.isRequired && '*'}</InputRequired>
      </InputLabel>

      <InlineAddressField
        address={props.value}
        needsAddressForm={false}
        handleSubmit={props.input.onChange}
        preSaveFormat={x => {
          console.log(x)

          return x
        }}
        postLoadFormat={postLoadFormat}
        handleInputChange={props.input.onChange}
        renderSearchField={inputProps => (
          <Input
            {...inputProps}
            type="text"
            autoFocus
            style={{
              padding: 0,
              border: 'none'
            }}
          />
        )}
      />

      {props.showError && props.meta.error && props.meta.touched && (
        <InputError>{props.meta.error}</InputError>
      )}
    </InputContainer>
  )
}
