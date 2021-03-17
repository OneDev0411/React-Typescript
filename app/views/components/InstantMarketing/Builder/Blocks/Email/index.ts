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
} from './Article'
import registerNeighborhoodsBlocks, {
  Options as NeighborhoodsOptions,
  neighborhoodsBlockName,
  neighborhoodsGraphsBlockName
} from './Neighborhoods'
import { collapseBlockCategories, reorderBlocks } from '../utils'
import { BlockOptions } from '../types'

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

  registerStaticBlocks(editor, renderData)

  const dynamicBlocks: {
    listing: ReturnType<typeof registerListingBlocks>
    agent: ReturnType<typeof registerAgentBlocks>
    image: ReturnType<typeof registerImageBlock>
    video: ReturnType<typeof registerVideoBlock>
    article: ReturnType<typeof registerArticleBlock>
    neighborhoods?: ReturnType<typeof registerNeighborhoodsBlocks>
  } = {
    listing: registerListingBlocks(editor, renderData, listing),
    agent: registerAgentBlocks(editor, renderData, agent),
    image: registerImageBlock(editor, renderData, image),
    video: registerVideoBlock(editor, renderData, video),
    article: registerArticleBlock(editor, renderData, article)
  }

  if (neighborhoods) {
    dynamicBlocks.neighborhoods = registerNeighborhoodsBlocks(
      editor,
      renderData,
      neighborhoods
    )
  }

  reorderBlocks(editor, BLOCK_BUTTONS_ORDER)
  collapseBlockCategories(editor)

  return dynamicBlocks
}
