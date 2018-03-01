import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Uploader from '../../../../../../../../views/components/AvatarUploader/index.js'

import uploadAttachments from '../../../../../../../../models/contacts/upload-attachments/index.js'

import {
  addNewAttributes,
  deleteAttributes
} from '../../../../../../../../store_actions/contacts'
import Contact from '../../../../../../../../models/contacts'

const AvatarUploader = props => <Uploader {...props} />

function mapStateToProps(state, props) {
  const { contact } = props
  const { id: contactId } = contact

  return { contactId }
}

export default compose(
  connect(mapStateToProps, { addNewAttributes, deleteAttributes }),
  withState('uploading', 'setUploading', false),
  withState(
    'avatar',
    'setAvatar',
    ({ contact }) => Contact.get.avatar(contact) || null
  ),
  withHandlers({
    handleChange: ({
      contactId,
      setAvatar,
      setUploading,
      addNewAttributes
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
          const { url: profile_image_url } = image

          const attributes = [
            {
              profile_image_url,
              type: 'profile_image_url'
            }
          ]

          // console.log(attributes, image)

          await addNewAttributes({ contactId, attributes })
        } catch (error) {
          setAvatar(null)
          // console.log(error)
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
        // console.log(error)
      }
    }
  })
)(AvatarUploader)
