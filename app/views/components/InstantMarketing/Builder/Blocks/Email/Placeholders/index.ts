import { Editor } from 'grapesjs'

import SenderLeftIcon from 'assets/images/marketing/editor/blocks/agent-left.png'

import { PLACEHOLDER_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'

import { isMJImagePlaceholderComponent } from './helpers'
import SenderLeft from './sender-left.mjml'

export const senderLeftBlockName = 'sender-left'
export const typeImagePlaceholder = 'mj-image-placeholder'

export interface PlaceholderOptions {
  hasSenderBlocks: boolean
}

export default function registerPlaceholderBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { hasSenderBlocks }: PlaceholderOptions
): void {
  const placeholderBlocks = {
    [senderLeftBlockName]:
      templateBlockOptions.blocks[senderLeftBlockName]?.template || SenderLeft
  }

  editor.DomComponents.addType(typeImagePlaceholder, {
    isComponent: isMJImagePlaceholderComponent,
    extend: 'mj-image',
    extendFnView: ['render'],
    view: {
      render() {
        // The grapesjs-mjml-improved package was missed `this.postRender` on its implementation and I'm not sure
        // what happens if I add it. So according to the fact that only this component needs it, I added it here.
        this.postRender()
      },
      onRender({ el, model }) {
        const imgEl: Nullable<HTMLImageElement> = el.querySelector('img')

        if (!imgEl) {
          return
        }

        const placeholderSrc = model.getAttributes()['data-placeholder-src']

        if (placeholderSrc) {
          imgEl.src = placeholderSrc
        }
      }
    }
  })

  if (hasSenderBlocks) {
    registerBlock(
      editor,
      {
        label: 'Sender Left',
        icon: SenderLeftIcon,
        category: PLACEHOLDER_BLOCK_CATEGORY,
        blockName: senderLeftBlockName,
        template: placeholderBlocks[senderLeftBlockName],
        adaptive: true
      },
      templateBlockOptions
    )
  }

  const allBlocks = registerTemplateBlocks(
    editor,
    'Placeholders',
    placeholderBlocks,
    templateBlockOptions.blocks
  )

  handleBlockDragStopEvent(editor, allBlocks, renderData)
}
