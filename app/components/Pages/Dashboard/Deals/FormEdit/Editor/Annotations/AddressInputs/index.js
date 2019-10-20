import React from 'react'

import { normalizeAddress } from 'models/Deal/helpers/normalize-address'

import { getGroupValues } from 'deals/FormEdit/utils/get-group-values'
import { getAnnotationsByType } from 'deals/FormEdit/utils/get-annotations-by-type'

import { AnnotationWrapper } from '../components/AnnotationWrapper'

import { AddressField } from './AddressField'

export function AddressInputs(props) {
  const handleAddressUpdate = address => {
    const list = getAnnotationsByType(props.annotations, 'addresses')
    const addressFields = normalizeAddress(address)

    const fields = list.reduce((acc, group) => {
      const name = group[0].context

      if (!addressFields.hasOwnProperty(name)) {
        return acc
      }

      return {
        ...acc,
        ...getGroupValues(group, addressFields[name])
      }
    }, {})

    props.onValueUpdate(fields, addressFields)
  }

  return (
    <AnnotationWrapper
      items={props.annotations[props.pageIndex].addresses}
      values={props.values}
      render={inputProps => (
        <AddressField
          {...inputProps}
          formValues={props.values}
          annotations={props.annotations}
          deal={props.deal}
          onAddressUpdate={handleAddressUpdate}
        />
      )}
    />
  )
}
