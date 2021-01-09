import { Editor } from 'grapesjs'

const IMAGE_TOOLBAR_BUTTONS_PREFIX = 'rechat'
const EDIT_IMAGE_TOOLBAR_BUTTON_NAME = `${IMAGE_TOOLBAR_BUTTONS_PREFIX}-image-edit`
const CHANGE_IMAGE_TOOLBAR_BUTTON_NAME = `${IMAGE_TOOLBAR_BUTTONS_PREFIX}-image-change`

export function registerToolbarButtons(
  editor: Editor,
  onChangeImageClick: () => void,
  onEditImageClick: () => void
) {
  editor.on('component:selected', selected => {
    if (!selected) {
      return
    }

    const selectedType = selected.get('type')
    const isImageElement =
      selectedType === 'image' ||
      selectedType === 'mj-image' ||
      selectedType === 'mj-carousel-image'

    if (!isImageElement) {
      return
    }

    const toolbar: any[] = selected.get('toolbar')
    const hasImageButtons = toolbar.some(
      item => item.name && item.name.startsWith(IMAGE_TOOLBAR_BUTTONS_PREFIX)
    )

    if (hasImageButtons) {
      return
    }

    toolbar.unshift(
      {
        name: EDIT_IMAGE_TOOLBAR_BUTTON_NAME,
        // label: 'Edit Photo',
        // attributes: { class: '', style: 'width:auto;' },
        attributes: { class: 'fa fa-edit', title: 'Edit Photo' },
        command: () => editor.runCommand('call-fn', { fn: onEditImageClick })
      },
      {
        name: CHANGE_IMAGE_TOOLBAR_BUTTON_NAME,
        // label: 'Change Photo',
        // attributes: { class: '', style: 'width:auto;' },
        attributes: { class: 'fa fa-image', title: 'Change Photo' },
        command: () => editor.runCommand('call-fn', { fn: onChangeImageClick })
      }
    )
  })
}
