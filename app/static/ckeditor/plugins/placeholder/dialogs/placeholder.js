/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Definition for placeholder plugin dialog.
 *
 */

'use strict'

CKEDITOR.dialog.add('placeholder', function (editor) {
  let lang = editor.lang.placeholder
  let generalLabel = editor.lang.common.generalTab
  let validFallbackRegex = /^[^\[\]<>]+$/

  return {
    title: lang.title,
    minWidth: 300,
    minHeight: 80,
    contents: [
      {
        id: 'info',
        label: generalLabel,
        title: generalLabel,
        elements: [
          // Dialog window UI elements.
          {
            id: 'name',
            type: 'select',
            style: 'width: 100%;',
            label: lang.name,
            items:
              editor.config.placeholder.items.map(item => [
                item.label,
                item.value
              ]) || [],
            required: true,
            default: 'recipient.display_name',
            setup(widget) {
              if (widget.data.name) {
                this.setValue(widget.data.name)
              }
            },
            commit(widget) {
              widget.setData('name', this.getValue())
            }
          },
          {
            id: 'fallback',
            type: 'text',
            style: 'width: 100%;',
            label: lang.fallback,
            default: '',
            required: true,
            validate: CKEDITOR.dialog.validate.regex(
              validFallbackRegex,
              lang.invalidFallback
            ),
            setup(widget) {
              this.setValue(widget.data.fallback)
            },
            commit(widget) {
              widget.setData('fallback', this.getValue())
            }
          }
        ]
      }
    ]
  }
})
