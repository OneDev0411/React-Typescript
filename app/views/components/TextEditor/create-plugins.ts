import { composeDecorators } from 'draft-js-plugins-editor'

import { createCollapsibleDecorator } from './block-decorators/create-collapsible-decorator'
import createIframePlugin from './plugins/draft-js-iframe-plugin'
import createPasteHtmlPlugin from './plugins/draft-js-paste-html'
import createTablePlugin from './plugins/draft-js-table-plugin'
import { getHtmlConversionOptions } from './utils/get-html-conversion-options'

export function createPlugins() {
  const iframePlugin = createIframePlugin({
    decorator: composeDecorators(
      createCollapsibleDecorator({ defaultCollapsed: true })
    )
  })

  const tablePlugin = createTablePlugin()

  const pasteHtmlPlugin = createPasteHtmlPlugin({
    stateFromHtmlOptions: editorState =>
      getHtmlConversionOptions(editorState).stateFromHtmlOptions
  })

  return {
    iframePlugin,
    tablePlugin,
    pasteHtmlPlugin
  }
}
