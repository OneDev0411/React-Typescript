import React, { useRef, useState } from 'react'

import { IconButton, Tooltip } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import Button from 'components/Button/ActionButton'
import Drawer from 'components/OverlayDrawer'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TextEditor } from 'components/TextEditor'
import { useEditorState } from 'components/TextEditor/hooks/use-editor-state'
import { TextEditorRef } from 'components/TextEditor/types'

import Alert from '../../../components/Pages/Dashboard/Partials/Alert'

import { Container } from './styled'

interface Note {
  id?: UUID
  text: string | null
}

interface Props {
  note?: Note
  isOpen: boolean
  onClose: () => void
  onDelete?: (note: Note) => void
  onSubmit: (note: Note) => void
}

export default function AddOrEditNoteDrawer({ note, ...props }: Props) {
  const textEditorRef = useRef<TextEditorRef>(null)
  const [error, setError] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [editorState, setEditorState, editor] = useEditorState(
    note && typeof note.text === 'string' ? note.text : ''
  )

  const onSubmit = async () => {
    try {
      setIsSaving(true)

      const text = editor.getHtml()

      const data = note
        ? {
            ...note,
            text
          }
        : { text }

      await props.onSubmit(data)

      setIsSaving(false)
      editor.reset()
      props.onClose()
    } catch (error) {
      console.log(error)
      setIsSaving(false)
      setError(error.message)
    }
  }

  const onDelete = async () => {
    if (!note || !note.id || !props.onDelete) {
      return
    }

    try {
      setIsDeleting(true)
      await props.onDelete(note)
      setIsDeleting(false)
      props.onClose()
    } catch (error) {
      console.log(error)
      setIsSaving(false)
      setError(error.message)
    }
  }

  return (
    <Drawer open={props.isOpen} onClose={props.onClose}>
      <Drawer.Header title={note ? 'Edit Note' : 'Create Note'} />
      <Drawer.Body style={{ overflow: 'hidden' }}>
        <Container>
          <TextEditor
            ref={textEditorRef}
            disabled={isSaving}
            editorState={editorState}
            onChange={setEditorState}
          />
          {error && (
            <>
              {/* 
                // @ts-ignore js component */}
              <Alert type="error" message={error.message} />
            </>
          )}
        </Container>
      </Drawer.Body>
      <Drawer.Footer>
        <div>
          {note && note.id && (
            <>
              {isDeleting ? (
                'Deleting...'
              ) : (
                <Tooltip title="Delete Note">
                  <IconButton onClick={onDelete} disabled={isSaving}>
                    <SvgIcon path={mdiTrashCanOutline} />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </div>

        <Button onClick={onSubmit} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}
