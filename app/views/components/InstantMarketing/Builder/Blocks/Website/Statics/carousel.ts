import { Editor } from 'grapesjs'

import { BASICS_BLOCK_CATEGORY } from 'components/InstantMarketing/Builder/constants'

import CarouselIcon from 'assets/images/marketing/editor/blocks/carousel.png'

import registerBlock from '../../registerBlock'
import { baseView, isComponent } from '../utils'
import Carousel from './carousel.njk'

import script from './carousel-script'

const typeCarousel = 'carousel'
export const carouselBlockName = `${typeCarousel}-1`

export interface CarouselBlockOptions {
  carouselClassNames?: string
  carouselBlock?: string
}

export default (
  editor: Editor,
  { carouselClassNames, carouselBlock }: CarouselBlockOptions
) => {
  editor.DomComponents.addType(typeCarousel, {
    isComponent: isComponent(typeCarousel),
    model: {
      defaults: {
        name: 'Carousel',
        // droppable: `[data-gjs-type="${typeCarouselColumn}"]`
        // 'script-export': script,
        script
      }
    },
    view: { ...baseView(carouselClassNames) }
  })

  const gridColumnBlocks = {
    [carouselBlockName]: carouselBlock || Carousel
    // [gridColumn2BlockName]: gridColumn2Block || CarouselColumn2,
    // [gridColumn3BlockName]: gridColumn3Block || CarouselColumn3
  }

  registerBlock(editor, {
    label: 'Carousel',
    icon: CarouselIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: carouselBlockName,
    template: gridColumnBlocks[carouselBlockName]
  })

  // registerBlock(editor, {
  //   label: '2 Columns',
  //   icon: TwoColIcon,
  //   category: BASICS_BLOCK_CATEGORY,
  //   blockName: gridColumn2BlockName,
  //   template: gridColumnBlocks[gridColumn2BlockName]
  // })

  // registerBlock(editor, {
  //   label: '3 Columns',
  //   icon: ThreeColIcon,
  //   category: BASICS_BLOCK_CATEGORY,
  //   blockName: gridColumn3BlockName,
  //   template: gridColumnBlocks[gridColumn3BlockName]
  // })

  return gridColumnBlocks
}
