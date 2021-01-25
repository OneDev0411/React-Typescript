import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import {
  EDIT_IMAGE_TOOLBAR_BUTTON_NAME,
  CHANGE_IMAGE_TOOLBAR_BUTTON_NAME
} from '../constants'

import {
  isImage,
  isBackgroundImageAllowed,
  isBackgroundUrlAllowed,
  hasToolbarImageButtons
} from '../utils/helpers'

export function registerToolbarButtons(
  editor: Editor,
  onChangeImageClick: () => void,
  onEditImageClick: () => void
) {
  editor.on('component:selected', (selected?: Model) => {
    if (!selected) {
      return
    }

    const isImageElement = isImage(selected)
    const isBackgroundImageAllowedElement = isBackgroundImageAllowed(selected)
    const isBackgroundUrlAllowedElement = isBackgroundUrlAllowed(selected)

    if (
      !isImageElement &&
      !isBackgroundImageAllowedElement &&
      !isBackgroundUrlAllowedElement
    ) {
      return
    }

    const toolbar: any[] = selected.get('toolbar')
    const hasImageButtons = hasToolbarImageButtons(selected)

    if (hasImageButtons) {
      return
    }

    toolbar.unshift(
      {
        name: EDIT_IMAGE_TOOLBAR_BUTTON_NAME,
        attributes: { class: 'fa fa-pencil' },
        command: () => editor.runCommand('call-fn', { fn: onEditImageClick })
      },
      {
        name: CHANGE_IMAGE_TOOLBAR_BUTTON_NAME,
        attributes: { class: 'fa fa-image' },
        command: () => editor.runCommand('call-fn', { fn: onChangeImageClick })
      }
    )
  })
}
