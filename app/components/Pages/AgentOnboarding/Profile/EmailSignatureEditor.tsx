import React from 'react'
import { Box, Theme } from '@material-ui/core'
import styled, { ThemeProps } from 'styled-components'

import { uploadEmailSignatureAttachment } from 'models/user/upload-email-signature-attachment'

import { TextEditor } from 'components/TextEditor'
import { ImageFeature } from 'components/TextEditor/features/Image'
import { RichTextFeature } from 'components/TextEditor/features/RichText'
import { EmojiFeature } from 'components/TextEditor/features/Emoji'
import EmailIcon from 'components/SvgIcons/EmailOutline/IconEmailOutline'

interface Props {
  user: IUser
  onChange: (signature: string) => void
}

const StyledTextEditor = styled(TextEditor)`
  border: 1px solid ${(props: ThemeProps<Theme>) => props.theme.palette.divider};
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 1, 1, 1)};
`

export default function EmailSignatureEditor({ user, onChange }: Props) {
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
      <StyledTextEditor onChange={onChange}>
        <RichTextFeature />
        <ImageFeature uploadImage={uploadImage} />
        <EmojiFeature />
      </StyledTextEditor>
    </>
  )
}
