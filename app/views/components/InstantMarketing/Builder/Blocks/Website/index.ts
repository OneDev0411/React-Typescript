import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../utils/get-template-render-data'

import { reorderBlocks, collapseBlockCategories } from '../utils'

import registerStaticBlocks, {
  StaticBlocksOptions,
  staticBlocksTraits,
  gridColumn1BlockName,
  gridColumn2BlockName,
  gridColumn3BlockName,
  headline1BlockName,
  headline2BlockName,
  textBlockName,
  buttonBlockName,
  socialGroupBlockName
} from './Statics'
import registerVideoBlock, {
  VideoBlockOptions,
  embedVideoBlockName
} from './Video'
import registerImageBlock, { ImageBlockOptions, imageBlockName } from './Image'
import registerAgentBlocks, {
  AgentBlocksOptions,
  agentLeftBlockName,
  agentGridBlockName
} from './Agents'
import registerArticleBlocks, {
  ArticleBlocksOptions,
  articleTopBlockName,
  articleLeftBlockName,
  articleRightBlockName
} from './Articles'
import registerMatterportBlock, {
  MatterportBlockOptions,
  embedMatterportBlockName,
  matterportBlockTraits
} from './Matterport'
import registerMapBlock, { MapBlockOptions, embedMapBlockName } from './Map'
import registerCarouselBlock, {
  CarouselBlockOptions,
  carouselBlockName
} from './Carousel'

const BLOCK_BUTTONS_ORDER = [
  imageBlockName,
  embedVideoBlockName,
  embedMatterportBlockName,
  embedMapBlockName,
  carouselBlockName,
  gridColumn1BlockName,
  gridColumn2BlockName,
  gridColumn3BlockName,
  headline1BlockName,
  headline2BlockName,
  textBlockName,
  buttonBlockName,
  socialGroupBlockName,
  articleTopBlockName,
  articleLeftBlockName,
  articleRightBlockName,
  agentLeftBlockName,
  agentGridBlockName
]

interface BlocksOptions
  extends StaticBlocksOptions,
    VideoBlockOptions,
    ImageBlockOptions,
    AgentBlocksOptions,
    ArticleBlocksOptions,
    MatterportBlockOptions,
    MapBlockOptions,
    CarouselBlockOptions {}

export const websiteBlocksTraits = {
  ...staticBlocksTraits,
  ...matterportBlockTraits
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
    article: registerArticleBlocks(editor, renderData, blocksOptions),
    matterport: registerMatterportBlock(editor, renderData, blocksOptions),
    map: registerMapBlock(editor, renderData, blocksOptions),
    carousel: registerCarouselBlock(editor, renderData, blocksOptions)
  }

  reorderBlocks(editor, BLOCK_BUTTONS_ORDER)
  collapseBlockCategories(editor)

  return dynamicBlocks
}
