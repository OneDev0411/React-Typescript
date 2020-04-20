import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'

import uploadAttachments from 'models/contacts/upload-attachments'
import { updateContact } from 'models/contacts/update-contact'
import {
  getContactAvatar,
  getContactNameInitials
} from 'models/contacts/helpers'

import { IAppState } from 'reducers'
import { IAttributeDefsState } from 'reducers/contacts/attributeDefs'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import { AvatarUploader as Uploader } from 'views/components/AvatarUploader'

interface Props {
  attributeDefs: IAttributeDefsState
  contact: IContact
}

function AvatarUploader({ contact, attributeDefs }: Props) {
  const [isUploading, setIsUploading] = useState(false)
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(
    contact.profile_image_url
  )

  const handleOnChange = useCallback(
    async data => {
      const file = data.target ? data.target.files[0] : data.files.file

      // Create a new FileReader instance
      // https://developer.mozilla.org/en/docs/Web/API/FileReader
      let reader = new FileReader()

      // Once a file is successfully readed:
      reader.addEventListener('load', async () => {
        try {
          setAvatar(reader.result)
          setIsUploading(true)

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
                id: avatar.id,
                text
              }
            ]
          } else {
            attribute = [
              {
                attribute_def: attribute_def.id,
                is_primary: true,
                text
              }
            ]
          }

          await updateContact(contact.id, attribute)
        } catch (error) {
          setAvatar(null)
          console.log(error)
        } finally {
          setIsUploading(false)
        }
      })

      reader.readAsDataURL(file)
    },
    [attributeDefs, contact]
  )

  return (
    <Uploader
      avatar={{
        size: 56,
        src: avatar,
        initials: getContactNameInitials(contact)
      }}
      handleOnChange={handleOnChange}
      isUploading={isUploading}
    />
  )
}

function mapStateToProps(state: IAppState) {
  return {
    attributeDefs: state.contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(AvatarUploader)
