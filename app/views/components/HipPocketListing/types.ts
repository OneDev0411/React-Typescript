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
  /**
   * Save button copy/text
   *
   * The default value is `'Save Listing'`
   */
  saveButtonText?: string
  /**
   * The image upload handler for upload image button
   *
   * This function receives a file array and
   * it should return a promise of passed file links
   * as an string array
   */
  onImageUpload?: (files: File[]) => Promise<string[]>
  /**
   * The save button click handler
   */
  onSave: (data: HipPocketListing) => void
}

export interface HipPocketListingDrawerProps extends HipPocketListingFormProps {
  /**
   * The drawer title
   *
   * The default value is `'Listing Details'`
   */
  title?: string
  /**
   * The drawer open state
   */
  isOpen: boolean
  /**
   * The drawer close handler
   *
   * It can/shoud be used to change `isOpen` prop and close the drawer
   */
  onClose: () => void
}

export interface ImageUploadProps {
  onImageUpload: (files: File[]) => Promise<void>
  onImageSelect: (imageUrl: string) => void
}

export type ImageGalleryProps = Pick<HipPocketListing, 'images'>

export type HipPocketListingUrlType = 'url' | 'email' | 'tel'
