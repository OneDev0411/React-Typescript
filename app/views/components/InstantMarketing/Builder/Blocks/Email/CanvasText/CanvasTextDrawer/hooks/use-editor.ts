import {
  MutableRefObject,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'

import Pikaso, { LabelModel } from 'pikaso'

import { CanvasTextProperties, DefaultCanvasTextProperties } from '../constants'
import { parseState } from '../utils/parse-state'

import { useIframe } from './use-iframe'
import { useIframeFonts } from './use-iframe-fonts'

interface Options {
  editorRef: MutableRefObject<Nullable<HTMLDivElement>>
  state?: Nullable<string>
  labelConfig?: CanvasTextProperties
}

export function useEditor({
  editorRef,
  state = null,
  labelConfig = DefaultCanvasTextProperties
}: Options) {
  const iframe = useIframe()

  const [, loadFont] = useIframeFonts()
  const initialState = useRef(state)
  const [isLoading, setIsLoading] = useState(false)
  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)

  const reset = () => loadEditorFromState(initialState.current)

  const getLabelNode = useCallback(
    (editor: Nullable<Pikaso>) =>
      editor ? (editor.board.activeShapes[0] as LabelModel) : null,
    []
  )

  const loadEditorFromState = useCallback(
    (state: Nullable<string>): Promise<Pikaso> => {
      const instance = new Pikaso({
        width: 100,
        height: 100,
        container: editorRef.current as HTMLDivElement
      })

      const json = parseState(state)

      return new Promise(resolve => {
        if (json) {
          loadFont(json.label.fontFamily)
            .catch(() => {})
            .finally(() => {
              const label = instance.shapes.label.insert({
                ...DefaultCanvasTextProperties,
                tag: json.tag,
                text: json.label
              })

              label.rotate(json.root?.rotation ?? 0)

              resolve(instance)
            })
        } else {
          instance.shapes.label.insert(labelConfig)

          resolve(instance)
        }
      })
    },
    [editorRef, labelConfig, loadFont]
  )

  useEffect(() => {
    if (!iframe || !editorRef.current || !!editor || isLoading) {
      return
    }

    const load = async () => {
      setIsLoading(true)

      try {
        const instance = await loadEditorFromState(state)

        setEditor(instance)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [editorRef, editor, iframe, state, isLoading, loadEditorFromState])

  return {
    editor,
    reset,
    isLoading,
    getLabelNode
  }
}
