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

interface BlocksOptions
  extends StaticBlocksOptions,
    VideoBlockOptions,
    ImageBlockOptions,
    AgentBlocksOptions {}

export const websiteBlocksTraits = {
  ...staticBlocksTraits
}

export function registerWebsiteBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  blocksOptions: BlocksOptions
) {
  registerStaticBlocks(editor, renderData, blocksOptions)

  const dynamicBlocks =
    // : {
    // listing: ReturnType<typeof registerListingBlocks>
    // agent: ReturnType<typeof registerAgentBlocks>
    // image: ReturnType<typeof registerImageBlock>
    // gif: ReturnType<typeof registerGifBlock>
    // video: ReturnType<typeof registerVideoBlock>
    // article: ReturnType<typeof registerArticleBlock>
    // neighborhoods?: ReturnType<typeof registerNeighborhoodsBlocks>
    // }
    {
      // listing: registerListingBlocks(editor, renderData, listing),
      agent: registerAgentBlocks(editor, renderData, blocksOptions),
      image: registerImageBlock(editor, renderData, blocksOptions),
      // gif: registerGifBlock(editor, gif),
      video: registerVideoBlock(editor, renderData, blocksOptions)
      // article: registerArticleBlock(editor, renderData, article)
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
