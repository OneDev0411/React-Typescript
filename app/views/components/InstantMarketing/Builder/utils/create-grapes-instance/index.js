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

export function createGrapesInstance(
  Grapesjs,
  { assets, plugins, pluginsOpts }
) {
  return Grapesjs.init({
    ...config,
    avoidInlineStyle: false,
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
          }
        },
        colorPicker: {
          disabled: true,
          conditions: {
            allowedTags: STYLE_MANAGER_TEXT_TAGS,
            forbiddenStyles: ['background-image']
          }
        }
      }
    }
  })
}
