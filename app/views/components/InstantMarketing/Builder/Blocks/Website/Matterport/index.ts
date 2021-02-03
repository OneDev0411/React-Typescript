import { Editor } from 'grapesjs'
import { Model } from 'backbone'

// import { Matterport } from 'components/MatterportDrawer/types'
type Matterport = any
// import MatterportIcon from 'assets/images/marketing/editor/blocks/matterport.png'

import { isNumeric } from 'utils/helpers'

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
    },
    {
      type: 'checkbox',
      label: 'Looped Guided Tour',
      name: 'lp',
      changeProp: 1
    },
    {
      label: 'Auto-Start Guided Tour',
      name: 'ts',
      changeProp: 1
    },
    {
      type: 'checkbox',
      label: 'Auto-Load',
      name: 'play',
      changeProp: 1
    },
    {
      type: 'checkbox',
      label: 'Handle Scroll Wheel',
      name: 'wh',
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
          lp: false, // Looped Guided Tour
          ts: '0', // Auto-Start Guided Tour
          play: false, // Auto-Load
          wh: true, // Handle Scroll Wheel
          attributes: {
            allowfullscreen: 'allowfullscreen',
            style: {
              width: '100%',
              height: '480px'
            }
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

          if (query.lp) {
            this.set({ lp: true })
          }

          console.log(
            'query.ts',
            query.ts,
            'query.ts > 0',
            query.ts > 0,
            'isNumeric(query.ts)',
            isNumeric(query.ts)
          )

          if (query.ts && isNumeric(query.ts) && query.ts > 0) {
            this.set({ ts: query.ts })
          }

          if (query.play) {
            this.set({ play: true })
          }

          if (query.wh === '0') {
            this.set({ wh: false })
          }
        },
        /**
         * Update src on change of video ID
         * @private
         */
        updateSrc() {
          this.set({ src: this.getSrc() })
          console.log('update source:', this.get('src'))
        },
        /**
         * Returns url to the model
         * @return {string}
         * @private
         */
        getSrc() {
          return [
            'http://my.matterport.com/show/?',
            `m=${this.get('modelId')}`, // Model Id
            '&mls=2', // Make the model MLS friendly and remove the about panel
            '&nt=1', // Opens the model in a new browser tab on mobile devices

            // '&help=null', // Show help for new users
            // 'hl=', // Default behaviour
            // '&play=0', // Display a play button and do not load the model automatically
            // '&qs=0', // Do not quick start
            // '&ts=', // The number of seconds before the tour start automatically

            // '&brand=1', // Display all branding information in the "About" panel
            // '&dh=1', // Show Dollhouse View
            // '&gt=1', // Show Guided Tour buttons
            // '&hr=1', // Show highlight reel
            // '&mt=1', // Show Mattertag™ Posts
            // '&pin=1', // Show placed 360º Views pins in Dollhouse and Floor Plan
            // '&portal=1', // Show placed 360º Views connection portals while in Inside View
            // '&f=1', // Let the user navigate the 3D model floor by floor.
            // '&lang=', // The ui language
            // '&nozoom=0', // Enable zooming in 3D Showcase
            // '&wh=1', // Enables scroll wheel input from the mouse

            // '&kb=1', // Gently pan once you reach a new highlight in a Guided Tour
            // 'lp=0', // Stop once you reach the end of the Guided Tour
            // '&title=1', // Space title is displayed. Top-left about panel is displayed.
            // '&tourcta=1', // Large call to action at the end of a Guided Tour

            // '&vr=1', // Show the VR button.
            ''
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
        const props = ['lp', 'ts', 'play', 'wh']
        const events = props.map(p => `change:${p}`).join(' ')

        this.listenTo(model, 'change:src', this.updateSrc)
        this.listenTo(model, events, this.updateMatterport)
      },
      renderIframe() {
        this.videoEl = document.createElement('iframe')

        this.videoEl.src = this.model.getSrc()
        this.videoEl.frameBorder = '0'
        this.videoEl.setAttribute('allowfullscreen', 'allowfullscreen')
        this.videoEl.className = `${this.ppfx}no-pointer`
        this.videoEl.style.height = '100%'
        this.videoEl.style.width = '100%'

        return this.videoEl
      },
      /**
       * Update video parameters
       * @private
       */
      updateMatterport() {
        console.log('view::updateMatterport')
        this.model.trigger('change:modelId')
      },
      render(...args) {
        ImageView.prototype.render.apply(this, args)
        this.updateClasses()

        this.el.appendChild(this.renderIframe())
        this.updateMatterport()

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
