import { Editor } from 'grapesjs'

import { Model } from 'backbone'

import { BASICS_BLOCK_CATEGORY } from 'components/InstantMarketing/Builder/constants'

import CarouselIcon from 'assets/images/marketing/editor/blocks/carousel.png'
import CarouselImageIcon from 'assets/images/marketing/editor/blocks/image.png'

import { TemplateRenderData } from 'components/InstantMarketing/Builder/utils/get-template-render-data'

import { Image } from 'components/ImageDrawer/types'

import registerBlock from '../../registerBlock'
import { baseView, handleBlockDragStopEvent, isComponent } from '../utils'
import Carousel from './carousel.njk'
import CarouselImage from './carousel-image.njk'

import script from './script'
import { applyStyle, carouselBaseView } from './helpers'

const typeCarousel = 'carousel'
const typeCarouselTrack = `${typeCarousel}-track`
const typeCarouselList = `${typeCarousel}-list`
const typeCarouselSlide = `${typeCarousel}-slide`
const typeCarouselImage = `${typeCarousel}-image`

export const carouselBlockName = typeCarousel
export const carouselImageBlockName = typeCarouselSlide

export interface CarouselBlockOptions {
  carouselClassNames?: string
  carouselBlock?: string
  carouselSlideBlock?: string
  onCarouselImageDrop: (model: Model) => void
}

interface CarouselBlock {
  selectHandler: (selectedImage?: Image) => void
}

export default function registerCarouselBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  {
    carouselClassNames,
    carouselBlock,
    carouselSlideBlock,
    onCarouselImageDrop
  }: CarouselBlockOptions
): CarouselBlock {
  editor.DomComponents.addType(typeCarousel, {
    isComponent: isComponent(typeCarousel),
    model: {
      defaults: {
        name: 'Carousel',
        droppable: false,
        'script-export': script
      }
    },
    view: {
      ...baseView(carouselClassNames),
      onRender() {
        carouselBaseView.onRender.apply(this)

        applyStyle(this.el, {
          padding: '12px',
          backgroundColor: 'rgba(0,0,0,0.1)'
        })
      }
    }
  })

  editor.DomComponents.addType(typeCarouselTrack, {
    isComponent: isComponent(typeCarouselTrack),
    model: {
      defaults: {
        name: 'Carousel Track',
        droppable: false,
        draggable: false,
        selectable: false,
        hoverable: false
      }
    },
    view: { ...carouselBaseView }
  })

  editor.DomComponents.addType(typeCarouselList, {
    isComponent: isComponent(typeCarouselList),
    model: {
      defaults: {
        name: 'Carousel List',
        droppable: `[data-gjs-type="${typeCarouselSlide}"]`,
        draggable: false,
        selectable: false,
        hoverable: false
      }
    },
    view: {
      ...carouselBaseView,
      onRender() {
        carouselBaseView.onRender.apply(this)

        applyStyle(this.el, {
          listStyleType: 'none',
          padding: '0',
          margin: '0',
          minHeight: '150px'
        })
      }
    }
  })

  editor.DomComponents.addType(typeCarouselSlide, {
    isComponent: isComponent(typeCarouselSlide),
    model: {
      defaults: {
        name: 'Carousel Slide',
        droppable: false,
        draggable: `[data-gjs-type="${typeCarouselList}"]`
      }
    },
    view: {
      ...carouselBaseView,
      onRender() {
        carouselBaseView.onRender.apply(this)

        applyStyle(this.el, {
          display: 'inline-block',
          width: 'calc(20% - 8px)',
          overflow: 'hidden',
          position: 'relative',
          margin: '4px',
          border: '1px solid lightgray'
        })

        const aspectRatioEl = document.createElement('div')

        aspectRatioEl.style.paddingTop = '75%'

        this.el.appendChild(aspectRatioEl)
      }
    }
  })

  editor.DomComponents.addType(typeCarouselImage, {
    isComponent: isComponent(typeCarouselImage),
    model: {
      defaults: {
        name: 'Carousel Image',
        droppable: false,
        draggable: false,
        selectable: false,
        hoverable: false
      }
    },
    view: {
      ...carouselBaseView,
      onRender() {
        carouselBaseView.onRender.apply(this)

        applyStyle(this.el, {
          position: 'absolute',
          width: '100%',
          height: '100%'
        })
      }
    }
  })

  const carouselBlocks = {
    [carouselBlockName]: carouselBlock || Carousel,
    [carouselImageBlockName]: carouselSlideBlock || CarouselImage
  }

  registerBlock(editor, {
    label: 'Carousel',
    icon: CarouselIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: carouselBlockName,
    template: carouselBlocks[carouselBlockName]
  })

  registerBlock(editor, {
    label: 'Carousel Image',
    icon: CarouselImageIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: carouselImageBlockName,
    template: carouselBlocks[carouselImageBlockName]
  })

  handleBlockDragStopEvent(
    editor,
    {
      [carouselBlockName]: carouselBlocks[carouselBlockName]
    },
    renderData
  )

  return handleBlockDragStopEvent(
    editor,
    {
      [carouselImageBlockName]: carouselBlocks[carouselImageBlockName]
    },
    (selectedImage: Image) => ({
      ...renderData,
      image: selectedImage
    }),
    onCarouselImageDrop
  )
}
