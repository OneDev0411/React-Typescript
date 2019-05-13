import React from 'react'

import _ from 'underscore'

import { getField } from 'models/Deal/helpers/context/get-field'

import { AnnotationWrapper } from '../components/AnnotationWrapper'
import { getGroupValues } from '../../../utils/get-group-values'
import { getAnnotationsByType } from '../../../utils/get-annotations-by-type'

import AddressField from './AddressField'

export function AddressInputs(props) {
  const handleAddressUpdate = addressFields => {
    let fields = {}
    const list = getAnnotationsByType(props.annotations, 'addresses')

    list.forEach(group => {
      const name = group[0].context

      if (addressFields.hasOwnProperty(name) === false) {
        return false
      }

      fields = {
        ...fields,
        ...getGroupValues(group, addressFields[name])
      }
    })

    props.onValueUpdate(fields)
  }

  return (
    <AnnotationWrapper
      items={props.annotations[props.pageIndex].addresses}
      values={props.values}
      getValue={(name, annotation) =>
        !annotation.disableAutopopulate && getField(props.deal, name)
      }
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

// function getTooltip(context) {
//   if (context.isAddressField && context.isDealConnectedToMls) {
//     return (
//       <React.Fragment>
//         <img src="/static/images/deals/lock.svg" alt="locked" />
//         <div>
//           Listing information can only be changed on MLS. Once changed, the
//           update will be reflected here.
//         </div>
//       </React.Fragment>
//     )
//   }

//   return null
// }
