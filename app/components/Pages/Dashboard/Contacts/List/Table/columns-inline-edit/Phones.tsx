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
      addLabel="Add Another Phone Number"
      contact={contact as unknown as IContactWithAssoc<'contact.attributes'>}
      callback={updateContact}
      validateRules={{
        text: (value: string) => isPhoneNumber(value)
      }}
    />
  )
}
