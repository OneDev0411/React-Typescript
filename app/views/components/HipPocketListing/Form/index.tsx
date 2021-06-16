import { useState, useCallback } from 'react'
import {
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  makeStyles
} from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import { readFileAsDataUrl } from 'utils/file-utils/read-file-as-data-url'

import ListingsAndPlacesSearchInput from 'components/ListingsAndPlacesSearchInput'

import ImageGallery from './components/ImageGallery'
import ImageUpload from './components/ImageUpload'
import {
  HipPocketListingField,
  HipPocketListingFormFields,
  HipPocketListingFormProps
} from '../types'
import {
  getFormattedUrl,
  validateListingUrl,
  getListingUrlTypeLabel,
  getListingUrlTypeFieldPlaceholder
} from '../helpers'

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
  const { control, formState, errors, watch, trigger, handleSubmit } =
    useForm<HipPocketListingFormFields>({
      mode: 'onChange',
      defaultValues: {
        bedrooms: 0,
        full_baths: 0,
        half_baths: 0,
        images: [],
        price: 0,
        sqft: 0,
        url: '',
        url_type: 'url',
        description: ''
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
                <ListingsAndPlacesSearchInput
                  textFieldProps={{
                    variant: 'outlined',
                    size: 'small',
                    label: 'Address'
                  }}
                  onSelect={result => {
                    const address =
                      result.type === 'place'
                        ? result.place.formatted_address
                        : result.listing.address.street_address

                    onChange(address)
                  }}
                />
              )}
            />
          </Grid>
        )}
        <Grid container item direction="row" spacing={2}>
          {isFieldEnabled('price') && (
            <Grid item xs={6}>
              <Controller
                control={control}
                name="price"
                rules={{
                  valueAsNumber: true,
                  min: 0
                }}
                as={
                  <TextField
                    fullWidth
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    variant="outlined"
                    size="small"
                    label="Listing Price"
                    type="number"
                  />
                }
              />
            </Grid>
          )}

          {isFieldEnabled('sqft') && (
            <Grid item xs={6}>
              <Controller
                control={control}
                name="sqft"
                rules={{
                  valueAsNumber: true,
                  min: 0
                }}
                as={
                  <TextField
                    fullWidth
                    error={!!errors.sqft}
                    helperText={errors.sqft?.message}
                    variant="outlined"
                    size="small"
                    label="Sqft"
                    type="number"
                  />
                }
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
                  min: 0
                }}
                as={
                  <TextField
                    fullWidth
                    error={!!errors.bedrooms}
                    helperText={errors.bedrooms?.message}
                    variant="outlined"
                    size="small"
                    label="Bedrooms"
                    type="number"
                  />
                }
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
                  min: 0
                }}
                as={
                  <TextField
                    fullWidth
                    error={!!errors.full_baths}
                    helperText={errors.full_baths?.message}
                    variant="outlined"
                    size="small"
                    label="Full Baths"
                    type="number"
                  />
                }
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
                  min: 0
                }}
                as={
                  <TextField
                    fullWidth
                    error={!!errors.half_baths}
                    helperText={errors.half_baths?.message}
                    variant="outlined"
                    size="small"
                    label="Half Baths"
                    type="number"
                  />
                }
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
                    type={urlType}
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
                    rows={3}
                    variant="outlined"
                    size="small"
                    label="Description"
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
