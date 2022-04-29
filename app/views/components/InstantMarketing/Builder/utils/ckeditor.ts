import { Editor } from 'grapesjs'

import { preloadEditorAssets } from './ckeditor-patches/preload-editor-assets'
import { supportNunjucksVariables } from './ckeditor-patches/support-nunjucks-variables'

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

const stopPropagation = e => e.stopPropagation()

export async function attachCKEditor(
  editor: Editor,
  fontFamilies: string[],
  colors: string[] = [],
  opts: any = {},
  getOpts: (currentOptions: any) => any = () => ({})
) {
  const fontNames = [...new Set([...fontFamilies])]
  const fontSizes = [
    8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 36, 42, 48, 60, 72
  ].map(fontSize => `${fontSize}/${fontSize}px`)

  let c = opts

  let defaults = {
    // On which side of the element to position the toolbar
    // Available options: 'left|center|right'
    position: 'center',

    // CKEditor Options
    options: {
      extraPlugins: 'placeholder',
      colorButton_colors: colors.map(color => color.replace('#', '')).join(','),
      line_height: CK_EDITOR_LINE_HEIGHT_VALUES.join(';'),
      contentsCss: getFontFamiliesCSSFiles(fontFamilies),
      font_names: fontNames.join(';'),
      fontSize_sizes: fontSizes.join(';'),
      colorButton_enableMore: false,
      qtWidth: '100%',
      linkDefaultProtocol: 'https://',
      linkShowAdvancedTab: false,
      linkShowTargetTab: false,
      allowedContent: true, // In order to keep content as is
      // @ts-ignore
      enterMode: CKEDITOR.ENTER_BR,
      // @ts-ignore
      shiftEnterMode: CKEDITOR.ENTER_P,
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
        ],
        '/',
        ['CreatePlaceholder']
      ],
      placeholder: {
        items: [
          {
            value: 'sender.first_name',
            label: "Sender's First Name"
          },
          {
            value: 'sender.last_name',
            label: "Sender's Last Name"
          },
          {
            value: 'sender.display_name',
            label: "Sender's Display Name"
          },
          {
            value: 'sender.email',
            label: "Sender's Email"
          },
          {
            value: 'sender.phone_number',
            label: "Sender's Phone Number"
          },
          {
            value: 'recipient.first_name',
            label: "Recipient's First Name"
          },
          {
            value: 'recipient.last_name',
            label: "Recipient's Last Name"
          },
          {
            value: 'recipient.display_name',
            label: "Recipient's Display Name"
          },
          {
            value: 'recipient.email',
            label: "Recipient's Email"
          },
          {
            value: 'recipient.phone_number',
            label: "Recipient's Phone Number"
          }
        ]
      }
    }
  }

  // Load defaults
  // eslint-disable-next-line no-restricted-syntax
  for (let name in defaults) {
    if (!(name in c)) {
      c[name] = defaults[name]
    }
  }

  // @ts-ignore
  if (!CKEDITOR) {
    throw new Error('CKEDITOR instance not found')
  }

  // https://github.com/artf/grapesjs/issues/1338#issuecomment-410727775
  // https://stackoverflow.com/questions/64347477/inline-ckeditor-not-working-in-some-html-tags
  // @ts-ignore
  CKEDITOR.dtd.$editable.span = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.a = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.strong = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.em = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.s = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.u = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.i = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.p = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.sub = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.sup = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.h1 = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.h2 = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.h3 = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.h4 = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.h5 = 1
  // @ts-ignore
  CKEDITOR.dtd.$editable.h6 = 1

  // @ts-ignore
  CKEDITOR.disableAutoInline = true

  const createCKEditorInstance = (el: HTMLElement) => {
    // Get dynamic options
    const dynamicOptions = getOpts(c.options)

    // @ts-ignore
    return CKEDITOR.inline(el, { ...c.options, ...dynamicOptions })
  }

  editor.setCustomRte({
    enable(el, rte) {
      // If already exists I'll just focus on it
      if (rte && rte.status != 'destroyed') {
        this.focus(el, rte)

        return rte
      }

      el.contentEditable = true

      // Seems like 'sharedspace' plugin doesn't work exactly as expected
      // so will help hiding other toolbars already created
      let rteToolbar = editor.RichTextEditor.getToolbarEl()

      ;[].forEach.call(rteToolbar.children, child => {
        child.style.display = 'none'
      })

      // Check for the mandatory options
      let opt = c.options

      let plgName = 'sharedspace'

      if (opt.extraPlugins) {
        if (typeof opt.extraPlugins === 'string') {
          opt.extraPlugins += `,${plgName}`
        } else {
          opt.extraPlugins.push(plgName)
        }
      } else {
        opt.extraPlugins = plgName
      }

      if (!c.options.sharedSpaces) {
        c.options.sharedSpaces = { top: rteToolbar }
      }

      // Init CKEditor
      rte = createCKEditorInstance(el)
      // Implement the `rte.getContent` method
      // so that GrapesJS is able to get CKE's output generated by `rte.getData`
      // More info: https://github.com/artf/grapesjs/issues/2916
      rte.getContent = rte.getData

      // We should disable CKEditor's paste to prevent duplication of content
      rte.on('paste', e => {
        e.data.dataValue = ''
      })

      // Make click event propagate
      rte.on('contentDom', () => {
        let editable = rte.editable()

        editable.attachListener(editable, 'click', () => {
          el.click()
        })
      })

      // The toolbar is not immediately loaded so will be wrong positioned.
      // With this trick we trigger an event which updates the toolbar position
      rte.on('instanceReady', e => {
        rte.ui.space('top')?.setStyle('width', '405px')

        let toolbar = rteToolbar.querySelector(`#cke_${rte.name}`)

        if (toolbar) {
          toolbar.style.display = 'block'
        }

        editor.trigger('canvasScroll')
      })

      // Prevent blur when some of CKEditor's element is clicked
      rte.on('dialogShow', e => {
        const editorEls = editor.$('.cke_dialog_background_cover, .cke_dialog')

        ;['off', 'on'].forEach(m => editorEls[m]('mousedown', stopPropagation))
      })

      rte.on(
        'doubleclick',
        evt => {
          const element = evt.data.element

          if (element.is('a')) {
            evt.stop() // don't do the other listeners
          }
        },
        null,
        null,
        1
      )

      this.focus(el, rte)

      editor.once('rendered', () => {
        if (rte && rte.status !== 'destroyed') {
          rte.destroy(true)
        }
      })

      return rte
    },

    disable(el, rte) {
      el.contentEditable = false

      if (rte && rte.focusManager) {
        rte.focusManager.blur(true)
      }

      // Close the current dialog before destroying the editor
      // @ts-ignore
      CKEDITOR.dialog.getCurrent()?.hide()

      if (rte && rte.status !== 'destroyed') {
        rte.destroy(true)
      }
    },

    focus(el, rte) {
      el.contentEditable = true

      // Do nothing if already focused
      if (rte && rte.focusManager.hasFocus) {
        return
      }

      editor.RichTextEditor.updatePosition()
      setTimeout(() => {
        rte && rte.focus()
      }, 200)
    }
  })

  // Apply all available patches
  supportNunjucksVariables()
  preloadEditorAssets(editor, createCKEditorInstance)
}
