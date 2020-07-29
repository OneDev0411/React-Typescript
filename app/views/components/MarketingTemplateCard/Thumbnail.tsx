import React, { useState, useEffect } from 'react'
import { useEffectOnce } from 'react-use'

import { makeStyles } from '@material-ui/core'

// import { getTemplateImage } from 'utils/marketing-center/helpers'
import { getFileType } from 'utils/file-utils/get-file-type'
import { getActiveBrand } from 'utils/user-teams'
import { loadTemplateHtml } from 'models/instant-marketing'

import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import { PdfThumbnail } from 'components/PdfThumbnail'
import TemplateThumbnail from 'components/TemplateThumbnail'

const useStyles = makeStyles(() => ({
  templateThumbnailWrapper: {
    transformOrigin: '0 0',
    transform: 'scaleX(0.385) scaleY(0.365)', // pure hack :facepalm:
    position: 'absolute',
    top: 0,
    left: 0
  }
}))

interface Props {
  template: IMarketingTemplateInstance | IBrandMarketingTemplate
  user: IUser
  className: string
}

export function Thumbnail({ template, user, className }: Props) {
  const classes = useStyles()
  const brand = getActiveBrand(user)
  const [width, setWidth] = useState('auto')
  const [height, setHeight] = useState('auto')
  const [templateMarkup, setTemplateMarkup] = useState<string>('')
  const [mockListing, setMockListing] = useState<Optional<IListing>>(undefined)

  useEffect(() => {
    async function fetchTemplateMarkup() {
      if (template.type === 'template_instance') {
        return
      }

      try {
        const markup = await loadTemplateHtml(template)

        setTemplateMarkup(markup)
      } catch (err) {
        console.error(err)
        setTemplateMarkup('')
      }
    }

    fetchTemplateMarkup()
  }, [template])

  useEffectOnce(() => {
    async function fetchMockListing() {
      const listing = await getMockListing()

      setMockListing((listing as any) as IListing)
    }

    fetchMockListing()
  })

  if (
    template.type === 'template_instance' &&
    getFileType(template.file) === 'pdf'
  ) {
    return <PdfThumbnail url={template.file.url} />
  }

  if (!brand) {
    return null
  }

  return (
    <div
      className={classes.templateThumbnailWrapper}
      style={{
        width,
        height
      }}
    >
      <TemplateThumbnail
        template={templateMarkup}
        mjml={template.template.mjml}
        brand={brand}
        data={{ listing: mockListing, user }}
        setDimensions={(width, height) => {
          setWidth(width)
          setHeight(height)
        }}
      />
    </div>
  )

  // const { thumbnail } = getTemplateImage(template)

  // if (template.template.video) {
  //   return <video src={thumbnail} muted autoPlay />
  // }

  // return (
  //   <img alt={template.template.name} src={thumbnail} className={className} />
  // )
}
