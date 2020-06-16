import React from 'react'
import { useField } from 'react-final-form'

import { AddAssociationProps } from './types'
import { AddDealAssociation } from './AddDealAssociation'
import { AddContactAssociation } from './AddContactAssociation'
import { AddListingAssociation } from './AddListingAssociations'

interface Props {
  name?: string
  disabled: boolean

  // tooltip caption
  caption?: string

  type: 'contact' | 'deal' | 'listing'
}

export function AddAssociation({
  caption,
  disabled = false,
  name = 'associations',
  type
}: Props) {
  const field = useField(name)

  const onAdd = (associatedObject, handleClose: () => void) => {
    const { type } = associatedObject
    const associations = field.input.value

    if (!type) {
      return
    }

    const isDuplicate = associations.some(
      association =>
        association[type] && association[type].id === associatedObject.id
    )

    if (!isDuplicate) {
      field.input.onChange([
        ...associations,
        {
          [type]: associatedObject,
          association_type: type
        }
      ])
      handleClose()
    }
  }

  const childProps: AddAssociationProps = {
    disabled,
    handleAdd: onAdd,
    title: caption
  }

  switch (type) {
    case 'contact':
      return <AddContactAssociation {...childProps} />

    case 'deal':
      return <AddDealAssociation {...childProps} />

    case 'listing':
      return <AddListingAssociation {...childProps} />

    default:
      return null
  }
}
