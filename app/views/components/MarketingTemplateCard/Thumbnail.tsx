import { useState, useEffect, ComponentProps } from 'react'

import { makeStyles } from '@material-ui/core'
import { useInView } from 'react-intersection-observer'

import { PdfThumbnail } from 'components/PdfThumbnail'
import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import TemplateThumbnail from 'components/TemplateThumbnail'
import { useUnsafeActiveBrand } from 'hooks/brand/use-unsafe-active-brand'
import { getFileType } from 'utils/file-utils/get-file-type'
import { getTemplateImage } from 'utils/marketing-center/helpers'

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
  const activeBrand = useUnsafeActiveBrand()
  const { ref, inView } = useInView({ delay: 100 })
  const [isAlreadyLoaded, setIsAlreadyLoaded] = useState<boolean>(false)
  const classes = useStyles()
  const [listing, setListing] = useState<Optional<IListing>>(undefined)

  useEffect(() => {
    async function fetchListingIfNeeded() {
      if (receivedListing) {
        setListing(receivedListing)

        return
      }

      const listing = await getMockListing()

      setListing(listing as unknown as IListing)
    }

    fetchListingIfNeeded()
  }, [receivedListing])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isAlreadyLoaded && inView) {
        setIsAlreadyLoaded(true)
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [inView, isAlreadyLoaded])

  const shouldRender = isAlreadyLoaded || inView

  if (
    template.type === 'template_instance' &&
    getFileType(template.file) === 'pdf'
  ) {
    return (
      <div ref={ref}>
        {shouldRender && <PdfThumbnail url={template.file.url} />}
      </div>
    )
  }

  if (!activeBrand) {
    return null
  }

  if (useStaticImage) {
    const { thumbnail } = getTemplateImage(template)

    return template.template.video ? (
      <div ref={ref}>
        {shouldRender && <video src={thumbnail} muted autoPlay />}
      </div>
    ) : (
      <div ref={ref}>
        {shouldRender && (
          <img
            alt={template.template.name}
            src={thumbnail}
            className={classes.image}
          />
        )}
      </div>
    )
  }

  return (
    <div className={classes.templateThumbnailWrapper} ref={ref}>
      {shouldRender && (
        <TemplateThumbnail
          template={template}
          brand={activeBrand}
          data={{ listing, user }}
          onClick={onClick}
        />
      )}
    </div>
  )
}
