import { Editor } from 'grapesjs'
import { Model } from 'backbone'
import mapboxgl, { Map, Marker } from 'mapbox-gl'
import { debounce } from 'underscore'

import config from 'config'

import MapIcon from 'assets/images/marketing/editor/blocks/map.png'

import type { MapInfo } from 'components/MapDrawer'

import { mapThemes } from 'components/MapDrawer/constants'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, handleBlockDragStopEvent, isComponent } from '../utils'
import template from './template.njk'
import script from './script'

const typeEmbedMap = 'embed-map'
export const embedMapBlockName = typeEmbedMap

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
        theme: mapThemes[0].style,
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
          style: `mapbox://styles/${this.model.get('theme')}`,
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
      zoom: mapInfo.zoom,
      theme: mapInfo.theme
    }),
    onMapDrop
  )
}
