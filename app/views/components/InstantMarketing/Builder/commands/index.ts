import { Editor } from 'grapesjs'

import { setImage, getImage } from '../utils/helpers'

interface CallFunctionCommandOptions {
  fn: Function
}

export function registerCommands(editor: Editor) {
  // @ts-ignore
  editor.Commands.add(
    'call-fn',
    (ed, sender, { fn }: CallFunctionCommandOptions) => {
      return fn()
    }
  )

  // @ts-ignore
  editor.Commands.add(
    'set-attribute',
    (ed, sender, { model, attribute, value }) => {
      const targetModel = model || editor.getSelected()

      if (!targetModel) {
        return
      }

      targetModel.set(attribute, value)
    }
  )

  // @ts-ignore
  editor.Commands.add('get-attribute', (ed, sender, { model, attribute }) => {
    const targetModel = model || editor.getSelected()

    if (!targetModel) {
      return
    }

    return targetModel.get(attribute)
  })

  // @ts-ignore
  editor.Commands.add('set-image', (ed, sender, { model, value }) => {
    const targetModel = model || editor.getSelected()

    if (!targetModel) {
      return
    }

    setImage(targetModel, value)
  })

  // @ts-ignore
  editor.Commands.add('get-image', (ed, sender, { model }) => {
    const targetModel = model || editor.getSelected()

    if (!targetModel) {
      return
    }

    return getImage(targetModel)
  })

  // @ts-ignore
  editor.Commands.add('get-el', (ed, sender, { model }) => {
    const targetModel = model || editor.getSelected()

    if (!targetModel) {
      return
    }

    return targetModel.getEl()
  })
}
