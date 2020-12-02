import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, Grid, Theme } from '@material-ui/core'
import styled, { css, ThemeProps } from 'styled-components'

import { addNotification } from 'components/notification'

import { IAppState } from 'reducers'
import editUser from 'actions/user/edit'
import { uploadEmailSignatureAttachment } from 'models/user/upload-email-signature-attachment'

import { TextEditor } from '../TextEditor'
import { ImageFeature } from '../TextEditor/features/Image'
import { RichTextFeature } from '../TextEditor/features/RichText'
import { EmojiFeature } from '../TextEditor/features/Emoji'
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
  const user = useSelector((state: IAppState) => state.user)

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [editorState, setEditorState, signatureEditor] = useEditorState(
    user.email_signature != null ? user.email_signature : ''
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
    const response = await uploadEmailSignatureAttachment(file)
    const uploadedFile: IFile = response.body.data

    return uploadedFile.url
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
        <Grid container justify="flex-end">
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
