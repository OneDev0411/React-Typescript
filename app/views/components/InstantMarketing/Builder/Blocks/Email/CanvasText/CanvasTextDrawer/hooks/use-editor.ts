import { MutableRefObject, useState, useEffect } from 'react'

import Pikaso, { JsonData, LabelModel } from 'pikaso'

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

  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)
  const textPreviewLabel = editor
    ? (editor.board.activeShapes[0] as LabelModel)
    : null

  useEffect(() => {
    if (editor || !iframe || !editorRef.current) {
      return
    }

    const load = async () => {
      const instance = new Pikaso({
        width: 100,
        height: 100,
        container: editorRef.current as HTMLDivElement
      })

      if (state) {
        const jsonState = JSON.parse(state) as JsonData

        const initialFontName =
          jsonState.shapes?.[0]?.children?.[1].attrs.fontFamily

        try {
          await loadFont(initialFontName)
        } catch (e) {
        } finally {
          await instance.load(state)
        }
      } else {
        instance.shapes.label.insert(labelConfig)
      }

      setEditor(instance)
    }

    load()
  }, [editorRef, editor, iframe, loadFont, state, labelConfig])

  return {
    editor,
    textPreviewLabel
  }
}
