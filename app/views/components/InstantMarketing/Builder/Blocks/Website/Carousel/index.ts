import { Model } from 'backbone'
import { Editor } from 'grapesjs'
import {
  isUndefined,
  isFunction,
  isObject,
  isBoolean,
  isString
} from 'underscore'

import CarouselIcon from 'assets/images/marketing/editor/blocks/carousel.png'
import { BASICS_BLOCK_CATEGORY } from 'components/InstantMarketing/Builder/constants'
import { TemplateRenderData } from 'components/InstantMarketing/Builder/utils/get-template-render-data'

import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { TemplateBlockOptions, RegisterBlockSelectHandler } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'
import { baseView, isComponent } from '../utils'

import script from './script'
import Carousel from './template.njk'

export const typeCarousel = 'carousel'
const typeCarouselTrack = `${typeCarousel}-track`
const typeCarouselList = `${typeCarousel}-list`
const typeCarouselSlide = `${typeCarousel}-slide`
const typeCarouselImage = `${typeCarousel}-image`

export const carouselBlockName = typeCarousel

interface CarouselRenderData {
  images: string[]
}

export interface CarouselBlockOptions {
  carouselClassNames?: string
  onCarouselDoubleClick: (model: Model) => void
  onCarouselDrop: (model: Model) => void
}

export default function registerCarouselBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  {
    carouselClassNames,
    onCarouselDrop,
    onCarouselDoubleClick
  }: CarouselBlockOptions
): RegisterBlockSelectHandler<string[]> {
  const DefaultComponent = editor.DomComponents.getType('default')
  const DefaultModel = DefaultComponent!.model

  editor.DomComponents.addType(typeCarousel, {
    isComponent: isComponent(typeCarousel, el => ({
      images: Array.from(el.querySelectorAll('img')).map(img => img.src)
    })),
    model: {
      defaults: {
        name: 'Image Slider',
        droppable: false,
        script,
        'script-props': ['heightRatio'],
        heightRatio: 0.5
      },
      initialize(...args: any[]) {
        const attrs = this.getAttributes()
        const heightRatioAttr = parseFloat(attrs['data-height-ratio'])

        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(heightRatioAttr)) {
          this.set('heightRatio', heightRatioAttr)
        }

        DefaultModel.prototype.initialize.apply(this, args)
      },
      /**
       * Borrowed this method from Component.js to generate the
       * required code using the updated images prop
       */
      toHTML(opts: any = {}) {
        const model = this
        const attrs: string[] = []
        const customTag = opts.tag
        const tag = customTag || model.get('tagName')
        const sTag = model.get('void')
        const customAttr = opts.attributes
        let attributes = this.getAttrToHTML()

        delete opts.tag

        // Get custom attributes if requested
        if (customAttr) {
          if (isFunction(customAttr)) {
            attributes = customAttr(model, attributes) || {}
          } else if (isObject(customAttr)) {
            attributes = customAttr
          }
        }

        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (let attr in attributes) {
          const val = attributes[attr]
          const value = isString(val) ? val.replace(/"/g, '&quot;') : val

          if (!isUndefined(value)) {
            if (isBoolean(value)) {
              value && attrs.push(attr)
            } else {
              attrs.push(`${attr}="${value}"`)
            }
          }
        }

        const comps = model.get('components')
        const content = !comps.length ? model.get('content') : ''
        const attrString = attrs.length ? ` ${attrs.join(' ')}` : ''
        let code = `<${tag}${attrString}${sTag ? '/' : ''}>${content}`

        code += `
          <div data-type="carousel-track" class="splide__track">
          <ul data-type="carousel-list" class="splide__list">
        `

        code += model
          .get('images')
          .map(
            image =>
              `
                <li data-type="carousel-slide" class="splide__slide">
                  <img data-type="carousel-image" 
                    class="splide__image"
                    src="${image}"/>
                </li>
              `
          )
          .join('')

        code += `
          </ul>
        </div>
        `

        !sTag && (code += `</${tag}>`)

        return code
      }
    },
    view: {
      events: {
        dblclick(event): void {
          if (event.target.classList.contains('splide__image')) {
            onCarouselDoubleClick(this.model)
          }
        }
      },
      ...baseView(carouselClassNames),
      init(...args) {
        baseView(carouselClassNames).init.apply(this, args)

        this.el.addEventListener('splide:init', (event: CustomEvent) => {
          this.splideInstance = event.detail.splide
        })

        this.el.addEventListener('lightbox:show', this.hideToolbar)
        this.el.addEventListener('lightbox:hide', this.showToolbar)

        this.listenTo(this.model, 'change:images', this.handleImagesChange)
      },
      hideToolbar() {
        editor.Canvas.getToolbarEl().style.display = 'none'
      },
      showToolbar() {
        editor.Canvas.getToolbarEl().style.display = 'block'
      },
      handleImagesChange() {
        if (!this.splideInstance) {
          return
        }

        while (this.splideInstance.length) {
          this.splideInstance.remove(this.splideInstance.length - 1)
        }

        this.model.get('images').forEach(image => {
          this.splideInstance.add(
            `<li data-type="carousel-slide"
               class="splide__slide">
                <img data-type="carousel-image"
                   class="splide__image"
                  src="${image}"/>
              </li>`
          )
        })
      },
      removed() {
        delete this.splideInstance
      }
    }
  })

  const ReadonlyModel = {
    defaults: {
      droppable: false,
      draggable: false,
      selectable: false,
      hoverable: false
    }
  }

  editor.DomComponents.addType(typeCarouselTrack, {
    isComponent: isComponent(typeCarouselTrack),
    model: ReadonlyModel
  })

  editor.DomComponents.addType(typeCarouselList, {
    isComponent: isComponent(typeCarouselList),
    model: ReadonlyModel
  })

  editor.DomComponents.addType(typeCarouselSlide, {
    isComponent: isComponent(typeCarouselSlide),
    model: ReadonlyModel
  })

  editor.DomComponents.addType(typeCarouselImage, {
    isComponent: isComponent(typeCarouselImage),
    model: ReadonlyModel
  })

  const carouselBlocks = {
    [carouselBlockName]:
      templateBlockOptions.blocks[carouselBlockName]?.template || Carousel
  }

  registerBlock(
    editor,
    {
      label: 'Image Slider',
      icon: CarouselIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: carouselBlockName,
      template: carouselBlocks[carouselBlockName]
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Carousel',
    carouselBlocks,
    templateBlockOptions.blocks
  )

  return handleBlockDragStopEvent<string[], CarouselRenderData>(
    editor,
    allBlocks,
    selectedImages => ({
      ...renderData,
      images: selectedImages
    }),
    onCarouselDrop
  )
}
