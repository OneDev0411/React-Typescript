import { useState, useEffect, useRef, useCallback } from 'react'
import { Editor } from 'grapesjs'

interface UseUndoRedo {
  hasUndo: boolean
  hasRedo: boolean
  undo: () => void
  redo: () => void
}

export default function useUndoRedo(editor: Editor): UseUndoRedo {
  const editorRef = useRef(editor)

  const [hasUndo, setHasUndo] = useState<boolean>(editor.UndoManager.hasUndo())
  const [hasRedo, setHasRedo] = useState<boolean>(editor.UndoManager.hasRedo())

  useEffect(() => {
    const currentEditor = editorRef.current

    currentEditor.UndoManager.start()
    setHasUndo(currentEditor.UndoManager.hasUndo())
    setHasRedo(currentEditor.UndoManager.hasRedo())

    return () => {
      currentEditor.UndoManager.stop()
    }
  }, [editor])

  const undo = useCallback(() => {
    if (!hasUndo) {
      return
    }

    editorRef.current.UndoManager.undo()
    setHasUndo(editorRef.current.UndoManager.hasUndo())
  }, [hasUndo])

  const redo = useCallback(() => {
    if (!hasRedo) {
      return
    }

    editor.UndoManager.redo()
    setHasRedo(editorRef.current.UndoManager.hasRedo())
  }, [editor.UndoManager, hasRedo])

  return {
    hasUndo,
    hasRedo,
    undo,
    redo
  }
}
