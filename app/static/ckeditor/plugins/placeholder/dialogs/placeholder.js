// eslint-disable-next-line no-undef
CKEDITOR.dialog.add('placeholder', editor => {
  let lang = editor.lang.placeholder
  let generalLabel = editor.lang.common.generalTab
  let validFallbackRegex = /^$|^[^\[\]<>]+$/

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
            required: false,
            // eslint-disable-next-line no-undef
            validate: CKEDITOR.dialog.validate.regex(
              validFallbackRegex,
              lang.invalidFallback
            ),
            setup(widget) {
              if (widget.data.fallback) {
                this.setValue(widget.data.fallback)
              }
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
