import { useState } from 'react'

import { Box, Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import editUser from 'actions/user/edit'
import { addNotification } from 'components/notification'
import { uploadEmailSignatureAttachment } from 'models/user/upload-email-signature-attachment'
import { selectUserEmailSignature } from 'selectors/user'

import { StyledTextEditor } from '../EditEmailSignature'
import Drawer from '../OverlayDrawer'
import { EmojiFeature } from '../TextEditor/features/Emoji'
import { ImageFeature } from '../TextEditor/features/Image'
import { RichTextFeature } from '../TextEditor/features/RichText'
import { useEditorState } from '../TextEditor/hooks/use-editor-state'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function EditEmailSignatureDrawer({ isOpen, onClose }: Props) {
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
      onClose()
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
    <Drawer open={isOpen} onClose={onClose}>
      <Drawer.Header title="Edit Email Signature" />
      <Drawer.Body style={{ overflow: 'hidden' }}>
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
      </Drawer.Body>
      <Drawer.Footer>
        <Button
          color="secondary"
          variant="contained"
          disabled={isSaving}
          onClick={onSave}
        >
          Save
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}
