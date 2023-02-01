import { MutableRefObject, useState, useEffect } from 'react'

import { Model } from 'backbone'
import Pikaso, { Konva, LabelModel } from 'pikaso'

import { DefaultCanvasTextProperties } from '../constants'

export function useEditor(
  editorRef: MutableRefObject<Nullable<HTMLDivElement>>,
  model: Nullable<Model>
): [Nullable<Pikaso>, Nullable<LabelModel>, Nullable<LabelModel>] {
  const [editor, setEditor] = useState<Nullable<Pikaso>>(null)
  const [textPreviewLabel, fontPreviewLabel] = editor
    ? [
        editor.board.activeShapes[0] as LabelModel,
        editor.board.activeShapes[1] as LabelModel
      ]
    : [null, null]

  useEffect(() => {
    if (editor || !model || !editorRef.current) {
      return
    }

    Konva.Util.createCanvasElement = () => {
      const iframe = document.querySelector('.gjs-frame') as HTMLIFrameElement

      return iframe.contentDocument!.createElement('canvas')
    }

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
  }, [editorRef, editor, model])

  return [editor, textPreviewLabel, fontPreviewLabel]
}
