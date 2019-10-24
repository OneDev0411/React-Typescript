import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'

import { TemplateRenderData } from '../../utils/get-template-render-data/index'

import { BlockOptions } from '../types'

import ArticleTop from './article-top.mjml'
import ArticleDual from './article-dual.mjml'
import ArticleLeft from './article-left.mjml'
import ArticleRight from './article-right.mjml'

const top = 'rechat-article-image-top'
const dual = 'rechat-article-image-dual'
const left = 'rechat-article-image-left'
const right = 'rechat-article-image-right'

const templates = {}

templates[top] = ArticleTop
templates[dual] = ArticleDual
templates[left] = ArticleLeft
templates[right] = ArticleRight

function registerListingBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  { label, category, blockName }: BlockOptions
): void {
  editor.BlockManager.add(blockName, {
    category,
    label,
    content: `<div data-block="${blockName}"></div>`
  })
}

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData
): void {
  registerListingBlock(editor, renderData, {
    label: 'Image Top',
    category: 'Article',
    blockName: top
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Dual',
    category: 'Article',
    blockName: dual
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Left',
    category: 'Article',
    blockName: left
  })

  registerListingBlock(editor, renderData, {
    label: 'Image Right',
    category: 'Article',
    blockName: right
  })

  editor.on('block:drag:stop', (model: Model, block) => {
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
