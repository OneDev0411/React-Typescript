import { composeDecorators } from 'draft-js-plugins-editor'

import createIframePlugin from './plugins/draft-js-iframe-plugin'
import { createCollapsibleDecorator } from './block-decorators/create-collapsible-decorator'
import createPasteHtmlPlugin from './plugins/draft-js-paste-html'
import { getHtmlConversionOptions } from './utils/get-html-conversion-options'

export function createPlugins() {
  const iframePlugin = createIframePlugin({
    decorator: composeDecorators(
      createCollapsibleDecorator({ defaultCollapsed: true })
    )
  })

  const pasteHtmlPlugin = createPasteHtmlPlugin({
    stateFromHtmlOptions: editorState =>
      getHtmlConversionOptions(editorState).stateFromHtmlOptions
  })

  return {
    iframePlugin,
    pasteHtmlPlugin
  }
}
