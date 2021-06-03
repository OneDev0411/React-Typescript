import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import ImageIcon from 'assets/images/marketing/editor/blocks/listing-image.png'
import ImageTopIcon from 'assets/images/marketing/editor/blocks/image-top.png'
import ImageLeftIcon from 'assets/images/marketing/editor/blocks/image-left.png'
import ImageRightIcon from 'assets/images/marketing/editor/blocks/image-right.png'
import DualIcon from 'assets/images/marketing/editor/blocks/dual.png'

import { isLeaseProperty } from 'utils/listing'

import {
  BASICS_BLOCK_CATEGORY,
  LISTINGS_BLOCK_CATEGORY
} from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { adaptTemplates } from '../utils'

import Image from './image.mjml'
import Top from './top.mjml'
import Right from './right.mjml'
import Left from './left.mjml'
import Grid from './grid.mjml'
import GridTwo from './grid-two.mjml'
import { handleBlockDragStopEvent } from '../../utils'
import { TemplateBlockOptions } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

export const listingImageBlockName = 'rechat-listing-image'
export const listingTopBlockName = 'rechat-listing-image-top'
export const listingLeftBlockName = 'rechat-listing-image-left'
export const listingRightBlockName = 'rechat-listing-image-right'
export const listingGridBlockName = 'rechat-listing-grid'
export const listingGridTwoBlockName = 'rechat-listing-grid-two'

export interface Options {
  onDrop: (model: Model) => void
}

interface ListingBlock {
  selectHandler: (listings?: (IListing & { is_lease?: boolean })[]) => void
}

export default function registerBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { onDrop }: Options
): ListingBlock {
  const listingBlocks = {
    [listingImageBlockName]:
      templateBlockOptions.blocks[listingImageBlockName]?.template || Image,
    [listingTopBlockName]:
      templateBlockOptions.blocks[listingTopBlockName]?.template || Top,
    [listingLeftBlockName]:
      templateBlockOptions.blocks[listingLeftBlockName]?.template || Left,
    [listingRightBlockName]:
      templateBlockOptions.blocks[listingRightBlockName]?.template || Right,
    [listingGridBlockName]:
      templateBlockOptions.blocks[listingGridBlockName]?.template || Grid,
    [listingGridTwoBlockName]:
      templateBlockOptions.blocks[listingGridTwoBlockName]?.template || GridTwo
  }

  registerBlock(
    editor,
    {
      label: 'Listing Image',
      icon: ImageIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: listingImageBlockName,
      template: listingBlocks[listingImageBlockName],
      adaptive: true
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Image Top',
      icon: ImageTopIcon,
      category: LISTINGS_BLOCK_CATEGORY,
      blockName: listingTopBlockName,
      template: listingBlocks[listingTopBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Grid',
      icon: DualIcon,
      category: LISTINGS_BLOCK_CATEGORY,
      blockName: listingGridBlockName,
      template: listingBlocks[listingGridBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Image Left',
      icon: ImageLeftIcon,
      category: LISTINGS_BLOCK_CATEGORY,
      blockName: listingLeftBlockName,
      template: listingBlocks[listingLeftBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Aligned Grid',
      icon: DualIcon,
      category: LISTINGS_BLOCK_CATEGORY,
      blockName: listingGridTwoBlockName,
      template: listingBlocks[listingGridTwoBlockName]
    },
    templateBlockOptions
  )

  registerBlock(
    editor,
    {
      label: 'Image Right',
      icon: ImageRightIcon,
      category: LISTINGS_BLOCK_CATEGORY,
      blockName: listingRightBlockName,
      template: listingBlocks[listingRightBlockName]
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Listings',
    listingBlocks,
    templateBlockOptions.blocks
  )

  return handleBlockDragStopEvent(
    editor,
    adaptTemplates(allBlocks),
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
