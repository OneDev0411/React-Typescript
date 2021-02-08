import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import MatterportIcon from 'assets/images/marketing/editor/blocks/matterport.png'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, handleBlockDragStopEvent, isComponent } from '../utils'
import template from './template.njk'

const typeEmbedMatterport = 'embed-matterport'
export const embedMatterportBlockName = typeEmbedMatterport

export const matterportBlockTraits = {
  [typeEmbedMatterport]: [
    {
      label: 'Model Id',
      name: 'modelId',
      changeProp: 1,
      placeholder: 'eg. uRGXgoiYk9f'
    }
  ]
}

export interface MatterportBlockOptions {
  embedMatterportClassNames?: string
  onMatterportDrop: (model: Model) => void
  onEmptyMatterportSelected: (model: Model) => void
}

interface MatterportBlock {
  selectHandler: (modelId?: string) => void
}

const isMatterportComponent = isComponent(typeEmbedMatterport)

const svgAttrs =
  'xmlns="http://www.w3.org/2000/svg" width="100" viewBox="0 0 512 512" style="fill: rgba(0,0,0,0.15); transform: scale(0.75); margin: 0 auto"'

export default function registerMatterportBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  {
    embedMatterportClassNames,
    onMatterportDrop,
    onEmptyMatterportSelected
  }: MatterportBlockOptions
): MatterportBlock {
  const ImageComponent = editor.DomComponents.getType('image')
  const ImageModel = ImageComponent!.model
  const ImageView = ImageComponent!.view
  const BaseView = editor.DomComponents.getType('default')!.view

  editor.DomComponents.addType(typeEmbedMatterport, {
    model: ImageModel.extend(
      {
        defaults: {
          ...ImageModel.prototype.defaults,
          type: typeEmbedMatterport,
          tagName: 'iframe',
          void: 0,
          modelId: '',
          // the icon downloaded from this address:
          // https://www.flaticon.com/free-icon/3d_420952
          fallback: `<svg ${svgAttrs}>
          <path d="M144.024,379.062c26.736,15.435,43.188,8.311,43.188-14.309v-0.343c0-22.278-15.938-40.048-32.22-52.189l23.479-8.894
          c4.799-1.856,7.884-3.674,7.884-10.186c0-7.198-5.656-14.917-13.367-19.37l-58.441-33.74c-6.169-3.562-11.31-1.389-11.31,4.78
          c0,6.169,5.141,14.278,11.31,17.841l36.847,21.273l-23.307,10.02c-4.114,1.738-5.656,3.932-5.656,7.532
          c0,6.169,5.141,14.279,11.311,17.842l4.114,2.375c14.738,8.51,23.479,19.039,23.479,28.807v0.343
          c0,8.911-7.026,10.51-16.967,4.77c-9.426-5.442-16.624-12.682-23.479-22.466c-2.056-2.901-4.627-5.928-8.397-8.104
          c-6.855-3.958-12.681-1.495-12.681,5.359c0,3.77,2.056,8.556,4.456,11.998C114.033,356.434,126.888,369.168,144.024,379.062z"/>
        <path d="M471.824,123.378L259.965,1.063c-2.453-1.417-5.476-1.417-7.929,0L40.176,123.378c-2.453,1.417-3.965,4.033-3.965,6.867
          v251.511c0,2.833,1.512,5.45,3.965,6.867l211.86,122.316c1.226,0.708,2.595,1.063,3.965,1.063c1.369,0,2.738-0.354,3.965-1.063
          l211.859-122.316c2.453-1.417,3.965-4.033,3.965-6.867V130.245C475.788,127.411,474.277,124.795,471.824,123.378z
           M248.071,490.338L52.07,377.178V143.979l196.001,113.16V490.338z M256.001,243.405L59.999,130.245l196.001-113.16
          l196.001,113.16L256.001,243.405z M459.931,377.178h-0.001l-196,113.16V257.139l196.001-113.16V377.178z"/>
        <path d="M327.842,398.07l33.59-19.394c37.703-21.768,63.753-63.027,63.753-96.787v-0.341c0-33.76-26.05-44.598-63.753-22.829
          l-33.59,19.394c-7.369,4.254-13.195,13.445-13.195,20.814v93.567C314.645,399.863,320.473,402.326,327.842,398.07z
           M341.038,294.314l20.394-11.774c21.595-12.468,36.161-5.969,36.161,15.281v0.343c0,21.251-14.566,44.227-36.161,56.693
          l-20.394,11.774V294.314z"/>
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
    icon: MatterportIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: embedMatterportBlockName,
    template: matterportBlocks[embedMatterportBlockName]
  })

  editor.on('component:selected', model => {
    if (model.get('type') !== typeEmbedMatterport || model.get('modelId')) {
      return
    }

    onEmptyMatterportSelected(model)
  })

  return handleBlockDragStopEvent(
    editor,
    matterportBlocks,
    (modelId: string) => ({
      ...renderData,
      src: `https://my.matterport.com/show/?m=${modelId}`
    }),
    onMatterportDrop
  )
}
