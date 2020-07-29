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
    transformOrigin: '0 0'
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

  // setDimensions?: (width: string, height: string) => void
}

export default function TemplateThumbnail({
  template,
  brand,
  mjml = true,
  data
}: // setDimensions
Props) {
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
    if (!ref.current?.contentWindow || !previewMarkup) {
      return
    }

    console.log('REF IS READY')
    console.log(ref.current.clientWidth)

    const widthSpace = ref.current.parentElement!.clientWidth

    ref.current.width = '285px'
    // ref.current.height = '2000px'

    ref.current.srcdoc = previewMarkup

    ref.current.onload = () => {
      if (!ref.current?.contentWindow) {
        return
      }

      const iframeWidth = ref.current.contentWindow.document.body.offsetWidth

      const iframeHeight = ref.current.contentWindow.document.body.offsetHeight

      const ratio = iframeWidth / widthSpace

      console.log({
        iframeWidth,
        iframeHeight,
        widthSpace,
        ratio
      })

      // debugger

      ref.current.style.transform = 'scale(0.5)'

      ref.current.style.width = `${iframeWidth}px`
      ref.current.style.height = `${iframeHeight}px`

      if (ref.current.parentElement) {
        ref.current.parentElement.style.height = `${ratio * iframeHeight}px`
        // ref.current.parentElement.style.height = `${ratio * iframeHeight}px`
      }
    }
  }, [ref, previewMarkup])

  return (
    <div>
      <iframe
        ref={ref}
        frameBorder={0}
        title="Preview"
        className={classes.iframe}
      />
    </div>
  )
}
