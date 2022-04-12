import { useState, useCallback } from 'react'

import {
  Grid,
  Button,
  TextField,
  Select,
  TextareaAutosize,
  MenuItem,
  InputAdornment,
  makeStyles
} from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import DealsAndListingsAndPlacesSearchInput from 'components/DealsAndListingsAndPlacesSearchInput'
import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'

import {
  getFormattedUrl,
  validateListingUrl,
  getListingUrlTypeLabel,
  getListingUrlTypeFieldPlaceholder,
  getListingFullAddress
} from '../helpers'
import {
  HipPocketListingField,
  HipPocketListingFormFields,
  HipPocketListingFormProps
} from '../types'

import ImageGallery from './components/ImageGallery'
import ImageUpload from './components/ImageUpload'

const useStyles = makeStyles(
  () => ({
    urlTypeSelect: {
      '&:focus': {
        background: 'transparent'
      }
    }
  }),
  {
    name: 'HipPocketListingForm'
  }
)

export default function HipPocketListingForm<T extends HipPocketListingField>({
  disabledFields = [],
  saveButtonText = 'Save Listing',
  onImageUpload,
  onSave
}: HipPocketListingFormProps<T>) {
  const classes = useStyles()
  const { control, formState, errors, watch, trigger, handleSubmit, setValue } =
    useForm<HipPocketListingFormFields>({
      mode: 'onChange',
      defaultValues: {
        images: [],
        address: '',
        price: undefined,
        lot_size_area: undefined,
        sqft: undefined,
        bedrooms: undefined,
        full_baths: undefined,
        half_baths: undefined,
        description: '',
        url: '',
        url_type: 'url'
      }
    })

  const urlType = watch('url_type')
  const images = watch('images')

  const [isDescriptionFieldVisible, setIsDescriptionFieldVisible] =
    useState<boolean>(false)

  const [uploadingImages, setUploadingImages] = useState<string[]>([])

  const handleImageUpload = async (files: File[]): Promise<string[]> => {
    if (!onImageUpload) {
      return []
    }

    const newUploadingImages = await Promise.all(files.map(readFileAsDataUrl))

    setUploadingImages(newUploadingImages)

    const uploadedImagesUrls = await onImageUpload(files)

    const newImages = [...images, ...uploadedImagesUrls]

    setUploadingImages([])

    return newImages
  }

  const handleSave = ({ url_type, ...fields }: HipPocketListingFormFields) => {
    disabledFields.forEach(field => {
      delete fields[field]
    })

    return onSave({ ...fields })
  }

  const handleRemoveImage = (imageUrl: string) => {
    const newImages = images.filter(image => image !== imageUrl)

    setValue('images', newImages)
  }

  const isFieldEnabled = useCallback(
    (fieldName: HipPocketListingField) => {
      return !disabledFields.includes(fieldName as T)
    },
    [disabledFields]
  )

  const isSubmitButtonDisabled =
    !formState.isValid || formState.isSubmitting || uploadingImages.length > 0

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Grid container direction="column" spacing={4}>
        {isFieldEnabled('images') && onImageUpload && (
          <Controller
            control={control}
            name="images"
            render={({ onChange, value }) => (
              <>
                <ImageGallery
                  images={value}
                  uploadingImages={uploadingImages}
                  onImageRemove={handleRemoveImage}
                />
                <ImageUpload
                  onImageUpload={async (files: File[]) => {
                    const urls = await handleImageUpload(files)

                    onChange(urls)
                  }}
                  onImageSelect={url => {
                    onChange([...images, url])
                  }}
                />
              </>
            )}
          />
        )}
        {isFieldEnabled('address') && (
          <Grid item xs={12}>
            <Controller
              control={control}
              name="address"
              render={({ onChange }) => (
                <DealsAndListingsAndPlacesSearchInput
                  textFieldProps={{
                    label: 'Address',
                    variant: 'outlined',
                    size: 'small'
                  }}
                  searchTypes={['listing', 'place']}
                  onSelect={async result => {
                    const address =
                      result.type === 'place'
                        ? result.place.formatted_address
                        : result.type === 'listing'
                        ? await getListingFullAddress(result.listing)
                        : ''

                    onChange(address)
                  }}
                />
              )}
            />
          </Grid>
        )}
        <Grid container item direction="row" spacing={2}>
          {isFieldEnabled('price') && (
            <Grid item xs={12}>
              <Controller
                control={control}
                name="price"
                rules={{
                  valueAsNumber: true,
                  min: 0,
                  max: Number.MAX_SAFE_INTEGER
                }}
                fullWidth
                error={!!errors.price}
                helperText={errors.price?.message}
                variant="outlined"
                type="number"
                size="small"
                label="Listing Price"
                as={<TextField />}
              />
            </Grid>
          )}
        </Grid>
        <Grid container item direction="row" spacing={2}>
          {isFieldEnabled('sqft') && (
            <Grid item xs={6}>
              <Controller
                control={control}
                name="sqft"
                rules={{
                  valueAsNumber: true,
                  min: 0,
                  max: Number.MAX_SAFE_INTEGER
                }}
                fullWidth
                error={!!errors.sqft}
                helperText={errors.sqft?.message}
                variant="outlined"
                type="number"
                size="small"
                label="Sqft"
                as={<TextField />}
              />
            </Grid>
          )}
          {isFieldEnabled('lot_size_area') && (
            <Grid item xs={6}>
              <Controller
                control={control}
                name="lot_size_area"
                rules={{
                  valueAsNumber: true,
                  min: 0,
                  max: Number.MAX_SAFE_INTEGER
                }}
                fullWidth
                error={!!errors.lot_size_area}
                helperText={errors.lot_size_area?.message}
                variant="outlined"
                type="number"
                size="small"
                label="Lot size (Acres)"
                as={<TextField />}
              />
            </Grid>
          )}
        </Grid>

        <Grid container item direction="row" spacing={2}>
          {isFieldEnabled('bedrooms') && (
            <Grid item xs={4}>
              <Controller
                control={control}
                name="bedrooms"
                rules={{
                  valueAsNumber: true,
                  min: 0,
                  max: Number.MAX_SAFE_INTEGER
                }}
                fullWidth
                error={!!errors.bedrooms}
                helperText={errors.bedrooms?.message}
                variant="outlined"
                type="number"
                size="small"
                label="Bedrooms"
                as={<TextField />}
              />
            </Grid>
          )}
          {isFieldEnabled('full_baths') && (
            <Grid item xs={4}>
              <Controller
                control={control}
                name="full_baths"
                rules={{
                  valueAsNumber: true,
                  min: 0,
                  max: Number.MAX_SAFE_INTEGER
                }}
                fullWidth
                error={!!errors.full_baths}
                helperText={errors.full_baths?.message}
                variant="outlined"
                type="number"
                size="small"
                label="Full Baths"
                as={<TextField />}
              />
            </Grid>
          )}
          {isFieldEnabled('half_baths') && (
            <Grid item xs={4}>
              <Controller
                control={control}
                name="half_baths"
                rules={{
                  valueAsNumber: true,
                  min: 0,
                  max: Number.MAX_SAFE_INTEGER
                }}
                fullWidth
                error={!!errors.half_baths}
                helperText={errors.half_baths?.message}
                variant="outlined"
                type="number"
                size="small"
                label="Half Baths"
                as={<TextField />}
              />
            </Grid>
          )}
        </Grid>

        {isFieldEnabled('url') && (
          <Grid container item direction="row" spacing={2}>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="url"
                rules={{
                  validate: (value: string) =>
                    validateListingUrl(value, urlType),
                  setValueAs: value => {
                    return getFormattedUrl(value ?? '', urlType)
                  }
                }}
                as={
                  <TextField
                    fullWidth
                    helperText={errors.url?.message}
                    error={!!errors.url}
                    type={urlType === 'url' ? 'text' : urlType}
                    variant="outlined"
                    size="small"
                    label="Listing URL"
                    placeholder={getListingUrlTypeFieldPlaceholder(urlType)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Controller
                            control={control}
                            name="url_type"
                            rules={{
                              setValueAs: value => {
                                setImmediate(() => trigger('url'))

                                return value
                              }
                            }}
                            render={({ value, onChange }) => {
                              return (
                                <Select
                                  disableUnderline
                                  value={value}
                                  onChange={onChange}
                                  classes={{
                                    select: classes.urlTypeSelect
                                  }}
                                >
                                  <MenuItem value="url">
                                    {getListingUrlTypeLabel('url')}
                                  </MenuItem>
                                  <MenuItem value="email">
                                    {getListingUrlTypeLabel('email')}
                                  </MenuItem>
                                  <MenuItem value="tel">
                                    {getListingUrlTypeLabel('tel')}
                                  </MenuItem>
                                </Select>
                              )
                            }}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        )}

        {isFieldEnabled('description') && isDescriptionFieldVisible && (
          <Grid container item>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="description"
                as={
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    variant="outlined"
                    size="small"
                    label="Description"
                    InputProps={{
                      inputComponent: TextareaAutosize
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        )}

        <Grid container item direction="row" justify="space-between">
          <Grid item>
            {isFieldEnabled('description') && !isDescriptionFieldVisible && (
              <Button
                variant="text"
                color="secondary"
                size="small"
                onClick={() => setIsDescriptionFieldVisible(true)}
              >
                Add Description
              </Button>
            )}
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
              disabled={isSubmitButtonDisabled}
            >
              {saveButtonText}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}
