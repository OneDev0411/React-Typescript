import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import { AvatarUploader as Uploader } from '../../../../../../../../views/components/AvatarUploader/index.js'
import uploadAttachments from '../../../../../../../../models/contacts/upload-attachments/index.js'
import { selectDefinitionByName } from '../../../../../../../../reducers/contacts/attributeDefs'
import {
  deleteAttributes,
  upsertContactAttributes
} from '../../../../../../../../store_actions/contacts'
import {
  getContactAvatar,
  getContactOnlineStatus,
  getAttributeFromSummary
} from '../../../../../../../../models/contacts/helpers'

const AvatarUploader = props => (
  <Uploader {...props} avatar={{ src: props.avatar }} />
)

function mapStateToProps(state, props) {
  return {
    attributeDefs: state.contacts.attributeDefs,
    isOnline: getContactOnlineStatus(props.contact)
  }
}

export default compose(
  connect(mapStateToProps, { upsertContactAttributes, deleteAttributes }),
  withState('isUploading', 'setUploading', false),
  withState('avatar', 'setAvatar', ({ contact }) =>
    getAttributeFromSummary(contact, 'profile_image_url')
  ),
  withHandlers({
    handleOnChange: ({
      attributeDefs,
      contact,
      setAvatar,
      setUploading,
      upsertContactAttributes
    }) => async event => {
      const file = event.target.files[0]

      // Create a new FileReader instance
      // https://developer.mozilla.org/en/docs/Web/API/FileReader
      let reader = new FileReader()

      // Once a file is successfully readed:
      reader.addEventListener('load', async () => {
        try {
          setAvatar(reader.result)
          setUploading(true)

          const image = await uploadAttachments({ contactId: contact.id, file })
          const { url: text } = image

          const attribute_def = selectDefinitionByName(
            attributeDefs,
            'profile_image_url'
          )

          if (!attribute_def) {
            throw new Error(
              'Something went wrong. Attribute definition is not found!'
            )
          }

          let attribute
          const avatar = getContactAvatar(contact, attribute_def.id)

          if (avatar) {
            attribute = [
              {
                text,
                id: avatar.id
              }
            ]
          } else {
            attribute = [
              {
                text,
                index: 1,
                attribute_def,
                is_primary: true
              }
            ]
          }

          await upsertContactAttributes(contact.id, attribute)
        } catch (error) {
          setAvatar(null)
          throw error
        } finally {
          setUploading(false)
        }
      })

      reader.readAsDataURL(file)
    },
    handleOnDelete: ({
      attributeDefs,
      contact,
      deleteAttributes,
      setAvatar
    }) => async () => {
      try {
        const attribute_def = selectDefinitionByName(
          attributeDefs,
          'profile_image_url'
        )

        if (!attribute_def) {
          throw new Error(
            'Something went wrong. Attribute definition is not found!'
          )
        }

        const avatar = getContactAvatar(contact, attribute_def.id)

        if (avatar && avatar.id) {
          await deleteAttributes(contact.id, [avatar.id])
        }

        setAvatar(null)
      } catch (error) {
        throw error
      }
    }
  })
)(AvatarUploader)
