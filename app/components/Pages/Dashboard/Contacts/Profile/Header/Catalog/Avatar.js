import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import { AvatarUploader as Uploader } from 'views/components/AvatarUploader'
import uploadAttachments from 'models/contacts/upload-attachments'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'
import { updateContact } from 'models/contacts/update-contact'
import { deleteAttribute } from 'models/contacts/delete-attribute'
import {
  getContactAvatar,
  getContactNameInitials,
  getContactOnlineStatus,
  getAttributeFromSummary
} from 'models/contacts/helpers'

const AvatarUploader = props => (
  <Uploader
    {...props}
    avatar={{
      size: 48,
      src: props.avatar,
      initials: getContactNameInitials(props.contact, props.attributeDefs)
    }}
  />
)

function mapStateToProps(state, props) {
  return {
    attributeDefs: state.contacts.attributeDefs,
    isOnline: getContactOnlineStatus(props.contact)
  }
}

export default compose(
  connect(mapStateToProps),
  withState('isUploading', 'setUploading', false),
  withState('avatar', 'setAvatar', ({ contact }) =>
    getAttributeFromSummary(contact, 'profile_image_url')
  ),
  withHandlers({
    handleOnChange: ({
      attributeDefs,
      contact,
      setAvatar,
      setUploading
    }) => async data => {
      const file = data.target ? data.target.files[0] : data.files.file

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
                attribute_def: attribute_def.id,
                is_primary: true
              }
            ]
          }

          await updateContact(contact.id, attribute)
        } catch (error) {
          setAvatar(null)
          throw error
        } finally {
          setUploading(false)
        }
      })

      reader.readAsDataURL(file)
    },
    handleOnDelete: ({ attributeDefs, contact, setAvatar }) => async () => {
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
          await deleteAttribute(contact.id, avatar.id)
        }

        setAvatar(null)
      } catch (error) {
        throw error
      }
    }
  })
)(AvatarUploader)
