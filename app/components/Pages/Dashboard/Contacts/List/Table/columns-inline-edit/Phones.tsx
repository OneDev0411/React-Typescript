import { useCallback } from 'react'

import { isPhoneNumber } from '@app/utils/validations'

import { InlineEditAttributeCell } from './AttributeCell'
import { InlineEditColumnsProps as PhonesInlineEditProps } from './type'

export function PhonesInlineEdit({ contact, callback }: PhonesInlineEditProps) {
  const updateContact = useCallback(() => {
    callback?.(contact.id)
  }, [callback, contact.id])

  return (
    <InlineEditAttributeCell
      attributeName="phone_number"
      addLabel={
        (contact.phone_numbers || []).length >= 1
          ? 'Add Another Phone Number'
          : 'Add a Phone Number'
      }
      contact={contact}
      callback={updateContact}
      validateRules={{
        text: (value: string) => isPhoneNumber(value)
      }}
    />
  )
}
