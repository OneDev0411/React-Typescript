import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../utils/get-template-render-data'

import registerListingBlocks, {
  Options as ListingOptions,
  listingTopBlockName,
  listingGridBlockName,
  listingGridTwoBlockName,
  listingLeftBlockName,
  listingRightBlockName
} from './Listings'
import registerAgentBlocks, {
  Options as AgentOptions,
  agentLeftBlockName,
  agentGridBlockName,
  agentMultiBlockName
} from './Agents'
import registerStaticBlocks, {
  headline1BlockName,
  dividerBlockName,
  spacerBlockName,
  headline2BlockName
} from './Statics'
import registerImageBlock, {
  Options as ImageOptions,
  blockName as rechatImageBlockName
} from './Image'
import registerVideoBlock, { Options as ArticleOptions } from './Video'
import registerArticleBlock, {
  Options as VideoOptions,
  articleTopBlockName,
  articleLeftBlockName,
  articleRightBlockName
} from './Articles'
import registerNeighborhoodsBlocks, {
  Options as NeighborhoodsOptions,
  neighborhoodsBlockName,
  neighborhoodsGraphsBlockName
} from './Neighborhoods'
import { collapseBlockCategories, reorderBlocks } from '../utils'
import { BlockOptions, TemplateBlocks } from '../types'

interface Options {
  listing: ListingOptions
  agent: AgentOptions & BlockOptions
  image: ImageOptions
  video: VideoOptions
  article: ArticleOptions
  neighborhoods?: NeighborhoodsOptions
}

const BLOCK_BUTTONS_ORDER = [
  rechatImageBlockName,
  'rechat-video',
  'column-1',
  'column-2',
  'column-3',
  headline1BlockName,
  headline2BlockName,
  'text',
  dividerBlockName,
  spacerBlockName,
  'mj-button',
  'mj-social-group',

  articleTopBlockName,
  articleLeftBlockName,
  articleRightBlockName,

  listingTopBlockName,
  listingGridBlockName,
  listingGridTwoBlockName,
  listingLeftBlockName,
  listingRightBlockName,

  agentLeftBlockName,
  agentGridBlockName,
  agentMultiBlockName,

  neighborhoodsBlockName,
  neighborhoodsGraphsBlockName
]

export function registerEmailBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlocks: TemplateBlocks,
  { listing, agent, image, video, article, neighborhoods }: Options
) {
  const draggable =
    '[data-gjs-type=mj-column],[data-gjs-type=mj-wrapper],[data-gjs-type=mj-body]'

  editor.DomComponents.addType('mj-adaptive', {
    isComponent: el => el.tagName === 'MJ-ADAPTIVE',
    model: {
      defaults: {
        draggable,
        droppable: false
      }
    }
  })

  registerStaticBlocks(editor, renderData, templateBlocks)

  const dynamicBlocks: {
    listing: ReturnType<typeof registerListingBlocks>
    agent: ReturnType<typeof registerAgentBlocks>
    image: ReturnType<typeof registerImageBlock>
    video: ReturnType<typeof registerVideoBlock>
    article: ReturnType<typeof registerArticleBlock>
    neighborhoods?: ReturnType<typeof registerNeighborhoodsBlocks>
  } = {
    listing: registerListingBlocks(editor, renderData, templateBlocks, listing),
    agent: registerAgentBlocks(editor, renderData, templateBlocks, agent),
    image: registerImageBlock(editor, renderData, templateBlocks, image),
    video: registerVideoBlock(editor, renderData, templateBlocks, video),
    article: registerArticleBlock(editor, renderData, templateBlocks, article)
  }

  if (neighborhoods) {
    dynamicBlocks.neighborhoods = registerNeighborhoodsBlocks(
      editor,
      renderData,
      templateBlocks,
      neighborhoods
    )
  }

  reorderBlocks(editor, BLOCK_BUTTONS_ORDER)
  collapseBlockCategories(editor)

  return dynamicBlocks
}
