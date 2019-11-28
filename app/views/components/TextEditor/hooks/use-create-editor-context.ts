import { useMemo, useState } from 'react'
import { DraftJsPlugin } from 'draft-js-plugins-editor'

import { EditorState } from 'draft-js'

import { useLatestValueRef } from 'hooks/use-latest-value-ref'

import { EditorContextApi } from '../types'

interface EditorContextParams {
  editorState: EditorState
  onChange: (editorState: EditorState) => void
}

export function useCreateEditorContext({
  editorState,
  onChange
}: EditorContextParams) {
  const [plugins, setPlugins] = useState<DraftJsPlugin[]>([])

  const getEditorStateRef = useLatestValueRef(() => editorState)
  const setEditorStateRef = useLatestValueRef(onChange)

  const editorContext: EditorContextApi = useMemo(() => {
    console.log('context changed')

    return {
      getEditorState: getEditorStateRef.current,
      setEditorState: setEditorStateRef.current,
      addPlugin: plugin => {
        setPlugins(plugins => {
          if (!plugins.includes(plugin)) {
            return [...plugins, plugin]
          }

          return plugins
        })

        return () => {
          setPlugins(plugins => plugins.filter(aPlugin => aPlugin !== plugin))
        }
      }
    }
  }, [getEditorStateRef, setEditorStateRef])

  return { editorContext, plugins }
}
