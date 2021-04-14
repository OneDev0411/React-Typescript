import type { Editor } from 'grapesjs'

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
  embedMatterportBlockName
} from './Matterport'
import registerMapBlock, { MapBlockOptions, embedMapBlockName } from './Map'
import registerCarouselBlock, {
  CarouselBlockOptions,
  carouselBlockName
} from './Carousel'
import { TemplateBlockOptions } from '../types'

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
  ...staticBlocksTraits
}

export function registerWebsiteBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  blocksOptions: BlocksOptions
) {
  registerStaticBlocks(editor, renderData, templateBlockOptions, blocksOptions)

  const dynamicBlocks = {
    agent: registerAgentBlocks(
      editor,
      renderData,
      templateBlockOptions,
      blocksOptions
    ),
    image: registerImageBlock(
      editor,
      renderData,
      templateBlockOptions,
      blocksOptions
    ),
    video: registerVideoBlock(
      editor,
      renderData,
      templateBlockOptions,
      blocksOptions
    ),
    article: registerArticleBlocks(
      editor,
      renderData,
      templateBlockOptions,
      blocksOptions
    ),
    matterport: registerMatterportBlock(
      editor,
      renderData,
      templateBlockOptions,
      blocksOptions
    ),
    map: registerMapBlock(
      editor,
      renderData,
      templateBlockOptions,
      blocksOptions
    ),
    carousel: registerCarouselBlock(
      editor,
      renderData,
      templateBlockOptions,
      blocksOptions
    )
  }

  reorderBlocks(editor, BLOCK_BUTTONS_ORDER)
  collapseBlockCategories(editor)

  return dynamicBlocks
}
