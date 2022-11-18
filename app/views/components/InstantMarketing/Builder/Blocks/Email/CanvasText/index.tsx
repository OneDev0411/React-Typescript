import { Model } from 'backbone'
import { Editor } from 'grapesjs'

import CanvasTextIcon from 'assets/images/marketing/editor/blocks/canvas-text.png'
import { TemplateRenderData } from 'components/InstantMarketing/Builder/utils/get-template-render-data'

import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { RegisterBlockSelectHandler, TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'
import { isComponent } from '../../Website/utils'

import template from './template.mjml'

export const canvasTextBlockName = 'canvas-text'

interface CanvasText {
  image: string
}

interface UpdateEvent {
  image: string
  alt: string
  width: number
  height: number
}

export interface Options {
  canvasTextClassNames: string
  onDrop: (model: Model) => void
  onInit: (model: Model) => void
}

export default function registerCanvasTextBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { onDrop, onInit }: Options
): RegisterBlockSelectHandler<CanvasText> {
  // create a new type for canvas-text
  editor.DomComponents.addType(canvasTextBlockName, {
    isComponent: isComponent(canvasTextBlockName),
    extend: 'mj-image',
    model: {
      defaults: {},
      init() {
        onInit(this)
      }
    },
    view: {
      init({ model }) {
        this.listenTo(model, 'canvas-text:update', this.update)
      },
      update(data: UpdateEvent) {
        this.model.setAttributes({
          src: data.image,
          alt: data.alt,
          width: data.width,
          height: data.height
        })

        this.rerender()
      },
      events: {
        click() {
          console.log('>>> CLICKED <<<')
        }
      }
    }
  })

  const canvasTextBlocks = {
    [canvasTextBlockName]:
      templateBlockOptions.blocks[canvasTextBlockName]?.template || template
  }

  registerBlock(
    editor,
    {
      label: 'Fancy Text',
      icon: CanvasTextIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: canvasTextBlockName,
      template,
      adaptive: true
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'CanvasText',
    canvasTextBlocks,
    templateBlockOptions.blocks
  )

  return handleBlockDragStopEvent<CanvasText, {}>(
    editor,
    allBlocks,
    data => ({
      ...renderData,
      ...data
    }),
    onDrop
  )
}
