import React from 'react'

import { getField } from 'models/Deal/helpers/context/get-field'
import { normalizeAddress } from 'models/Deal/helpers/normalize-address'

import { getGroupValues } from 'deals/FormEdit/utils/get-group-values'
import { getAnnotationsByType } from 'deals/FormEdit/utils/get-annotations-by-type'

import { AnnotationWrapper } from '../components/AnnotationWrapper'

import { AddressField } from './AddressField'

export function AddressInputs(props) {
  const handleAddressUpdate = address => {
    let fields = {}
    const contexts = {}

    const list = getAnnotationsByType(props.annotations, 'addresses')
    const addressFields = normalizeAddressFields(address)

    list.forEach(group => {
      const name = group[0].context

      if (!addressFields.hasOwnProperty(name)) {
        return
      }

      fields = {
        ...fields,
        ...getGroupValues(group, addressFields[name])
      }

      contexts[name] = addressFields[name]
    })

    props.onValueUpdate(fields, contexts)
  }

  return (
    <AnnotationWrapper
      items={props.annotations[props.pageIndex].addresses}
      values={props.values}
      render={inputProps => (
        <AddressField
          {...inputProps}
          deal={props.deal}
          onAddressUpdate={handleAddressUpdate}
        />
      )}
    />
  )
}

function normalizeAddressFields(address) {
  return Object.entries(address).reduce((addressFields, [name, item]) => {
    addressFields[name] = typeof item === 'object' ? item.value : item

    return addressFields
  }, normalizeAddress(address))
}
