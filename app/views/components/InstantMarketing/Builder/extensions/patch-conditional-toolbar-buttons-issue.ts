import { Editor, Model } from 'grapesjs'

/**
 * The GrapesJS toolbar is buggy and the conditional toolbar items do not get updated
 * when the draggable, copyable, and removable props are changed programmatically.
 *
 * I opened this issue on Github for that: https://github.com/artf/grapesjs/issues/4255
 *
 * This logic forces the toolbar to update when a component is selected. This way the
 * toolbar items are always up to date.
 */
export function patchConditionalToolbarButtonsIssue(editor: Editor) {
  editor.on('component:selected', (selected?: Model) => {
    if (!selected) {
      return
    }

    selected.set({ toolbar: null })
    selected.initToolbar()
  })
}
