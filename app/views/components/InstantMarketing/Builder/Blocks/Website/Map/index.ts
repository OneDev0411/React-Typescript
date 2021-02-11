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
    label: 'Streets',
    id: 'mapbox/streets-v11'
  },
  {
    label: 'Outdoors',
    id: 'mapbox/outdoors-v11'
  },
  {
    label: 'Light',
    id: 'mapbox/light-v10'
  },
  {
    label: 'Dark',
    id: 'mapbox/dark-v10'
  },
  {
    label: 'Satellite',
    id: 'mapbox/satellite-v9'
  },
  {
    label: 'Satellite Streets',
    id: 'mapbox/satellite-streets-v11'
  },
  {
    label: 'Navigation Preview Day',
    id: 'mapbox/navigation-preview-day-v4'
  },
  {
    label: 'Navigation Preview Night',
    id: 'mapbox/navigation-preview-night-v4'
  },
  {
    label: 'Navigation Guidance Day',
    id: 'mapbox/navigation-guidance-day-v4'
  },
  {
    label: 'Navigation Guidance Night',
    id: 'mapbox/navigation-guidance-night-v4'
  },
  {
    label: 'Standard',
    id: 'mapbox-map-design/ck40e3qu90uvj1cmvb8fov36r'
  },
  {
    label: 'Decimal',
    id: 'mapbox-map-design/ck4014y110wt61ctt07egsel6'
  },
  {
    label: 'Blue Print',
    id: 'mapbox-map-design/ck40ed2go56yr1cp7bbsalr1c'
  },
  {
    label: 'Frank',
    id: 'mapbox-map-design/ck3zxbv499umj1cscx9sbymev'
  },
  {
    label: 'Minimo',
    id: 'mapbox/cjku6bhmo15oz2rs8p2n9s2hm'
  },
  {
    label: 'Lè Shine',
    id: 'mapbox/cjcunv5ae262f2sm9tfwg8i0w'
  },
  {
    label: 'Ice Cream',
    id: 'mapbox/cj7t3i5yj0unt2rmt3y4b5e32'
  },
  {
    label: 'North Star',
    id: 'mapbox/cj44mfrt20f082snokim4ungi'
  },
  {
    label: 'Moonlight',
    id: 'mapbox/cj3kbeqzo00022smj7akz3o1e'
  },
  {
    label: 'Mineral',
    id: 'mapbox/cjtep62gq54l21frr1whf27ak'
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
