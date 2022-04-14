export interface HipPocketListing {
  images: string[]
  address: string
  price: number
  sqft: number
  lot_size_area: number
  bedrooms: number
  full_baths: number
  half_baths: number
  url?: string
  description?: string
}

export type HipPocketListingField = keyof HipPocketListing

export type HipPocketListingSubset<T extends HipPocketListingField> = Omit<
  HipPocketListing,
  T
>

export interface HipPocketListingFormFields extends HipPocketListing {
  url_type: HipPocketListingUrlType
}

export interface HipPocketListingFormProps<T extends HipPocketListingField> {
  /**
   * A typed string array of fields to disable and hide
   *
   * Note that it will affect the `onSave` handler data
   */
  disabledFields?: T[]
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
  onSave: (data: HipPocketListingSubset<T>) => void
}

export interface HipPocketListingDrawerProps<T extends HipPocketListingField>
  extends HipPocketListingFormProps<T> {
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

export type ImageGalleryProps = Pick<HipPocketListing, 'images'> & {
  uploadingImages: HipPocketListing['images']
  onImageRemove: (imageUrl: string) => void
}

export type HipPocketListingUrlType = 'url' | 'email' | 'tel'
