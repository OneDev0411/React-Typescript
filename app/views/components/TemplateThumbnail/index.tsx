import { useState, useRef } from 'react'
import { useDeepCompareEffect } from 'react-use'
import { Box, Theme, fade, makeStyles } from '@material-ui/core'

import { loadTemplateHtml } from 'models/instant-marketing'

import CardSkeleton from 'components/CardSkeleton'
import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { renderMjml } from 'components/TemplatePreview/helpers'
import { getTemplateRenderData } from 'components/InstantMarketing/Builder/utils/get-template-render-data'
import { isTemplateInstance } from 'components/InstantMarketing/Builder/utils/helpers'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden'
    },
    loadingContainer: {
      position: 'absolute',
      opacity: 0.5,
      width: '100%',
      height: '100%',
      zIndex: 1,
      top: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    iframe: {
      zIndex: 0,
      transformOrigin: '0 0',
      height: 300,
      background: '#fff',
      opacity: 0
    },
    iframePlaceholder: {
      zIndex: 1,
      transition: '0.2s ease-in background-color',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: fade(theme.palette.common.black, 0.1)
      }
    }
  }),
  {
    name: 'MarketingTemplateThumbnail'
  }
)

interface Props {
  template: IBrandMarketingTemplate | IMarketingTemplateInstance
  brand: IBrand
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
  data,
  onClick
}: Props) {
  const classes = useStyles()
  const ref = useRef<HTMLIFrameElement>(null)
  const [previewMarkup, setPreviewMarkup] = useState<string>('')
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(true)

  useDeepCompareEffect(() => {
    async function loadTemplate() {
      try {
        const markup = isTemplateInstance(template)
          ? template.html
          : await loadTemplateHtml(template)

        const renderData = getTemplateRenderData(brand)

        const nunjucksRenderedTemplate = nunjucks.renderString(markup, {
          ...renderData,
          ...data
        })

        if (!template.template.mjml) {
          setPreviewMarkup(nunjucksRenderedTemplate)

          return
        }

        const response = await renderMjml(nunjucksRenderedTemplate)

        setPreviewMarkup(response.html)
      } catch (err) {
        console.error(err)
      }
    }

    loadTemplate()
  }, [template, brand, data])

  useDeepCompareEffect(() => {
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

      const iframeWidth = ref.current.contentDocument.body.offsetWidth

      const iframeHeight = ref.current.contentDocument.body.offsetHeight

      const ratio = widthSpace / iframeWidth

      ref.current.style.transform = `scale(${ratio})`
      ref.current.style.width = `${iframeWidth}px`
      ref.current.style.height = `${iframeHeight}px`

      ref.current.style.opacity = '1'

      if (ref.current.parentElement) {
        ref.current.parentElement.style.height = `${ratio * iframeHeight}px`
        ref.current.parentElement.style.width = `${ratio * iframeWidth}px`
        setIsLoadingPreview(false)
      }
    }
  }, [ref, previewMarkup, onClick])

  return (
    <div className={classes.container}>
      {isLoadingPreview ? (
        <div className={classes.loadingContainer}>
          <CardSkeleton style={{ padding: '0 1rem', width: '100%' }} />
        </div>
      ) : (
        <Box
          width="100%"
          height="100%"
          position="absolute"
          className={classes.iframePlaceholder}
          onClick={onClick}
        />
      )}
      <iframe
        width="100%"
        ref={ref}
        scrolling="no"
        frameBorder={0}
        title="Preview"
        className={classes.iframe}
      />
    </div>
  )
}
