/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview The "placeholder" plugin.
 *
 */

;(function () {
  // eslint-disable-next-line no-undef
  CKEDITOR.plugins.add('placeholder', {
    requires: 'widget,dialog',
    lang: 'en', // %REMOVE_LINE_CORE%
    icons: 'placeholder', // %REMOVE_LINE_CORE%
    hidpi: true, // %REMOVE_LINE_CORE%

    onLoad() {
      // Register styles for placeholder widget frame.
      // eslint-disable-next-line no-undef
      CKEDITOR.addCss('.cke_placeholder{background-color:#ff0}')
    },

    init(editor) {
      let lang = editor.lang.placeholder

      // Register dialog.
      // eslint-disable-next-line no-undef
      CKEDITOR.dialog.add('placeholder', `${this.path}dialogs/placeholder.js`)

      // Put ur init code here.
      editor.widgets.add('placeholder', {
        // Widget code.
        dialog: 'placeholder',
        pathName: lang.pathName,
        // We need to have wrapping element, otherwise there are issues in
        // add dialog.
        draggable: false,
        template: '<span class="cke_placeholder">{{}}</span>',

        downcast() {
          // eslint-disable-next-line no-undef
          return new CKEDITOR.htmlParser.text(
            `{{${this.data.name} or "${this.data.fallback}"}}`
          )
        },

        init() {
          // Note that placeholder markup characters are stripped for the name.
          const [name, fallback = ''] = this.element
            .getText()
            .slice(2, -2)
            .split(' or ')

          this.setData('name', name)
          this.setData('fallback', fallback.split('"').join(''))
        },

        data() {
          this.element.setText(
            `{{${this.data.name} or "${this.data.fallback}"}}`
          )
        },

        getLabel() {
          return this.editor.lang.widget.label.replace(
            /%1/,
            `${this.data.name} ${this.pathName}`
          )
        }
      })

      editor.ui.addButton &&
        editor.ui.addButton('CreatePlaceholder', {
          label: lang.toolbar,
          command: 'placeholder',
          toolbar: 'insert,5',
          icon: 'placeholder'
        })
    },

    afterInit(editor) {
      let placeholderReplaceRegex = /\{\{([^\{\}])+\}\}/g

      editor.dataProcessor.dataFilter.addRules({
        text(text, node) {
          // eslint-disable-next-line no-undef
          let dtd = node.parent && CKEDITOR.dtd[node.parent.name]

          // Skip the case when placeholder is in elements like <title> or <textarea>
          // but upcast placeholder in custom elements (no DTD).
          if (dtd && !dtd.span) {
            return
          }

          return text.replace(placeholderReplaceRegex, function (match) {
            // Creating widget code.
            let widgetWrapper = null
            // eslint-disable-next-line no-undef
            let innerElement = new CKEDITOR.htmlParser.element('span', {
              class: 'cke_placeholder'
            })

            // Adds placeholder identifier as innertext.
            // eslint-disable-next-line no-undef
            innerElement.add(new CKEDITOR.htmlParser.text(match))
            widgetWrapper = editor.widgets.wrapElement(
              innerElement,
              'placeholder'
            )

            // Return outerhtml of widget wrapper so it will be placed
            // as replacement.
            return `${widgetWrapper.getOuterHtml()}`
          })
        }
      })
    }
  })
})()
