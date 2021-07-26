import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../utils/get-template-render-data'
import { BlockOptions, TemplateBlockOptions } from '../types'
import { collapseBlockCategories, reorderBlocks } from '../utils'

import registerAgentBlocks, {
  Options as AgentOptions,
  agentLeftBlockName,
  agentGridBlockName,
  agentMultiBlockName
} from './Agents'
import registerArticleBlock, {
  Options as VideoOptions,
  articleTopBlockName,
  articleLeftBlockName,
  articleRightBlockName
} from './Articles'
import registerImageBlock, {
  Options as ImageOptions,
  blockName as rechatImageBlockName
} from './Image'
import registerListingBlocks, {
  Options as ListingOptions,
  listingImageBlockName,
  listingTopBlockName,
  listingGridBlockName,
  listingGridTwoBlockName,
  listingLeftBlockName,
  listingRightBlockName
} from './Listings'
import registerNeighborhoodsBlocks, {
  Options as NeighborhoodsOptions,
  neighborhoodsBlockName,
  neighborhoodsGraphsBlockName
} from './Neighborhoods'
import registerStaticBlocks, {
  headline1BlockName,
  dividerBlockName,
  spacerBlockName,
  headline2BlockName
} from './Statics'
import registerVideoBlock, { Options as ArticleOptions } from './Video'

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
  listingImageBlockName,
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
  templateBlockOptions: TemplateBlockOptions,
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

  registerStaticBlocks(editor, renderData, templateBlockOptions)

  const dynamicBlocks: {
    listing: ReturnType<typeof registerListingBlocks>
    agent: ReturnType<typeof registerAgentBlocks>
    image: ReturnType<typeof registerImageBlock>
    video: ReturnType<typeof registerVideoBlock>
    article: ReturnType<typeof registerArticleBlock>
    neighborhoods?: ReturnType<typeof registerNeighborhoodsBlocks>
  } = {
    listing: registerListingBlocks(
      editor,
      renderData,
      templateBlockOptions,
      listing
    ),
    agent: registerAgentBlocks(editor, renderData, templateBlockOptions, agent),
    image: registerImageBlock(editor, renderData, templateBlockOptions, image),
    video: registerVideoBlock(editor, renderData, templateBlockOptions, video),
    article: registerArticleBlock(
      editor,
      renderData,
      templateBlockOptions,
      article
    )
  }

  if (neighborhoods) {
    dynamicBlocks.neighborhoods = registerNeighborhoodsBlocks(
      editor,
      renderData,
      templateBlockOptions,
      neighborhoods
    )
  }

  reorderBlocks(editor, BLOCK_BUTTONS_ORDER)
  collapseBlockCategories(editor)

  return dynamicBlocks
}
