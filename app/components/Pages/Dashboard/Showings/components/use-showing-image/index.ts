import Deal from 'models/Deal'

const defaultImageUrl = '/static/images/deals/group-146.svg'

export type UseShowingImageProps = Pick<IShowing, 'deal' | 'listing'>

function useShowingImage({ deal, listing }: UseShowingImageProps): string {
  return (
    Deal.get.field(deal, 'photo') ||
    (listing?.gallery_image_urls?.length && listing?.gallery_image_urls[0]) ||
    defaultImageUrl
  )
}

export default useShowingImage
