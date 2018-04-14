import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Uploader from '../../../../../../../../views/components/AvatarUploader/index.js'
import uploadAttachments from '../../../../../../../../models/contacts/upload-attachments/index.js'
import { selectDefinitionId } from '../../../../../../../../reducers/contacts/attributeDefs'
import {
  addAttributes,
  deleteAttributes
} from '../../../../../../../../store_actions/contacts'
import { getContactProfileImage } from '../../../../../../../../models/contacts/helpers'

const AvatarUploader = props => <Uploader {...props} />

function mapStateToProps(state, props) {
  const { contact } = props
  const { id: contactId } = contact
  const { contacts: { attributeDefs } } = state

  return { contactId, attributeDefs }
}

export default compose(
  connect(mapStateToProps, { addAttributes, deleteAttributes }),
  withState('uploading', 'setUploading', false),
  withState('avatar', 'setAvatar', ({ contact }) =>
    getContactProfileImage(contact)
  ),
  withHandlers({
    handleChange: ({
      contactId,
      setAvatar,
      setUploading,
      attributeDefs,
      addAttributes
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

          const image = await uploadAttachments({ contactId, file })
          const { url: text } = image

          const attribute_def = selectDefinitionId(
            attributeDefs,
            'profile_image_url'
          )

          if (!attribute_def) {
            throw new Error(
              'Something went wrong. Attribute definition is not found!'
            )
          }

          const attributes = [
            {
              text,
              attribute_def
            }
          ]

          await addAttributes(contactId, attributes)
        } catch (error) {
          console.log(error)
          setAvatar(null)
        } finally {
          setUploading(false)
        }
      })

      reader.readAsDataURL(file)
    },
    handleDelete: ({
      avatar,
      contactId,
      deleteAttributes,
      setAvatar
    }) => async () => {
      try {
        const avatars = Contact.get.attributes({
          contact,
          name: 'profile_image_urls',
          type: 'profile_image_url'
        })

        const attribute = avatars.filter(a => a.profile_image_url === avatar)
        const { id } = attribute
        const attributesIds = [id]

        await deleteAttributes({ contactId, attributesIds })
        setAvatar(null)
      } catch (error) {
        throw error
      }
    }
  })
)(AvatarUploader)
