import { Editor } from 'grapesjs'

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
}
