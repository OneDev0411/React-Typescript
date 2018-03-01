// import { addNotification as notify } from 'reapop'
import { addNewAttributes, updateContact } from '../'

export function upsertContactAttributes({ contactId, attributes }) {
  const updates = attributes.filter(attr => attr.id)
  const inserts = attributes.filter(attr => !attr.id)

  return async dispatch => {
    // insert new attributes
    if (inserts.length > 0) {
      try {
        await dispatch(addNewAttributes({ contactId, attributes: inserts }))

        // if (!notifyIsDisabled) {
        //   dispatch(
        //     notify({
        //       message: `New ${typeName} created.`,
        //       status: 'success'
        //     })
        //   )
        // }
      } catch (error) {
        throw error
        // dispatch(
        //   notify({
        //     title: `Can not create ${typeName}`,
        //     message: getErrorMessage(error),
        //     status: 'error'
        //   })
        // )
      }
    }

    // update attributes
    if (updates.length > 0) {
      try {
        await dispatch(updateContact({ contactId, attributes: updates }))

        // if (!notifyIsDisabled) {
        //   dispatch(
        //     notify({
        //       message: `${typeName} updated`,
        //       status: 'success'
        //     })
        //   )
        // }
      } catch (error) {
        throw error
        // dispatch(
        //   notify({
        //     title: `Can not update ${typeName}`,
        //     message: getErrorMessage(error),
        //     status: 'error'
        //   })
        // )
      }
    }
  }
}

// function getErrorMessage(e) {
//   return e.response ? e.response.body.attributes[type][0] : 'Field is not valid'
// }
