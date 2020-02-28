import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { Metadata } from 'components/ArticleDrawer/types'

import registerBlock from '../../registerBlock'
import { ARTICLES_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import ArticleTop from './templates/article-top.mjml'
import ArticleLeft from './templates/article-left.mjml'
import ArticleRight from './templates/article-right.mjml'

import {
  articleTopBlockName,
  articleLeftBlockName,
  articleRightBlockName
} from './constants'

const templates = {}

templates[articleTopBlockName] = ArticleTop
templates[articleLeftBlockName] = ArticleLeft
templates[articleRightBlockName] = ArticleRight

const blocksName = [
  articleTopBlockName,
  articleLeftBlockName,
  articleRightBlockName
]

export interface Options {
  onDrop: (model: Model) => void
}

interface ArticleBlock {
  selectHandler: (selectedArticle?: Metadata) => void
}

export default function registerArticleBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  { onDrop }: Options
): ArticleBlock {
  registerBlock(editor, {
    label: 'Image Top',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: articleTopBlockName,
    template: templates[articleTopBlockName]
  })

  registerBlock(editor, {
    label: 'Image Left',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: articleLeftBlockName,
    template: templates[articleLeftBlockName]
  })

  registerBlock(editor, {
    label: 'Image Right',
    category: ARTICLES_BLOCK_CATEGORY,
    blockName: articleRightBlockName,
    template: templates[articleRightBlockName]
  })

  let modelHandle: any

  const selectHandler = (selectedArticle?: Metadata) => {
    if (!modelHandle) {
      return
    }

    const template = templates[modelHandle.attributes.attributes['data-block']]

    if (selectedArticle) {
      const mjml = nunjucks.renderString(template, {
        ...renderData,
        description: selectedArticle.description,
        image: selectedArticle.image,
        title: selectedArticle.title,
        url: selectedArticle.url
      })

      modelHandle.parent().append(mjml, { at: modelHandle.opt.at })
    }

    modelHandle.remove()
  }

  editor.on('block:drag:stop', (model: Model, block: any) => {
    if (!model) {
      return
    }

    if (blocksName.includes(block.id)) {
      modelHandle = model
      onDrop(model)
    }
  })

  return {
    selectHandler
  }
}
