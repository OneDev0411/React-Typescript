import { Editor } from 'grapesjs'

import config from './config'

const STYLE_MANAGER_TEXT_TAGS = ['div', 'section', 'a', 'mj-button']
const STYLE_MANAGER_TEXT_TYPES = ['button']

const STYLE_MANAGER_ALIGNABLE_TAGS = ['mj-social']
const STYLE_MANAGER_ALIGNABLE_TYPES = ['social-group']

const STYLE_MANAGER_BG_COLORABLE_TAGS = [
  'mj-button',
  'mj-column',
  'mj-section',
  'mj-wrapper',
  'mj-image',
  'div',
  'section'
]
const STYLE_MANAGER_BG_COLORABLE_TYPES = ['button', 'grid-column', 'grid-row']

const STYLE_MANAGER_WIDTH_ALLOWED_TAGS = ['mj-button']
const STYLE_MANAGER_WIDTH_ALLOWED_TYPES = ['button']

const STYLE_MANAGER_PADDING_ALLOWED_TAGS = ['mj-section', 'mj-wrapper']
const STYLE_MANAGER_PADDING_ALLOWED_TYPES = ['grid-row']

export function createGrapesInstance(
  Grapesjs: any,
  { assets, plugins, pluginsOpts, detectComponentByType }
): Editor {
  return Grapesjs.init({
    ...config,
    keepUnusedStyles: true,
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
    keymaps: {
      defaults: {
        'core:undo': {
          keys: '⌘+z, ctrl+z',
          handler: 'core:undo'
        },
        'core:redo': {
          keys: '⌘+shift+z, ctrl+shift+z',
          handler: 'core:redo'
        },
        'core:copy': {
          keys: '⌘+c, ctrl+c',
          handler: 'core:copy'
        }
      }
    },
    plugins: ['asset-blocks', 'style-manager', ...plugins],
    pluginsOpts: {
      ...pluginsOpts,
      'style-manager': {
        detectComponentByType,
        fontSizePicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_TEXT_TAGS,
            allowedTypes: STYLE_MANAGER_TEXT_TYPES,
            forbiddenStyles: ['background-image']
          }
        },
        fontWeightPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_TEXT_TAGS,
            allowedTypes: STYLE_MANAGER_TEXT_TYPES,
            forbiddenStyles: ['background-image']
          },
          disabled: true
        },
        textAlignPicker: {
          conditions: {
            allowedTags: [
              ...STYLE_MANAGER_TEXT_TAGS,
              ...STYLE_MANAGER_ALIGNABLE_TAGS
            ],
            allowedTypes: [
              ...STYLE_MANAGER_TEXT_TYPES,
              ...STYLE_MANAGER_ALIGNABLE_TYPES
            ],
            forbiddenStyles: ['background-image']
          }
        },
        colorPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_TEXT_TAGS,
            allowedTypes: STYLE_MANAGER_TEXT_TYPES,
            forbiddenStyles: ['background-image']
          }
        },
        backgroundColorPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_BG_COLORABLE_TAGS,
            allowedTypes: STYLE_MANAGER_BG_COLORABLE_TYPES,
            forbiddenStyles: ['background-image']
          },
          getPropName: (model, defaultPropName) => {
            // The mj-image component does not support the back-ground-color property. Instead,
            // it has the container-background-color.
            if (model.get('type') === 'mj-image') {
              return 'container-background-color'
            }

            return defaultPropName
          }
        },
        widthPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_WIDTH_ALLOWED_TAGS,
            allowedTypes: STYLE_MANAGER_WIDTH_ALLOWED_TYPES,
            forbiddenStyles: []
          }
        },
        paddingPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_PADDING_ALLOWED_TAGS,
            allowedTypes: STYLE_MANAGER_PADDING_ALLOWED_TYPES,
            forbiddenStyles: []
          }
        }
      }
    }
  })
}
