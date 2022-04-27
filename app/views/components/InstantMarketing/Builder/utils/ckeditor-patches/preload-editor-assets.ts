import { Editor } from 'grapesjs'

type CKEditor = any

/**
 * Preload CKEditor assets and plugins to make it faster on first RTE instance.
 *
 * I found no simple solution to preloading CKEditor assets, so this code will
 * create an instance of CKEditor and keep it alive until the user clicks
 * somewhere in the canvas and a real RTE is created.
 *
 * This is important because If you remove the CKEditor instance immediately,
 * CKEditor removes its injected styles, and those are needed to render a proper
 * UI for some plugins, including placeholders.
 */
export function preloadEditorAssets(
  editor: Editor,
  createCKEditorInstance: (el: HTMLElement) => CKEditor
) {
  let preloadInstance: Nullable<CKEditor> = null

  const destroyPreloadInstance = () => {
    if (!preloadInstance) {
      return
    }

    preloadInstance.destroy()
    preloadInstance = null
  }

  const initializePreloadInstance = () => {
    const wrapperEl = editor.getWrapper().view.el

    const tempDivEl = document.createElement('div')

    wrapperEl.appendChild(tempDivEl)

    preloadInstance = createCKEditorInstance(tempDivEl)

    preloadInstance.on('instanceReady', () => {
      tempDivEl.remove()
    })
  }

  // Create a new instance and add the required styles to the new loaded template
  editor.on('editor:template:loaded', () => {
    destroyPreloadInstance()
    initializePreloadInstance()
  })

  // Cleanup the instance before editor gets unloaded
  editor.on('editor:unload', destroyPreloadInstance)

  // Cleanup the instance if a rte enabled by user
  editor.on('rte:enable', destroyPreloadInstance)
}
