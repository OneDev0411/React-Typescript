import { Editor } from 'grapesjs'

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

  let c = opts

  let defaults = {
    // On which side of the element to position the toolbar
    // Available options: 'left|center|right'
    position: 'left',

    // CKEditor Options
    options: {
      extraPlugins: 'placeholder_select',
      colorButton_colors: colors.map(color => color.replace('#', '')).join(','),
      line_height: CK_EDITOR_LINE_HEIGHT_VALUES.join(';'),
      contentsCss: getFontFamiliesCSSFiles(fontFamilies),
      font_names: fontNames.join(';'),
      colorButton_enableMore: false,
      qtWidth: '100%',
      linkDefaultProtocol: 'https://',
      linkShowAdvancedTab: false,
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
        ],
        '/',
        ['placeholder_select']
      ],
      placeholder_select: {
        placeholders: [
          {
            title: 'User',
            items: [
              {
                value: 'user.first_name',
                label: 'First Name',
                fallback: "User's First Name"
              },
              {
                value: 'user.last_name',
                label: 'Last Name',
                fallback: "User's Last Name"
              },
              {
                value: 'user.display_name',
                label: 'Display Name',
                fallback: "User's Display Name"
              },
              {
                value: 'user.email',
                label: 'Email',
                fallback: "User's Email"
              },
              {
                value: 'user.phone_number',
                label: 'Phone Number',
                fallback: "User's Phone Number"
              }
            ]
          },
          {
            title: 'Recipient',
            items: [
              {
                value: 'recipient.first_name',
                label: 'First Name',
                fallback: "Recipient's First Name"
              },
              {
                value: 'recipient.last_name',
                label: 'Last Name',
                fallback: "Recipient's Last Name"
              },
              {
                value: 'recipient.display_name',
                label: 'Display Name',
                fallback: "Recipient's Display Name"
              },
              {
                value: 'recipient.email',
                label: 'Email',
                fallback: "Recipient's Email"
              },
              {
                value: 'recipient.phone_number',
                label: 'Phone Number',
                fallback: "Recipient's Phone Number"
              }
            ]
          }
        ],
        format: ' {{%placeholder% or "%fallback%"}} '
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

  editor.setCustomRte({
    enable(el, rte) {
      // If already exists we need to destory it
      // Not doing this causes some errors in CKEditor emoji and table plugins
      if (rte && rte.status !== 'destroyed') {
        rte.destroy()
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

      // Get dynamic options
      const dynamicOptions = getOpts(c.options)

      // Init CKEditor
      // @ts-ignore
      rte = CKEDITOR.inline(el, { ...c.options, ...dynamicOptions })

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

      this.focus(el, rte)

      editor.once('rendered', () => {
        rte.destroy()
      })

      return rte
    },

    disable(el, rte) {
      el.contentEditable = false

      if (rte && rte.focusManager) {
        rte.focusManager.blur(true)
      }
    },

    focus(el, rte) {
      // Do nothing if already focused
      if (rte && rte.focusManager.hasFocus) {
        return
      }

      el.contentEditable = true
      rte && rte.focus()
    }
  })
}
