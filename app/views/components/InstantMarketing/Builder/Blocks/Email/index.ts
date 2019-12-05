import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../utils/get-template-render-data/index'

import registerListingBlocks, { Options as ListingOptions } from './Listings'
import registerAgentBlocks, { Options as AgentOptions } from './Agents'
import registerStaticBlocks from './Statics'
import registerImageBlock, { Options as ImageOptions } from './Image'
import registerGifBlock, { Options as GifOptions } from './Gif'
import registerVideoBlock, { Options as ArticleOptions } from './Video'
import registerArticleBlock, { Options as VideoOptions } from './Article'
import { reorderBlocksWithCustomLabels, collapseBlockCategories } from './utils'
import { BlockOptions } from '../types'

interface Options {
  listing: ListingOptions
  agent: AgentOptions & BlockOptions
  image: ImageOptions
  gif: GifOptions
  video: VideoOptions
  article: ArticleOptions
}

export function registerEmailBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  { listing, agent, image, gif, video, article }: Options
) {
  const draggable =
    '[data-gjs-type=mj-column],[data-gjs-type=mj-wrapper],[data-gjs-type=mj-section]'

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

  const dynamicBlocks = {
    listing: registerListingBlocks(editor, renderData, listing),
    agent: registerAgentBlocks(editor, renderData, agent),
    image: registerImageBlock(editor, image),
    gif: registerGifBlock(editor, gif),
    video: registerVideoBlock(editor, renderData, video),
    article: registerArticleBlock(editor, renderData, article)
  }

  reorderBlocksWithCustomLabels(editor)
  collapseBlockCategories(editor)

  return dynamicBlocks
}
