import React, { useState, useRef } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { makeStyles } from '@material-ui/core'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { renderMjml } from 'components/TemplatePreview/helpers'

import {
  getMjmlTemplateRenderData,
  getNonMjmlTemplateRenderData
} from 'components/InstantMarketing/Builder/utils/get-template-render-data'

const useStyles = makeStyles(() => ({
  iframe: {}
}))

interface Props {
  template: string
  brand: IBrand
  mjml?: boolean
  data?: {
    listing?: Nullable<IListing>
    user?: Nullable<IUser>
    contact?: Nullable<IContact>
  }

  setDimensions?: (width: string, height: string) => void
}

export default function TemplateThumbnail({
  template,
  brand,
  mjml = true,
  data,
  setDimensions
}: Props) {
  const classes = useStyles()
  const ref = useRef<HTMLIFrameElement>(null)
  const [previewMarkup, setPreviewMarkup] = useState<string>('')

  useDeepCompareEffect(() => {
    async function loadTemplate() {
      const renderData = mjml
        ? getMjmlTemplateRenderData(brand)
        : getNonMjmlTemplateRenderData(brand)

      const nunjucksRenderedTemplate = nunjucks.renderString(template, {
        ...renderData,
        ...data
      })

      if (!mjml) {
        setPreviewMarkup(nunjucksRenderedTemplate)

        return
      }

      const response = await renderMjml(nunjucksRenderedTemplate)

      setPreviewMarkup(response.html)
    }

    loadTemplate()
  }, [template, brand, mjml, data])

  return (
    <iframe
      ref={ref}
      frameBorder={0}
      onLoad={() => {
        if (!ref.current?.contentWindow) {
          return
        }

        const newWidth = `${
          ref.current.contentWindow.document.body.scrollWidth + 50
        }px`

        const newHeight = `${
          ref.current.contentWindow.document.body.scrollHeight + 50
        }px`

        ref.current.style.width = newWidth
        ref.current.style.height = newHeight

        setDimensions && setDimensions(newWidth, newHeight)
      }}
      title="Preview"
      srcDoc={previewMarkup}
      className={classes.iframe}
    />
  )
}
