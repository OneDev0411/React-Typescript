import type { Editor, Model } from 'grapesjs'

import { setImage, getImage } from '../utils/helpers'

type CreateCommandParameters<T> = {
  model?: Model
} & T

type CreateCommandCallback<T> = (
  model: Model,
  parameters: CreateCommandParameters<T>
) => void

const createCommand =
  <T extends {}>(callback: CreateCommandCallback<T>) =>
  (editor: Editor, _: Editor, parameters: CreateCommandParameters<T>) => {
    const targetModel = parameters?.model || editor.getSelected()

    if (!targetModel) {
      return
    }

    return callback(targetModel, parameters)
  }

export function registerCommands(editor: Editor) {
  // @ts-ignore
  editor.Commands.add(
    'call-fn',
    createCommand<{ fn: Function }>((_, { fn }) => fn())
  )

  // @ts-ignore
  editor.Commands.add(
    'set-attribute',
    createCommand<{
      attribute: string
      value: string
    }>((targetModel, { attribute, value }) => {
      targetModel.set(attribute, value)
    })
  )

  // @ts-ignore
  editor.Commands.add(
    'get-attribute',
    createCommand<{ attribute: string }>((targetModel, { attribute }) =>
      targetModel.get(attribute)
    )
  )

  // @ts-ignore
  editor.Commands.add(
    'set-image',
    createCommand<{ value: string }>((targetModel, { value }) => {
      setImage(targetModel, value)
    })
  )

  // @ts-ignore
  editor.Commands.add(
    'get-image',
    createCommand(targetModel => getImage(targetModel))
  )

  // @ts-ignore
  editor.Commands.add(
    'get-el',
    // @ts-ignore
    createCommand(targetModel => targetModel.getEl())
  )
}
