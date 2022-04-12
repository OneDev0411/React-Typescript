/**
 * Preload CKEditor assets and plugins to make it faster on first RTE instance
 */
export function preloadEditorAssets(
  createEditorInstance: (el: HTMLElement) => any
) {
  // @ts-ignore
  if (CKEDITOR.PRELOAD_EDITOR_ASSETS) {
    return
  }

  // @ts-ignore
  CKEDITOR.PRELOAD_EDITOR_ASSETS = true

  // I found no simple solution to preload CKEditor assets, so this code will create
  // an instance of CKEditor and destroy it immediately when the assets were loaded.
  const tempDivEl = document.createElement('div')
  const tempInstance = createEditorInstance(tempDivEl)

  tempInstance.on('instanceReady', () => {
    tempInstance.destroy()
    tempDivEl.remove()
  })
}
