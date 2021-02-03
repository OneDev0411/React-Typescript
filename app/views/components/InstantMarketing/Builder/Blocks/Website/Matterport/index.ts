import { Editor } from 'grapesjs'
import { Model } from 'backbone'

// import { Matterport } from 'components/MatterportDrawer/types'
type Matterport = any
// import MatterportIcon from 'assets/images/marketing/editor/blocks/matterport.png'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, handleBlockDragStopEvent, isComponent } from '../utils'
import template from './template.njk'
// import { generateEmbedMatterportUrl } from './utils'

const typeEmbedMatterport = 'embed-matterport'
export const embedMatterportBlockName = typeEmbedMatterport

export const matterportBlockTraits = {
  [typeEmbedMatterport]: [
    {
      label: 'Model Id',
      name: 'modelId',
      changeProp: 1
    }
  ]
}

export interface MatterportBlockOptions {
  embedMatterportClassNames?: string
  onMatterportDrop: (model: Model) => void
}

// interface MatterportBlock {
//   selectHandler: (selectedMatterport?: Matterport) => void
// }

const isMatterportComponent = isComponent(typeEmbedMatterport)

const svgAttrs =
  'xmlns="http://www.w3.org/2000/svg" width="100" viewBox="0 0 24 24" style="fill: rgba(0,0,0,0.15); transform: scale(0.75); margin: 0 auto"'

export default function registerMatterportBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  { embedMatterportClassNames, onMatterportDrop }: MatterportBlockOptions
): any {
  const ImageModel = editor.DomComponents.getType('image')!.model as any
  const ImageView = editor.DomComponents.getType('image')!.view as any
  const BaseView = editor.DomComponents.getType('default')!.view as any

  editor.DomComponents.addType(typeEmbedMatterport, {
    model: ImageModel.extend(
      {
        defaults: {
          ...ImageModel.prototype.defaults,
          type: typeEmbedMatterport,
          tagName: 'iframe',
          void: 0,
          modelId: '',
          fallback: `<svg ${svgAttrs}>
            <path d="M2.28 3L1 4.27l2 2V19c0 1.1.9 2 2 2h12.73l2 2L21 21.72 2.28 3m2.55 0L21 19.17V5a2 2 0 0 0-2-2H4.83M8.5 13.5l2.5 3 1-1.25L14.73 18H5l3.5-4.5z"></path>
          </svg>`,
          attributes: {
            allowfullscreen: 'allowfullscreen'
          }
        },
        initialize(...args: any[]) {
          this.em = args[1].em

          if (this.get('src')) {
            this.parseFromSrc()
          }

          this.listenTo(this, 'change:modelId', this.updateSrc)
          ImageModel.prototype.initialize.apply(this, args)
        },
        /**
         * Set attributes by src string
         */
        parseFromSrc() {
          const query = this.parseUri(this.get('src')).query

          if (query.m) {
            this.set({ modelId: query.m })
          }
        },
        /**
         * Update src on change of video ID
         * @private
         */
        updateSrc() {
          this.set({ src: this.getSrc() })
        },
        /**
         * Returns url to the model
         * @return {string}
         * @private
         */
        getSrc() {
          if (!this.get('modelId')) {
            return this.getSrcResult({ fallback: 1 })
          }

          // You can see all the available URL parameters here:
          // https://support.matterport.com/hc/en-us/articles/209980967-URL-Parameters
          return [
            'http://my.matterport.com/show/?',
            `m=${this.get('modelId')}`, // Model Id
            '&mls=2', // Make the model MLS friendly and remove the about panel
            '&nt=1' // Opens the model in a new browser tab on mobile devices
          ].join('')
        }
      },
      {
        isComponent: (el: HTMLElement) => {
          if (isMatterportComponent(el)) {
            return {
              type: typeEmbedMatterport,
              src: el.getAttribute('src') || ''
            }
          }
        }
      }
    ),
    view: ImageView.extend({
      tagName: 'div',
      events: {},

      initialize(...args: any[]) {
        BaseView.prototype.initialize.apply(this, args)

        const { model } = this

        this.listenTo(model, 'change:src', this.updateSrc)
      },
      renderIframe() {
        const el = document.createElement('iframe')

        el.src = this.model.getSrc()
        el.frameBorder = '0'
        el.setAttribute('allowfullscreen', 'allowfullscreen')
        el.className = `${this.ppfx}no-pointer`
        el.style.height = '100%'
        el.style.width = '100%'

        this.iframeEl = el

        return el
      },
      updateSrc() {
        const { model, iframeEl } = this

        if (!iframeEl) {
          return
        }

        iframeEl.src = model.get('src')
      },
      render(...args) {
        ImageView.prototype.render.apply(this, args)
        this.updateClasses()

        this.el.appendChild(this.renderIframe())

        return this
      },
      ...baseView(embedMatterportClassNames)
    })
  })

  const matterportBlocks = {
    [embedMatterportBlockName]: template
  }

  registerBlock(editor, {
    label: 'Matterport',
    // icon: MatterportIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: embedMatterportBlockName,
    template: matterportBlocks[embedMatterportBlockName]
  })

  handleBlockDragStopEvent(
    editor,
    matterportBlocks,
    renderData
    // (selectedMatterport: Matterport) => ({
    //   ...renderData
    //   // url: generateEmbedMatterportUrl(selectedMatterport.url)
    // })
    // onMatterportDrop
  )
}
