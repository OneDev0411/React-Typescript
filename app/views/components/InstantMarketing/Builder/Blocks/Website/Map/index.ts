import { Model } from 'backbone'
import { Editor } from 'grapesjs'
import { debounce } from 'underscore'

import MapIcon from 'assets/images/marketing/editor/blocks/map.png'
import type { MapInfo } from 'components/MapDrawer'
import { mapThemes } from 'components/MapDrawer/constants'
import config from 'config'

import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { TemplateBlockOptions, RegisterBlockSelectHandler } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'
import { baseView, isComponent } from '../utils'

import script, { MapInitEventType } from './script'
import template from './template.njk'

export const typeEmbedMap = 'embed-map'
export const embedMapBlockName = typeEmbedMap

interface MapRenderData {
  longitude: number
  latitude: number
  zoom: number
  theme: string
}

export interface MapBlockOptions {
  embedMapClassNames?: string
  onMapDrop: (model: Model) => void
  onMapDoubleClick: (model: Model) => void
}

export default function registerMapBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { embedMapClassNames, onMapDrop, onMapDoubleClick }: MapBlockOptions
): RegisterBlockSelectHandler<MapInfo> {
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
      events: {
        dblclick(event): void {
          if (!event.target.classList.contains('mapboxgl-ctrl-icon')) {
            onMapDoubleClick(this.model)
          }
        }
      },
      ...baseView(embedMapClassNames),
      init(...args) {
        baseView(embedMapClassNames).init.apply(this, args)

        this.el.addEventListener(
          'map:init',
          (event: CustomEvent<MapInitEventType>) => {
            const map = event.detail.map
            const marker = event.detail.marker

            // The method argument is available in JS implementation, but it
            // does not exist in TS type definition, so I call the enable method
            // with .call() to avoid the typescript signature problem.
            map.scrollZoom.enable.call(map.scrollZoom, { around: 'center' })

            map.doubleClickZoom.disable()

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

              editor.select(this.model)
            })

            map.on('zoomend', event => {
              this.model.set('zoom', event.target.getZoom(), { silent: true })
              editor.select(this.model)
            })

            map.on('load', map.resize)

            // TODO: Optimize this by finding a better event because
            // this event calls the callback for unrelated height changes too
            this.listenTo(
              this.em,
              'styleable:change:height',
              this.handleChangeHeight
            )

            this.listenTo(
              this.model,
              'change:map:info',
              this.handleChangeMapProps
            )

            this.mapInstance = map
            this.markerInstance = marker
          }
        )
      },
      handleChangeHeight: debounce(function handleChangeHeight() {
        this.mapInstance.resize()
      }, 200),
      handleChangeMapProps({ longitude, latitude, theme }) {
        if (longitude && latitude) {
          this.model.set(
            {
              longitude,
              latitude
            },
            { silent: true }
          )
          this.mapInstance?.setCenter({
            lon: longitude,
            lat: latitude
          })
        }

        if (theme) {
          this.model.set({ theme }, { silent: true })
          this.mapInstance?.setStyle(`mapbox://styles/${theme}`)
        }
      },
      removed() {
        this.mapInstance?.remove()
        this.markerInstance?.remove()
      }
    }
  })

  const mapBlocks = {
    [embedMapBlockName]:
      templateBlockOptions.blocks[embedMapBlockName]?.template || template
  }

  registerBlock(
    editor,
    {
      label: 'Map',
      icon: MapIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: embedMapBlockName,
      template: mapBlocks[embedMapBlockName]
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Map',
    mapBlocks,
    templateBlockOptions.blocks
  )

  return handleBlockDragStopEvent<MapInfo, MapRenderData>(
    editor,
    allBlocks,
    mapInfo => ({
      ...renderData,
      longitude: mapInfo.center.longitude,
      latitude: mapInfo.center.latitude,
      zoom: mapInfo.zoom,
      theme: mapInfo.theme
    }),
    onMapDrop
  )
}
