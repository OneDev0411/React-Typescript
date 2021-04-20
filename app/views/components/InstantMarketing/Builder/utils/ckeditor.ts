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

export function attachCKEditor(
  editor: Editor,
  fontFamilies: string[],
  colors: string[] = [],
  opts: any = {}
) {
  let c = opts

  let defaults = {
    // On which side of the element to position the toolbar
    // Available options: 'left|center|right'
    position: 'left',

    // CKEditor Options
    options: {
      colorButton_colors: colors.map(color => color.replace('#', '')).join(','),
      line_height: CK_EDITOR_LINE_HEIGHT_VALUES.join(';'),
      contentsCss: getFontFamiliesCSSFiles(fontFamilies),
      font_names: fontFamilies.join(';'),
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
        ['Font', 'FontSize', 'lineheight', 'TextColor', 'BGColor', 'EmojiPanel']
      ]
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

      // Init CkEditors
      // @ts-ignore
      rte = CKEDITOR.inline(el, c.options)

      // Make click event propogate
      rte.on('contentDom', () => {
        let editable = rte.editable()

        editable.attachListener(editable, 'click', () => {
          el.click()
        })
      })

      // The toolbar is not immediatly loaded so will be wrong positioned.
      // With this trick we trigger an event which updates the toolbar position
      rte.on('instanceReady', e => {
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

  // Update RTE toolbar position
  editor.on('rteToolbarPosUpdate', pos => {
    // Update by position
    switch (c.position) {
      case 'center':
        let diff = pos.elementWidth / 2 - pos.targetWidth / 2

        pos.left = pos.elementLeft + diff
        break
      case 'right':
        let width = pos.targetWidth

        pos.left = pos.elementLeft + pos.elementWidth - width
        break
    }

    if (pos.top <= pos.canvasTop) {
      pos.top = pos.elementTop + pos.elementHeight
    }

    // Check if not outside of the canvas
    if (pos.left < pos.canvasLeft) {
      pos.left = pos.canvasLeft
    }
  })
}
