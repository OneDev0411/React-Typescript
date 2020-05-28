import { Editor } from 'grapesjs'
import grapesjsPluginCkeditor from 'grapesjs-plugin-ckeditor'

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

const STYLE_MANAGER_ALIGNABLE_TAGS = ['mj-social']

const STYLE_MANAGER_BG_COLORABLE_TAGS = [
  'mj-button',
  'mj-column',
  'mj-section',
  'mj-wrapper'
]

const STYLE_MANAGER_WIDTH_ALLOWED_TAGS = ['mj-button']

const STYLE_MANAGER_PADDING_ALLOWED_TAGS = ['mj-section', 'mj-wrapper']

const getFontSizes = (start: number, end: number, step: number = 2): string => {
  let fontSizes = ''

  for (let i = start; i < end; i += step) {
    fontSizes = `${fontSizes}${i}px;`
  }

  fontSizes += `${end}px`

  return fontSizes
}

export function createGrapesInstance(
  Grapesjs: any,
  { assets, plugins, pluginsOpts }
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
    plugins: [
      'asset-blocks',
      'style-manager',
      grapesjsPluginCkeditor,
      ...plugins
    ],
    pluginsOpts: {
      ...pluginsOpts,
      [grapesjsPluginCkeditor]: {
        options: {
          fontSize_sizes: getFontSizes(8, 100),
          colorButton_colors: ['000000', 'ffffff', '333333'].join(','),
          colorButton_enableMore: false
        }
      },
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
            allowedTags: [
              ...STYLE_MANAGER_TEXT_TAGS,
              ...STYLE_MANAGER_ALIGNABLE_TAGS
            ],
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
        },
        widthPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_WIDTH_ALLOWED_TAGS,
            forbiddenStyles: []
          }
        },
        paddingPicker: {
          conditions: {
            allowedTags: STYLE_MANAGER_PADDING_ALLOWED_TAGS,
            forbiddenStyles: []
          }
        }
      }
    }
  })
}
