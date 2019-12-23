import { Editor } from 'grapesjs'

import config from './config'

const STYLE_MANAGER_TEXT_TAGS = [
  'div',
  'section',
  'table',
  'tr',
  'td',
  'ol',
  'ul',
  'li',
  'p',
  'span',
  'a',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'address',
  'q',
  'label',
  'mj-text',
  'mj-button'
]

const STYLE_MANAGER_BG_COLORABLE_TAGS = [
  'mj-button',
  'mj-column',
  'mj-section',
  'mj-wrapper'
]

export function createGrapesInstance(
  Grapesjs: any,
  { assets, plugins, pluginsOpts }
): Editor {
  return Grapesjs.init({
    ...config,
    keepUnusedStyles: true,
    forceClass: false,
    container: '#grapesjs-canvas',
    components: null,
    assetManager: {
      assets
    },
    storageManager: {
      autoload: 0,
      params: {
        templateId: null
      }
    },
    showDevices: false,
    plugins: ['asset-blocks', 'style-manager', ...plugins],
    pluginsOpts: {
      ...pluginsOpts,
      'style-manager': {
        fontSizePicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_TEXT_TAGS,
            forbiddenStyles: ['background-image']
          }
        },
        fontWeightPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_TEXT_TAGS,
            forbiddenStyles: ['background-image']
          },
          disabled: true
        },
        textAlignPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_TEXT_TAGS,
            forbiddenStyles: ['background-image']
          }
        },
        colorPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_TEXT_TAGS,
            forbiddenStyles: ['background-image']
          }
        },
        backgroundColorPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_BG_COLORABLE_TAGS,
            forbiddenStyles: ['background-image']
          }
        }
      }
    }
  })
}
