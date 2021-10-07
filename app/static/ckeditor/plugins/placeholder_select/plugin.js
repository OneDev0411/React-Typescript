/**
 * A plugin to enable placeholder tokens to be inserted into the CKEditor message. Use on its own or with teh placeholder plugin.
 * The default format is compatible with the placeholders syntex
 *
 * @version 0.1
 * @Author Troy Lutton
 * @license MIT
 *
 * This is a pure modification for the placeholders plugin. All credit goes to Stuart Sillitoe for creating the original (stuartsillitoe.co.uk)
 *
 */

// eslint-disable-next-line no-undef
CKEDITOR.plugins.add('placeholder_select', {
  requires: ['richcombo'],
  init(editor) {
    const defaultConfig = {
      format: '[[ %placeholder% ]]',
      placeholders: []
    }

    // eslint-disable-next-line no-undef
    const config = CKEDITOR.tools.extend(
      defaultConfig,
      editor.config.placeholder_select || {},
      true
    )

    // add the menu to the editor
    editor.ui.addRichCombo('placeholder_select', {
      label: 'Placeholders',
      title: 'Placeholders',
      voiceLabel: 'Insert placeholder',
      className: 'cke_format',
      multiSelect: false,
      panel: {
        // eslint-disable-next-line no-undef
        css: [editor.config.contentsCss, CKEDITOR.skin.getPath('editor')],
        voiceLabel: editor.lang.panelVoiceLabel
      },

      init() {
        config.placeholders.forEach(placeholderGroup => {
          this.startGroup(placeholderGroup.title)
          placeholderGroup.items.forEach(placeholder => {
            const placeholderValue = config.format
              .replace('%placeholder%', placeholder.value)
              .replace('%fallback%', placeholder.fallback)

            this.add(placeholderValue, placeholder.label)
          })
        })
      },

      onClick(value) {
        editor.focus()
        editor.fire('saveSnapshot')
        editor.insertHtml(value)
        editor.fire('saveSnapshot')
      }
    })
  }
})
