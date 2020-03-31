import React, { useState, useEffect } from 'react'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { Iframe } from 'components/Iframe'

import { renderMjml, getTemplatePreviewRenderData } from './helpers'

interface Props {
  template: string
  palette: BrandSettingsPalette
  data?: {
    listing?: Nullable<IListing>
    user?: Nullable<IUser>
    contact?: Nullable<IContact>
  }
}

export default function TemplatePreview({ template, palette, data }: Props) {
  const [previewMarkup, setPreviewMarkup] = useState<string>('')

  useEffect(() => {
    async function loadTemplate() {
      const renderData = getTemplatePreviewRenderData(palette)

      const nunjucksRenderedTemplate = nunjucks.renderString(template, {
        ...renderData,
        ...data
      })

      const response = await renderMjml(nunjucksRenderedTemplate)

      setPreviewMarkup(response.html)
    }

    loadTemplate()
  }, [palette, template, data])

  return <Iframe title="Preview" autoHeight fullWidth srcDoc={previewMarkup} />
}
