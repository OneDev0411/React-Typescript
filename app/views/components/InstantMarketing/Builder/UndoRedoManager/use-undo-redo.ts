import { useState, useEffect } from 'react'
import { Editor } from 'grapesjs'

interface UseUndoRedo {
  hasUndo: boolean
  hasRedo: boolean
  undo: () => void
  redo: () => void
}

export default function useUndoRedo(editor: Editor): UseUndoRedo {
  const [hasUndo, setHasUndo] = useState<boolean>(editor.UndoManager.hasUndo())
  const [hasRedo, setHasRedo] = useState<boolean>(editor.UndoManager.hasRedo())

  useEffect(() => {
    editor.UndoManager.start()
    editor.UndoManager.clear()

    editor.on('update', () => {
      setHasUndo(editor.UndoManager.hasUndo())
      setHasRedo(editor.UndoManager.hasRedo())
    })

    return () => {
      editor.UndoManager.stop()
    }
  }, [editor])

  function undo() {
    editor.UndoManager.undo()
    setHasUndo(editor.UndoManager.hasUndo())
  }

  function redo() {
    editor.UndoManager.redo()
    setHasRedo(editor.UndoManager.hasRedo())
  }

  return {
    hasUndo,
    hasRedo,
    undo,
    redo
  }
}
