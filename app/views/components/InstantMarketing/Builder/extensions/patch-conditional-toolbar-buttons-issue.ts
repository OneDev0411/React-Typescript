import { Editor, Model } from 'grapesjs'

const commandToPropNameMap: Record<string, string> = {
  'tlb-move': 'draggable',
  'tlb-clone': 'copyable',
  'tlb-delete': 'removable'
}

/**
 * The GrapesJS toolbar is buggy and the conditional toolbar items do not get updated
 * when the draggable, copyable, and removable props are changed programmatically.
 *
 * I opened this issue on Github for that: https://github.com/artf/grapesjs/issues/4255
 *
 * In the meanwhile, I write these lines to update the toolbar based on the current prop
 * states when a model is selected. This way the toolbar items will be synced with the
 * model states whenever it comes up.
 */
export function patchConditionalToolbarButtonsIssue(editor: Editor) {
  editor.on('component:selected', (selected?: Model) => {
    if (!selected) {
      return
    }

    const toolbar = selected.get('toolbar')

    if (!toolbar) {
      return
    }

    const updatedToolbar = toolbar.filter(item => {
      const targetPropName = commandToPropNameMap[item.command]

      if (!targetPropName) {
        return true
      }

      return !!selected.get(targetPropName)
    })

    selected.set('toolbar', updatedToolbar)
  })
}
