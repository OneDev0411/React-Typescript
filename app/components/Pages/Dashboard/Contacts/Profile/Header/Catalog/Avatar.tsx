import { useState, useCallback } from 'react'

import { connect } from 'react-redux'

import { getAccountAvatar } from 'components/Avatar/helpers/get-avatar'
import {
  getContactAvatar,
  getContactNameInitials
} from 'models/contacts/helpers'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
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
  onChange: (contact: INormalizedContact) => void
}

function AvatarUploader({ contact, attributeDefs, onChange }: Props) {
  const [uploadingAvatar, setUploadingAvatar] = useState<
    string | ArrayBuffer | null
  >(null)

  const isUploading = !!uploadingAvatar

  const handleOnChange = useCallback(
    async (file: File) => {
      const dataUrl = await readFileAsDataUrl(file)

      try {
        setUploadingAvatar(dataUrl)

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

        const avatar = getContactAvatar(contact, attribute_def.id)

        const attribute = avatar
          ? [
              {
                id: avatar.id,
                text
              }
            ]
          : [
              {
                attribute_def: attribute_def.id,
                is_primary: true,
                text
              }
            ]

        const response = await updateContact(contact.id, attribute)

        onChange(normalizeContact(response.data))
      } catch (error) {
        console.log(error)
      } finally {
        setUploadingAvatar(null)
      }
    },
    [attributeDefs, contact, onChange]
  )

  return (
    <Uploader
      avatar={{
        size: 72,
        src: isUploading ? uploadingAvatar : getAccountAvatar(contact),
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
