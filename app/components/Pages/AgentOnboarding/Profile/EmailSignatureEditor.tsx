import React from 'react'
import { Box, Theme } from '@material-ui/core'
import styled, { ThemeProps } from 'styled-components'
import { EditorState } from 'draft-js'

import { uploadEmailSignatureAttachment } from 'models/user/upload-email-signature-attachment'

import { TextEditor } from 'components/TextEditor'
import { ImageFeature } from 'components/TextEditor/features/Image'
import { RichTextFeature } from 'components/TextEditor/features/RichText'
import { EmojiFeature } from 'components/TextEditor/features/Emoji'
import EmailIcon from 'components/SvgIcons/EmailOutline/IconEmailOutline'

interface Props {
  editorState: EditorState
  onChange: (state: EditorState) => void
}

const StyledTextEditor = styled(TextEditor)`
  border: 1px solid ${(props: ThemeProps<Theme>) => props.theme.palette.divider};
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 1, 1, 1)};
`

export default function EmailSignatureEditor({ editorState, onChange }: Props) {
  const uploadImage = async file => {
    const response = await uploadEmailSignatureAttachment(file)
    const uploadedFile: IFile = response.body.data

    return uploadedFile.url
  }

  return (
    <>
      <Box mb={0.5} display="flex" justifyContent="center" alignItems="center">
        <EmailIcon />
        <span style={{ marginLeft: '0.5rem' }}>Your email signature</span>
      </Box>
      <StyledTextEditor editorState={editorState} onChange={onChange}>
        <RichTextFeature />
        <ImageFeature uploadImage={uploadImage} />
        <EmojiFeature />
      </StyledTextEditor>
    </>
  )
}
