import { Editor } from 'grapesjs'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../utils/get-template-render-data/index'

import { ARTICLES_BLOCK_CATEGORY, BASICS_BLOCK_CATEGORY } from '../../constants'
import { BlockOptions } from '../types'

import ArticleTop from './article-top.mjml'
import ArticleDual from './article-dual.mjml'
import ArticleLeft from './article-left.mjml'
import ArticleRight from './article-right.mjml'
import SingleImage from './image-single.mjml'

const article_top = 'article-image-top'
const article_dual = 'article-image-dual'
const article_left = 'article-image-left'
const article_right = 'article-image-right'
const image_single = 'image-single'

const templates = {}

templates[article_top] = ArticleTop
templates[article_dual] = ArticleDual
templates[article_left] = ArticleLeft
templates[article_right] = ArticleRight

templates[image_single] = SingleImage

function registerListingBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  { label, category, blockName, attributes }: BlockOptions
): void {
  editor.BlockManager.add(blockName, {
    category,
    label,
    attributes,
    content: `<div data-block="${blockName}"></div>`
  })
}

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData
): void {
  registerListingBlock(editor, renderData, {
    label: 'Image Top',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: article_top
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Dual',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: article_dual
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Left',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: article_left
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Right',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: article_right
  })

  registerListingBlock(editor, renderData, {
    label: 'Image',
    category: BASICS_BLOCK_CATEGORY,
    blockName: image_single,
    attributes: { class: 'fa fa-image' }
  })

  editor.on('block:drag:stop', (model: any, block: any) => {
    if (!model) {
      return
    }

    if (!templates[block.id]) {
      return
    }

    const template = templates[model.attributes.attributes['data-block']]

    const mjml = nunjucks.renderString(template, {
      ...renderData
    })

    model.parent().append(mjml, { at: model.opt.at })

    model.remove()
  })
}
