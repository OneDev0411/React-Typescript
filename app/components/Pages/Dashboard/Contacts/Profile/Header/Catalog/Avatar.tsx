import React, { useState, useCallback } from 'react'

import { connect } from 'react-redux'

import { getAccountAvatar } from 'components/Avatar/helpers/get-avatar'
import {
  getContactAvatar,
  getContactNameInitials
} from 'models/contacts/helpers'
import { updateContact } from 'models/contacts/update-contact'
import uploadAttachments from 'models/contacts/upload-attachments'
import { IAppState } from 'reducers'
import {
  IAttributeDefsState,
  selectDefinitionByName
} from 'reducers/contacts/attributeDefs'
import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'
import { AvatarUploader as Uploader } from 'views/components/AvatarUploader'

interface Props {
  attributeDefs: IAttributeDefsState
  contact: IContact
}

function AvatarUploader({ contact, attributeDefs }: Props) {
  const [isUploading, setIsUploading] = useState(false)
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(
    getAccountAvatar(contact)
  )

  const handleOnChange = useCallback(
    async (file: File) => {
      const dataUrl = await readFileAsDataUrl(file)

      try {
        setAvatar(dataUrl)
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
    },
    [attributeDefs, contact]
  )

  return (
    <Uploader
      avatar={{
        size: 72,
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
