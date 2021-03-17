import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import { Metadata } from 'components/ArticleDrawer/types'

import ArticleTopIcon from 'assets/images/marketing/editor/blocks/image-top.png'
import ArticleLeftIcon from 'assets/images/marketing/editor/blocks/image-left.png'
import ArticleRightIcon from 'assets/images/marketing/editor/blocks/image-right.png'

import registerBlock from '../../registerBlock'
import { ARTICLES_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, isComponent } from '../utils'
import { handleBlockDragStopEvent } from '../../utils'

import ArticleTop from './article-top.njk'
import ArticleLeft from './article-left.njk'
import ArticleRight from './article-right.njk'

const typeArticle = 'article'

export const articleTopBlockName = `${typeArticle}-top`
export const articleLeftBlockName = `${typeArticle}-left`
export const articleRightBlockName = `${typeArticle}-right`

export interface ArticleBlocksOptions {
  articleClassNames?: string
  articleTopBlock?: string
  articleLeftBlock?: string
  articleRightBlock?: string
  onArticleDrop: (model: Model) => void
}

interface ArticleBlocks {
  selectHandler: (selectedArticle?: Metadata) => void
}

export default function registerArticleBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  {
    articleClassNames,
    articleTopBlock,
    articleLeftBlock,
    articleRightBlock,
    onArticleDrop
  }: ArticleBlocksOptions
): ArticleBlocks {
  editor.DomComponents.addType(typeArticle, {
    isComponent: isComponent(typeArticle),
    view: { ...baseView(articleClassNames) }
  })

  const articleBlocks = {
    [articleTopBlockName]: articleTopBlock || ArticleTop,
    [articleLeftBlockName]: articleLeftBlock || ArticleLeft,
    [articleRightBlockName]: articleRightBlock || ArticleRight
  }

  registerBlock(editor, {
    label: 'Image Top',
    category: ARTICLES_BLOCK_CATEGORY,
    icon: ArticleTopIcon,
    blockName: articleTopBlockName,
    template: articleBlocks[articleTopBlockName]
  })

  registerBlock(editor, {
    label: 'Image Left',
    category: ARTICLES_BLOCK_CATEGORY,
    icon: ArticleLeftIcon,
    blockName: articleLeftBlockName,
    template: articleBlocks[articleLeftBlockName]
  })

  registerBlock(editor, {
    label: 'Image Right',
    category: ARTICLES_BLOCK_CATEGORY,
    icon: ArticleRightIcon,
    blockName: articleRightBlockName,
    template: articleBlocks[articleRightBlockName]
  })

  return handleBlockDragStopEvent(
    editor,
    articleBlocks,
    (selectedArticle: Metadata) => ({
      ...renderData,
      description: selectedArticle.description,
      image: selectedArticle.image,
      title: selectedArticle.title,
      url: selectedArticle.url
    }),
    onArticleDrop
  )
}
