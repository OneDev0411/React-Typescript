import React from 'react'

import _ from 'underscore'

import { getField } from 'models/Deal/helpers/context/get-field'

import { AnnotationWrapper } from '../components/AnnotationWrapper'
import { calculateWordWrap } from '../../../utils/word-wrap'

import AddressField from './AddressField'

export function AddressInputs(props) {
  const handleAddressUpdate = addressFields => {
    const valuesList = {}

    _.each(props.annotations, page => {
      _.each(page.addresses, (groups, name) => {
        if (addressFields.hasOwnProperty(name) === false) {
          return false
        }

        _.each(groups, group => {
          const annotations = group.map(item => item.annotation)

          const { values } = calculateWordWrap(
            annotations,
            addressFields[name],
            {
              maxFontSize: 20
            }
          )

          group.forEach((item, index) => {
            valuesList[item.annotation.fieldName] = values[index]
          })
        })
      })
    })

    props.onValueUpdate(valuesList)
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
