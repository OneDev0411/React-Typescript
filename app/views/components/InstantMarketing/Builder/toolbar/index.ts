import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import {
  EDIT_IMAGE_TOOLBAR_BUTTON_NAME,
  CHANGE_IMAGE_TOOLBAR_BUTTON_NAME,
  CHANGE_MAP_THEME_TOOLBAR_BUTTONS_PREFIX
} from '../constants'

import {
  isImage,
  isBackgroundImageAllowed,
  isBackgroundUrlAllowed,
  hasToolbarImageButtons,
  isMap,
  hasToolbarMapButtons
} from '../utils/helpers'

interface RegisterImageToolbarButtonsOptions {
  onChangeImageClick: () => void
  onEditImageClick: () => void
}

function registerImageToolbarButtons(
  editor: Editor,
  selected: Model,
  { onChangeImageClick, onEditImageClick }: RegisterImageToolbarButtonsOptions
) {
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
      attributes: { class: 'fa fa-pencil image' },
      command: () => editor.runCommand('call-fn', { fn: onEditImageClick })
    },
    {
      name: CHANGE_IMAGE_TOOLBAR_BUTTON_NAME,
      attributes: { class: 'fa fa-image' },
      command: () => editor.runCommand('call-fn', { fn: onChangeImageClick })
    }
  )
}

interface RegisterMapToolbarButtonsOptions {
  onChangeThemeClick: (model: Model) => void
}

function registerMapToolbarButtons(
  editor: Editor,
  selected: Model,
  { onChangeThemeClick }: RegisterMapToolbarButtonsOptions
) {
  const isMapElement = isMap(selected)

  if (!isMapElement) {
    return
  }

  const toolbar: any[] = selected.get('toolbar')
  const hasMapButtons = hasToolbarMapButtons(selected)

  if (hasMapButtons) {
    return
  }

  toolbar.unshift({
    name: CHANGE_MAP_THEME_TOOLBAR_BUTTONS_PREFIX,
    attributes: { class: 'fa fa-pencil map' },
    command: () =>
      editor.runCommand('call-fn', {
        fn() {
          onChangeThemeClick(selected)
        }
      })
  })
}

type RegisterToolbarButtonsOptions = RegisterImageToolbarButtonsOptions &
  RegisterMapToolbarButtonsOptions

export function registerToolbarButtons(
  editor: Editor,
  options: RegisterToolbarButtonsOptions
) {
  editor.on('component:selected', (selected?: Model) => {
    if (!selected) {
      return
    }

    registerImageToolbarButtons(editor, selected, options)

    registerMapToolbarButtons(editor, selected, options)
  })
}
