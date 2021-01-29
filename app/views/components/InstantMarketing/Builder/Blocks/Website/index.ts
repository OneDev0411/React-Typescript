import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../utils/get-template-render-data'
import { collapseBlockCategories } from '../Email/utils'

import registerStaticBlocks, {
  StaticBlocksOptions,
  staticBlocksTraits
} from './Statics'
import registerVideoBlock, { VideoBlockOptions } from './Video'
import registerImageBlock, { ImageBlockOptions } from './Image'
import registerAgentBlocks, { AgentBlocksOptions } from './Agents'
import registerArticleBlocks, { ArticleBlocksOptions } from './Articles'

interface BlocksOptions
  extends StaticBlocksOptions,
    VideoBlockOptions,
    ImageBlockOptions,
    AgentBlocksOptions,
    ArticleBlocksOptions {}

export const websiteBlocksTraits = {
  ...staticBlocksTraits
}

export function registerWebsiteBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  blocksOptions: BlocksOptions
) {
  registerStaticBlocks(editor, renderData, blocksOptions)

  const dynamicBlocks = {
    agent: registerAgentBlocks(editor, renderData, blocksOptions),
    image: registerImageBlock(editor, renderData, blocksOptions),
    video: registerVideoBlock(editor, renderData, blocksOptions),
    article: registerArticleBlocks(editor, renderData, blocksOptions)
  }

  // if (neighborhoods) {
  //   dynamicBlocks.neighborhoods = registerNeighborhoodsBlocks(
  //     editor,
  //     renderData,
  //     neighborhoods
  //   )
  // }

  // reorderBlocksWithCustomLabels(editor)
  collapseBlockCategories(editor)

  return dynamicBlocks
}
