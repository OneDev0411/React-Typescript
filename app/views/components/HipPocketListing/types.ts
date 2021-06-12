export interface HipPocketListing {
  images: string[]
  address: string
  price: number
  sqft: number
  bedrooms: number
  full_baths: number
  half_baths: number
  url?: string
  description?: string
}

export interface HipPocketListingFields extends HipPocketListing {
  url_type: HipPocketListingUrlType
}

export interface HipPocketListingFormProps {
  saveButtonText?: string
  onImageUpload?: (files: File[]) => Promise<string[]>
  onSave: (data: HipPocketListing) => void
}

export type ImageUploadProps = Required<
  Pick<HipPocketListingFormProps, 'onImageUpload'>
>

export type ImageGalleryProps = Pick<HipPocketListing, 'images'>

export type HipPocketListingUrlType = 'url' | 'email' | 'tel'
