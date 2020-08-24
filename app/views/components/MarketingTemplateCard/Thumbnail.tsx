import React, { useState, useEffect } from 'react'

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
    margin: '0 auto'
  }
}))

interface Props {
  user: IUser
  template: IMarketingTemplateInstance | IBrandMarketingTemplate
  listing?: IListing

  onClick?: React.ComponentProps<typeof TemplateThumbnail>['onClick']
}

export function Thumbnail({
  user,
  template,
  listing: receivedListing,
  onClick
}: Props) {
  const classes = useStyles()
  const brand = getActiveBrand(user)
  const [templateMarkup, setTemplateMarkup] = useState<string>('')
  const [listing, setListing] = useState<Optional<IListing>>(undefined)

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

  useEffect(() => {
    async function fetchListingIfNeeded() {
      if (receivedListing) {
        setListing(receivedListing)

        return
      }

      const listing = await getMockListing()

      setListing((listing as unknown) as IListing)
    }

    fetchListingIfNeeded()
  }, [receivedListing])

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
    <div className={classes.templateThumbnailWrapper}>
      <TemplateThumbnail
        template={templateMarkup}
        mjml={template.template.mjml}
        brand={brand}
        data={{ listing, user }}
        onClick={onClick}
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
