import { useState, ComponentProps } from 'react'
import { makeStyles } from '@material-ui/core'
import { useDeepCompareEffect } from 'react-use'

import { getTemplateImage } from 'utils/marketing-center/helpers'
import { getFileType } from 'utils/file-utils/get-file-type'
import { getActiveBrand } from 'utils/user-teams'

import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import { PdfThumbnail } from 'components/PdfThumbnail'
import TemplateThumbnail from 'components/TemplateThumbnail'

const useStyles = makeStyles(
  () => ({
    image: {
      width: '100%'
    },
    templateThumbnailWrapper: {
      margin: '0 auto'
    }
  }),
  {
    name: 'MarketingTemplateCardThumbnail'
  }
)

interface Props {
  user: IUser
  template: IMarketingTemplateInstance | IBrandMarketingTemplate
  listing?: IListing
  useStaticImage?: boolean

  onClick?: ComponentProps<typeof TemplateThumbnail>['onClick']
}

export function Thumbnail({
  user,
  template,
  listing: receivedListing,
  useStaticImage,
  onClick
}: Props) {
  const classes = useStyles()
  const brand = getActiveBrand(user)
  const [listing, setListing] = useState<Optional<IListing>>(undefined)

  useDeepCompareEffect(() => {
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

  if (useStaticImage) {
    const { thumbnail } = getTemplateImage(template)

    return template.template.video ? (
      <video src={thumbnail} muted autoPlay />
    ) : (
      <img
        alt={template.template.name}
        src={thumbnail}
        className={classes.image}
      />
    )
  }

  return (
    <div className={classes.templateThumbnailWrapper}>
      <TemplateThumbnail
        template={template}
        brand={brand}
        data={{ listing, user }}
        onClick={onClick}
      />
    </div>
  )
}
