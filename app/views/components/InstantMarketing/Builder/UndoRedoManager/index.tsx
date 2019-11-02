import React from 'react'
import { Button, ButtonGroup } from '@material-ui/core'
import { Editor } from 'grapesjs'

// import useUndoRedo from './use-undo-redo'

interface Props {
  editor: Editor
}

export default function UndoRedoManager({ editor }: Props) {
  // const { hasUndo, hasRedo, undo, redo } = useUndoRedo(editor)

  function undo() {
    editor.runCommand('core:undo')
  }

  function redo() {
    editor.runCommand('core:redo')
  }

  return (
    <>
      <ButtonGroup size="small">
        <Button variant="outlined" onClick={redo}>
          Redo
        </Button>
        <Button variant="outlined" onClick={undo}>
          Undo
        </Button>
      </ButtonGroup>
    </>
  )
}
