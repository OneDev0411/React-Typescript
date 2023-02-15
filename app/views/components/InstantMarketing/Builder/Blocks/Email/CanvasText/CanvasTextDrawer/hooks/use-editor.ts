import { MutableRefObject, useState, useEffect } from 'react'

import LZString from 'lz-string'
import Pikaso, { Konva, LabelModel } from 'pikaso'

import { CanvasTextProperties, DefaultCanvasTextProperties } from '../constants'

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

  const [isLoading, setIsLoading] = useState(false)
  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)
  const textPreviewLabel = editor
    ? (editor.board.activeShapes[0] as LabelModel)
    : null

  useEffect(() => {
    if (!iframe || !editorRef.current || !!editor || isLoading) {
      return
    }

    const parseState = (): Nullable<{
      label: Konva.TextConfig
      tag: Konva.RectConfig
    }> => {
      try {
        if (!state) {
          return null
        }

        const decompressed = LZString.decompressFromEncodedURIComponent(state)

        if (!decompressed) {
          return null
        }

        return JSON.parse(decompressed)
      } catch (e) {
        return null
      }
    }

    const load = async () => {
      setIsLoading(true)

      const instance = new Pikaso({
        width: 100,
        height: 100,
        container: editorRef.current as HTMLDivElement
      })

      const state = parseState()

      if (state) {
        loadFont(state.label.fontFamily)
          .catch(() => {})
          .finally(() => {
            instance.shapes.label.insert({
              ...DefaultCanvasTextProperties,
              tag: state.tag,
              text: state.label
            })

            console.log('>>> INIT', {
              ...DefaultCanvasTextProperties,
              tag: state.tag,
              text: state.label
            })

            setEditor(instance)
            setIsLoading(false)
          })
      } else {
        instance.shapes.label.insert(labelConfig)
        setEditor(instance)
        setIsLoading(false)
      }
    }

    load()
  }, [editorRef, editor, iframe, loadFont, state, labelConfig, isLoading])

  return {
    editor,
    isLoading,
    textPreviewLabel
  }
}
