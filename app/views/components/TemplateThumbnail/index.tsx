import React, { useState, useEffect, useRef } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { makeStyles } from '@material-ui/core'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { renderMjml } from 'components/TemplatePreview/helpers'

import {
  getMjmlTemplateRenderData,
  getNonMjmlTemplateRenderData
} from 'components/InstantMarketing/Builder/utils/get-template-render-data'

const useStyles = makeStyles(() => ({
  iframe: {
    transformOrigin: '0 0',
    background: '#fff'
  }
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

  onClick?: () => void
}

export default function TemplateThumbnail({
  template,
  brand,
  mjml = true,
  data,
  onClick
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

  useEffect(() => {
    if (!ref.current || !previewMarkup) {
      return
    }

    const widthSpace = ref.current.clientWidth

    if (ref.current.srcdoc !== previewMarkup) {
      ref.current.srcdoc = previewMarkup
    }

    if (ref.current.width !== '100%') {
      return
    }

    ref.current.width = '700px'

    ref.current.onload = () => {
      if (!ref.current?.contentDocument) {
        return
      }

      // Iframe onclick hack!
      // More info: https://stackoverflow.com/questions/1609741/how-to-add-click-event-to-a-iframe-with-jquery
      if (onClick) {
        ref.current.contentDocument.body.onclick = onClick
      }

      const iframeWidth = ref.current.contentDocument.body.offsetWidth

      const iframeHeight = ref.current.contentDocument.body.offsetHeight

      const ratio = widthSpace / iframeWidth

      ref.current.style.transform = `scale(${ratio})`

      ref.current.style.width = `${iframeWidth}px`
      ref.current.style.height = `${iframeHeight}px`

      if (ref.current.parentElement) {
        ref.current.parentElement.style.height = `${ratio * iframeHeight}px`
        ref.current.parentElement.style.width = `${ratio * iframeWidth}px`
      }
    }
  }, [ref, previewMarkup, onClick])

  return (
    <div>
      <iframe
        width="100%"
        ref={ref}
        frameBorder={0}
        title="Preview"
        className={classes.iframe}
      />
    </div>
  )
}
