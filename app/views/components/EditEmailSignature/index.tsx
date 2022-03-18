import React, { useState } from 'react'

import { Box, Button, Grid, Theme } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css, ThemeProps } from 'styled-components'

import editUser from 'actions/user/edit'
import { addNotification } from 'components/notification'
import { uploadEmailSignatureAttachment } from 'models/user/upload-email-signature-attachment'
import { selectUserEmailSignature } from 'selectors/user'

import { TextEditor } from '../TextEditor'
import { EmojiFeature } from '../TextEditor/features/Emoji'
import { ImageFeature } from '../TextEditor/features/Image'
import { RichTextFeature } from '../TextEditor/features/RichText'
import { useEditorState } from '../TextEditor/hooks/use-editor-state'

interface Props {
  onSaved?: () => void
  showActions?: boolean
}

export const StyledTextEditor = styled(TextEditor)`
  ${(props: ThemeProps<Theme>) => css`
    border: 1px solid ${props.theme.palette.divider};
    padding: ${props.theme.spacing(0, 1, 1, 1)};
  `}
`

export default function EditEmailSignature({
  onSaved = () => {},
  showActions = true
}: Props) {
  const dispatch = useDispatch()
  const userEmailSignature = useSelector(selectUserEmailSignature)

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [editorState, setEditorState, signatureEditor] = useEditorState(
    userEmailSignature || ''
  )

  const onSave = async () => {
    try {
      setIsSaving(true)
      await dispatch(editUser({ email_signature: signatureEditor.getHtml() }))
      setIsSaving(false)
      dispatch(
        addNotification({
          message: 'Email signature has been saved',
          status: 'success'
        })
      )
      onSaved()
    } catch (e) {
      console.error(e)
      dispatch(
        addNotification({
          message: 'Could not save email signature',
          status: 'error'
        })
      )
    }
  }

  const uploadImage = async file => {
    try {
      setIsSaving(true)

      const response = await uploadEmailSignatureAttachment(file)

      const uploadedFile: IFile = response.body.data

      return uploadedFile.url
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Box mb={2}>
        <StyledTextEditor
          autofocus
          editorState={editorState}
          onChange={setEditorState}
        >
          <RichTextFeature />
          <ImageFeature uploadImage={uploadImage} />
          <EmojiFeature />
        </StyledTextEditor>
      </Box>

      {showActions && (
        <Grid container justifyContent="flex-end">
          <Button
            color="secondary"
            variant="contained"
            disabled={isSaving}
            onClick={onSave}
          >
            Save
          </Button>
        </Grid>
      )}
    </>
  )
}
