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
  const [isInitialized, setIsInitialized] = useState<boolean>(false) // In order to ignore first update (whole template render)

  useEffect(() => {
    editor.UndoManager.start()
    editor.UndoManager.clear()

    editor.on('update', () => {
      if (!isInitialized) {
        setIsInitialized(true)

        return
      }

      setHasUndo(editor.UndoManager.hasUndo())
      setHasRedo(editor.UndoManager.hasRedo())
    })

    return () => {
      editor.UndoManager.stop()
    }
  }, [editor, isInitialized])

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
