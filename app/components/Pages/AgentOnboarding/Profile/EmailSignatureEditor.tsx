import React from 'react'

import { Box } from '@material-ui/core'
import { mdiEmailOutline } from '@mdi/js'
import { EditorState } from 'draft-js'

import { StyledTextEditor } from 'components/EditEmailSignature'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { EmojiFeature } from 'components/TextEditor/features/Emoji'
import { ImageFeature } from 'components/TextEditor/features/Image'
import { RichTextFeature } from 'components/TextEditor/features/RichText'
import { uploadEmailSignatureAttachment } from 'models/user/upload-email-signature-attachment'

interface Props {
  editorState: EditorState
  onChange: (state: EditorState) => void
}

export default function EmailSignatureEditor({ editorState, onChange }: Props) {
  const uploadImage = async file => {
    const response = await uploadEmailSignatureAttachment(file)
    const uploadedFile: IFile = response.body.data

    return uploadedFile.url
  }

  return (
    <>
      <Box mb={0.5} display="flex" justifyContent="center" alignItems="center">
        <SvgIcon path={mdiEmailOutline} />
        <span style={{ marginLeft: '0.5rem' }}>Your email signature</span>
      </Box>
      <StyledTextEditor
        style={{ minHeight: '10rem' }}
        editorState={editorState}
        onChange={onChange}
        placeholder="Type something or copy from your Gmail or Outlook account"
      >
        <RichTextFeature />
        <ImageFeature uploadImage={uploadImage} />
        <EmojiFeature />
      </StyledTextEditor>
    </>
  )
}
