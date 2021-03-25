import React, { useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { Iframe } from 'components/Iframe'

import { renderMjml, getTemplatePreviewRenderData } from './helpers'

interface Props {
  template: string
  palette: BrandMarketingPalette
  data?: {
    listing?: Nullable<IListing>
    user?: Nullable<IUser>
    contact?: Nullable<IContact>
  }
}

export default function TemplatePreview({ template, palette, data }: Props) {
  const [previewMarkup, setPreviewMarkup] = useState<string>('')

  useDeepCompareEffect(() => {
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
