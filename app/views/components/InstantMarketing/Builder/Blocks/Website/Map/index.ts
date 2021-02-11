import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import MapIcon from 'assets/images/marketing/editor/blocks/map.png'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, handleBlockDragStopEvent, isComponent } from '../utils'
import template from './template.njk'

const typeEmbedMap = 'embed-map'
export const embedMapBlockName = typeEmbedMap

declare const mapboxgl: any

const themes = [
  {
    label: 'Standard',
    id: 'emilsedgh/ckky6owqc0r7r17s7pq5j7fhi'
  },
  {
    label: 'Decimal',
    id: 'emilsedgh/ckky6ivy30r5217qiq7okzbkf'
  },
  {
    label: 'Blue Print',
    id: 'emilsedgh/ckky6qxab18dj17ppb9wxu9fy'
  },
  {
    label: 'Frank',
    id: 'emilsedgh/ckky6s2q16kx417pgico1g416'
  },
  {
    label: 'Mapbox Japan',
    id: 'emilsedgh/ckky6sw6x5vq218mhelo85ouc'
  }
]

export const mapBlockTraits = {
  [typeEmbedMap]: [
    {
      type: 'select',
      label: 'Theme',
      name: 'theme',
      options: themes.map(theme => ({
        id: theme.id,
        name: theme.label
      })),
      changeProp: 1
    },
    {
      label: 'Latitude',
      name: 'latitude',
      changeProp: 1
    },
    {
      label: 'Longitude',
      name: 'longitude',
      changeProp: 1
    },
    {
      label: 'Zoom',
      name: 'zoom',
      changeProp: 1
    }
  ]
}

export interface MapBlockOptions {
  embedMapClassNames?: string
  onMapDrop: (model: Model) => void
}

// interface MapBlock {
//   selectHandler: (modelId?: string) => void
// }
type MapBlock = any

const script = function ({ token, theme, longitude, latitude, zoom }) {
  const element = this

  function initLib() {
    const initMap = function (mapElement) {
      mapboxgl.accessToken = token

      const map = new mapboxgl.Map({
        container: mapElement.id,
        style: `mapbox://styles/${theme}`,
        center: [longitude, latitude],
        zoom
      })

      new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map)
    }

    initMap(element)
  }

  if (typeof mapboxgl == 'undefined') {
    const script = document.createElement('script')

    script.onload = initLib
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js'
    document.body.appendChild(script)

    const style = document.createElement('link')

    style.href = 'https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css'
    style.rel = 'stylesheet'

    document.body.appendChild(style)
  } else {
    initLib()
  }
}

export default function registerMapBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  { embedMapClassNames, onMapDrop }: MapBlockOptions
): MapBlock {
  const ComponentModel = editor.DomComponents.getType('default')!.model

  const attrKeys = ['token', 'theme', 'longitude', 'latitude', 'zoom']

  editor.DomComponents.addType(typeEmbedMap, {
    isComponent: isComponent(typeEmbedMap),
    model: {
      defaults: {
        script,
        'script-props': attrKeys,
        resizable: {
          tl: 0,
          tr: 0,
          bl: 0,
          br: 0,
          cl: 0,
          cr: 0
        },
        token:
          'pk.eyJ1IjoiZW1pbHNlZGdoIiwiYSI6ImNrOTg3eGJxczFlbGszaHFobDV1MmJtb2MifQ.N2uEZ_azvsJxNnU_IAyzVQ',
        theme: themes[0].id,
        longitude: '',
        latitude: '',
        zoom: 15
      },
      init() {
        const attrs = this.getAttributes()

        attrKeys.forEach(attrKey => {
          const attrValue = attrs[`data-${attrKey}`]

          if (attrValue) {
            this.set(attrKey, attrValue)
          }
        })
      },
      /**
       * Returns object of attributes for HTML
       * @return {Object}
       * @private
       */
      getAttrToHTML(...args) {
        const attr = ComponentModel.prototype.getAttrToHTML.apply(this, args)

        attrKeys.forEach(attrKey => {
          attr[`data-${attrKey}`] = this.get(attrKey)
        })

        return attr
      }
    },
    view: { ...baseView(embedMapClassNames) }
  })

  const mapBlocks = {
    [embedMapBlockName]: template
  }

  registerBlock(editor, {
    label: 'Map',
    icon: MapIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: embedMapBlockName,
    template: mapBlocks[embedMapBlockName]
  })

  return handleBlockDragStopEvent(
    editor,
    mapBlocks,
    renderData
    // (modelId: string) => ({
    //   ...renderData,
    //   src:
    //     'https://api.mapbox.com/styles/v1/mapbox/streets-v11.html?title=true&zoomwheel=false&access_token=pk.eyJ1IjoiZW1pbHNlZGdoIiwiYSI6ImNrOTg3eGJxczFlbGszaHFobDV1MmJtb2MifQ.N2uEZ_azvsJxNnU_IAyzVQ#15/37.771/-122.436'
    // }),
    // onMapDrop
  )
}
