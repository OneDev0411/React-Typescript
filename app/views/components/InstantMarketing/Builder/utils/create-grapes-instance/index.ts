import { Editor } from 'grapesjs'
import grapesjsPluginCkeditor from 'grapesjs-plugin-mjml-ckeditor'

import config from './config'

function getFontFamiliesCSSFiles(families: string[]): string[] {
  if (families.length === 0) {
    return []
  }

  return [
    `https://fonts.googleapis.com/css2?${families
      .map(family => `family=${encodeURIComponent(family)}`)
      .join('&')}`
  ]
}

const STYLE_MANAGER_TEXT_TAGS = ['div', 'section', 'a', 'mj-button']

const STYLE_MANAGER_ALIGNABLE_TAGS = ['mj-social']

const STYLE_MANAGER_BG_COLORABLE_TAGS = [
  'mj-button',
  'mj-column',
  'mj-section',
  'mj-wrapper'
]

const STYLE_MANAGER_WIDTH_ALLOWED_TAGS = ['mj-button']

const STYLE_MANAGER_PADDING_ALLOWED_TAGS = ['mj-section', 'mj-wrapper']

const CK_EDITOR_LINE_HEIGHT_VALUES = [
  '1',
  '1.1',
  '1.2',
  '1.4',
  '1.5',
  '1.7',
  '2',
  '2.5',
  '3'
]

export function createGrapesInstance(
  Grapesjs: any,
  { assets, colors, fontFamilies, plugins, pluginsOpts }
): Editor {
  // https://github.com/artf/grapesjs/issues/1338#issuecomment-410727775
  // @ts-ignore
  CKEDITOR.dtd.$editable.span = 1

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
          colorButton_colors: colors
            .map(color => color.replace('#', ''))
            .join(','),
          line_height: CK_EDITOR_LINE_HEIGHT_VALUES.join(';'),
          contentsCss: getFontFamiliesCSSFiles(fontFamilies),
          font_names: fontFamilies.join(';'),
          colorButton_enableMore: false,
          linkShowAdvancedTab: false,
          linkDefaultProtocol: 'https://',
          linkShowTargetTab: false,
          allowedContent: true, // In order to keep content as is
          enterMode: 2, // equals to: CKEDITOR.ENTER_BR, in order to stop adding p tags
          toolbar: [
            [
              'Bold',
              'Italic',
              'Underline',
              'Strikethrough',
              'BulletedList',
              'NumberedList',
              'Outdent',
              'Indent',
              'JustifyLeft',
              'JustifyCenter',
              'JustifyRight',
              'JustifyBlock',
              'Link',
              'Unlink',
              'Table'
            ],
            '/',
            [
              'Font',
              'FontSize',
              'lineheight',
              'TextColor',
              'BGColor',
              'EmojiPanel'
            ]
          ]
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
