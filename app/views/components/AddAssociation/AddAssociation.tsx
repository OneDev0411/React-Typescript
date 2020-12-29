import React from 'react'
import { useField } from 'react-final-form'

import { AddAssociationProps } from './types'
import { AddDealAssociation } from './AddDealAssociation'
import { AddContactAssociation } from './AddContactAssociation'
import { AddListingAssociation } from './AddListingAssociations'

interface Props {
  name?: string
  disabled: boolean
  isMultipleSelected?: boolean
  showTitle?: boolean
  isPrimary?: boolean

  // tooltip caption
  caption?: string

  type: 'contact' | 'deal' | 'listing'
}

export function AddAssociation({
  caption,
  disabled = false,
  showTitle = false,
  isPrimary = false,
  name = 'associations',
  type,
  isMultipleSelected
}: Props) {
  const field = useField(name)

  const onAdd = (associatedObjects, callback?: () => void) => {
    const associations = field.input.value
    const isDuplicate = object => {
      const { type } = object

      if (!type) {
        return true
      }

      return associations.some(
        association => association[type] && association[type].id === object.id
      )
    }

    let newAssociations

    if (Array.isArray(associatedObjects)) {
      newAssociations = associatedObjects.filter(
        listing => !isDuplicate(listing)
      )
    } else if (!isDuplicate(associatedObjects)) {
      newAssociations = [associatedObjects]
    }

    if (Array.isArray(newAssociations)) {
      field.input.onChange([
        ...associations,
        ...newAssociations.map(object => ({
          [object.type]: object,
          association_type: object.type
        }))
      ])

      if (callback) {
        callback()
      }
    }
  }

  const childProps: AddAssociationProps = {
    disabled,
    showTitle,
    isPrimary,
    handleAdd: onAdd,
    title: caption,
    isMultipleSelected
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
