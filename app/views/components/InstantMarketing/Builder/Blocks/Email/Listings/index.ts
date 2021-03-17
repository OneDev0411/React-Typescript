import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import ArticleImageTopIcon from 'assets/images/marketing/editor/blocks/image-top.png'
import ArticleImageLeftIcon from 'assets/images/marketing/editor/blocks/image-left.png'
import ArticleImageRightIcon from 'assets/images/marketing/editor/blocks/image-right.png'
import DualIcon from 'assets/images/marketing/editor/blocks/dual.png'

import { isLeaseProperty } from 'utils/listing'

import { LISTINGS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'

import Top from './top.mjml'
import Right from './right.mjml'
import Left from './left.mjml'
import Grid from './grid.mjml'
import GridTwo from './grid-two.mjml'
import { handleBlockDragStopEvent } from '../../utils'

export const listingTopBlockName = 'rechat-listing-image-top'
export const listingLeftBlockName = 'rechat-listing-image-left'
export const listingRightBlockName = 'rechat-listing-image-right'
export const listingGridBlockName = 'rechat-listing-grid'
export const listingGridTwoBlockName = 'rechat-listing-grid-two'

const templates = {}

templates[listingTopBlockName] = Top
templates[listingLeftBlockName] = Left
templates[listingRightBlockName] = Right
templates[listingGridBlockName] = Grid
templates[listingGridTwoBlockName] = GridTwo

export interface Options {
  onDrop: (model: Model) => void
}

interface ListingBlock {
  selectHandler: (listings?: (IListing & { is_lease?: boolean })[]) => void
}

export default function registerBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  { onDrop }: Options
): ListingBlock {
  registerBlock(editor, {
    label: 'Image Top',
    icon: ArticleImageTopIcon,
    category: LISTINGS_BLOCK_CATEGORY,
    blockName: listingTopBlockName,
    template: templates[listingTopBlockName]
  })

  registerBlock(editor, {
    label: 'Grid',
    icon: DualIcon,
    category: LISTINGS_BLOCK_CATEGORY,
    blockName: listingGridBlockName,
    template: templates[listingGridBlockName]
  })

  registerBlock(editor, {
    label: 'Image Left',
    icon: ArticleImageLeftIcon,
    category: LISTINGS_BLOCK_CATEGORY,
    blockName: listingLeftBlockName,
    template: templates[listingLeftBlockName]
  })

  registerBlock(editor, {
    label: 'Aligned Grid',
    icon: DualIcon,
    category: LISTINGS_BLOCK_CATEGORY,
    blockName: listingGridTwoBlockName,
    template: templates[listingGridTwoBlockName]
  })

  registerBlock(editor, {
    label: 'Image Right',
    icon: ArticleImageRightIcon,
    category: LISTINGS_BLOCK_CATEGORY,
    blockName: listingRightBlockName,
    template: templates[listingRightBlockName]
  })

  return handleBlockDragStopEvent(
    editor,
    templates,
    (listings: (IListing & { is_lease?: boolean })[]) => ({
      ...renderData,
      listings: listings.map(listing => ({
        ...listing,
        is_lease: isLeaseProperty(listing)
      }))
    }),
    onDrop
  )
}
