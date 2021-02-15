import { Editor } from 'grapesjs'
import { Model } from 'backbone'
import mapboxgl, { Map, Marker } from 'mapbox-gl'
import { debounce } from 'underscore'

import config from 'config'

import MapIcon from 'assets/images/marketing/editor/blocks/map.png'

import type { MapInfo } from 'components/MapEditorDialog'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, handleBlockDragStopEvent, isComponent } from '../utils'
import template from './template.njk'
import script from './script'

const typeEmbedMap = 'embed-map'
export const embedMapBlockName = typeEmbedMap

const themes = [
  {
    label: 'Streets',
    id: 'mapbox://styles/mapbox/streets-v11'
  },
  {
    label: 'Outdoors',
    id: 'mapbox://styles/mapbox/outdoors-v11'
  },
  {
    label: 'Light',
    id: 'mapbox://styles/mapbox/light-v10'
  },
  {
    label: 'Dark',
    id: 'mapbox://styles/mapbox/dark-v10'
  },
  {
    label: 'Satellite',
    id: 'mapbox://styles/mapbox/satellite-v9'
  },
  {
    label: 'Satellite Streets',
    id: 'mapbox://styles/mapbox/satellite-streets-v11'
  },
  {
    label: 'Navigation Preview Day',
    id: 'mapbox://styles/mapbox/navigation-preview-day-v4'
  },
  {
    label: 'Navigation Preview Night',
    id: 'mapbox://styles/mapbox/navigation-preview-night-v4'
  },
  {
    label: 'Navigation Guidance Day',
    id: 'mapbox://styles/mapbox/navigation-guidance-day-v4'
  },
  {
    label: 'Navigation Guidance Night',
    id: 'mapbox://styles/mapbox/navigation-guidance-night-v4'
  },
  {
    label: 'Standard',
    id: 'mapbox://styles/mapbox-map-design/ck40e3qu90uvj1cmvb8fov36r'
  },
  {
    label: 'Decimal',
    id: 'mapbox://styles/mapbox-map-design/ck4014y110wt61ctt07egsel6'
  },
  {
    label: 'Blue Print',
    id: 'mapbox://styles/mapbox-map-design/ck40ed2go56yr1cp7bbsalr1c'
  },
  {
    label: 'Frank',
    id: 'mapbox://styles/mapbox-map-design/ck3zxbv499umj1cscx9sbymev'
  },
  {
    label: 'Minimo',
    id: 'mapbox://styles/mapbox/cjku6bhmo15oz2rs8p2n9s2hm'
  },
  {
    label: 'Lè Shine',
    id: 'mapbox://styles/mapbox/cjcunv5ae262f2sm9tfwg8i0w'
  },
  {
    label: 'Ice Cream',
    id: 'mapbox://styles/mapbox/cj7t3i5yj0unt2rmt3y4b5e32'
  },
  {
    label: 'North Star',
    id: 'mapbox://styles/mapbox/cj44mfrt20f082snokim4ungi'
  },
  {
    label: 'Moonlight',
    id: 'mapbox://styles/mapbox/cj3kbeqzo00022smj7akz3o1e'
  },
  {
    label: 'Mineral',
    id: 'mapbox://styles/mapbox/cjtep62gq54l21frr1whf27ak'
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
  onMapDoubleClick: (model: Model) => void
}

interface MapBlock {
  selectHandler: (mapInfo?: MapInfo) => void
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
        'script-export': script,
        'script-props': attrKeys,
        resizable: {
          tl: 0,
          tr: 0,
          bl: 0,
          br: 0,
          cl: 0,
          cr: 0
        },
        token: config.mapbox.access_token,
        theme: themes[0].id,
        longitude: '',
        latitude: '',
        zoom: 15,
        draggable: false
      },
      init() {
        const attrs = this.getAttributes()

        attrKeys.forEach(attrKey => {
          const attrValue = attrs[`data-${attrKey}`]

          if (typeof attrValue !== 'undefined') {
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
    view: {
      ...baseView(embedMapClassNames),
      onRender() {
        mapboxgl.accessToken = config.mapbox.access_token

        const center: [number, number] = [
          this.model.get('longitude'),
          this.model.get('latitude')
        ]

        const map = new Map({
          container: this.el,
          style: this.model.get('theme'),
          center,
          zoom: this.model.get('zoom')
        })

        const marker = new Marker().setLngLat(center).addTo(map)

        map.on('move', event => {
          marker.setLngLat(event.target.getCenter())
        })

        map.on('moveend', event => {
          const center = event.target.getCenter()

          this.model.set(
            {
              longitude: center.lng,
              latitude: center.lat
            },
            { silent: true }
          )
        })

        map.on('zoomend', event => {
          this.model.set('zoom', event.target.getZoom(), { silent: true })
        })

        map.on('load', map.resize)

        // TODO: Optimize this by finding a better event because now the callback
        // call for all height change
        this.listenTo(
          this.em,
          'styleable:change:height',
          this.handleChangeHeight
        )

        this.mapInstance = map
        this.markerInstance = marker
      },
      handleChangeHeight: debounce(function handleChangeHeight() {
        this.mapInstance.resize()
      }, 200),
      removed() {
        this.mapInstance?.remove()
        this.markerInstance?.remove()
      }
    }
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
    (mapInfo: MapInfo) => ({
      ...renderData,
      longitude: mapInfo.center.lng,
      latitude: mapInfo.center.lat,
      zoom: mapInfo.zoom
    }),
    onMapDrop
  )
}
