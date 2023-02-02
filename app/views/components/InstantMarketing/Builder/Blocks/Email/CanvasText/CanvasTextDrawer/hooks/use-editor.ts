import { MutableRefObject, useState, useEffect } from 'react'

import { Model } from 'backbone'
import Pikaso, { Konva, LabelModel } from 'pikaso'

import { DefaultCanvasTextProperties } from '../constants'

import { useIframe } from './use-iframe'
import { useIframeFonts } from './use-iframe-fonts'

export function useEditor(
  editorRef: MutableRefObject<Nullable<HTMLDivElement>>,
  model: Nullable<Model>
) {
  const iframe = useIframe()
  const iframeFonts = useIframeFonts()

  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)
  const [textPreviewLabel, fontPreviewLabel] = editor
    ? [
        editor.board.activeShapes[0] as LabelModel,
        editor.board.activeShapes[1] as LabelModel
      ]
    : [null, null]

  useEffect(() => {
    if (editor || !model || !iframe || !editorRef.current) {
      return
    }

    Konva.Util.createCanvasElement = () =>
      iframe!.contentDocument!.createElement('canvas')

    const instance = new Pikaso({
      width: 50,
      height: 50,
      container: editorRef.current
    })

    const state = decodeURIComponent(model.get('canvas-json'))

    if (state) {
      instance.load(state)
    } else {
      instance.shapes.label.insert(DefaultCanvasTextProperties)

      instance.shapes.label.insert({
        ...DefaultCanvasTextProperties,
        text: {
          fontSize: 35,
          lineHeight: 1
        }
      })
    }

    setEditor(instance)
  }, [editorRef, editor, model, iframe])

  return {
    editor,
    isEditorLoaded: editor !== null && iframeFonts.length > 0,
    textPreviewLabel,
    fontPreviewLabel
  }
}
