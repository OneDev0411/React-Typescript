import { useState } from 'react'
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

import ListingsAndPlacesSearchInput from 'components/ListingsAndPlacesSearchInput'

import ImageGallery from './components/ImageGallery'
import ImageUpload from './components/ImageUpload'
import {
  HipPocketListing,
  HipPocketListingFields,
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

export default function HipPocketListingForm({
  saveButtonText = 'Save Listing',
  onImageUpload,
  onSave
}: HipPocketListingFormProps) {
  const classes = useStyles()
  const { control, formState, errors, watch, trigger, setValue, handleSubmit } =
    useForm<HipPocketListingFields>({
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

  const handleImageUpload = async (files: File[]): Promise<string[]> => {
    if (!onImageUpload) {
      return []
    }

    const imageUrls = await onImageUpload(files)

    const newImages = [...images, ...imageUrls]

    setValue('images', newImages)

    return newImages
  }

  const handleSave = ({
    url_type,
    url,
    ...otherFields
  }: HipPocketListingFields) => {
    const data: HipPocketListing = {
      ...otherFields,
      url: getFormattedUrl(url ?? '', url_type)
    }

    return onSave(data)
  }

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Grid container direction="column" spacing={4}>
        {onImageUpload && (
          <Controller
            control={control}
            name="images"
            render={({ onChange, value }) => (
              <>
                <ImageGallery images={value} />
                <ImageUpload
                  onImageUpload={async (files: File[]) => {
                    const urls = await handleImageUpload(files)

                    onChange(urls)

                    return urls
                  }}
                />
              </>
            )}
          />
        )}
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
        <Grid container item direction="row" spacing={2}>
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
        </Grid>

        <Grid container item direction="row" spacing={2}>
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
        </Grid>

        <Grid container item direction="row" spacing={2}>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="url"
              rules={{
                validate: (value: string) => validateListingUrl(value, urlType)
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
                          render={({ value, onChange }) => {
                            return (
                              <Select
                                value={value}
                                onChange={event => {
                                  onChange(event)
                                  setImmediate(() => trigger('url'))
                                }}
                                disableUnderline
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

        {isDescriptionFieldVisible && (
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
            {!isDescriptionFieldVisible && (
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
              disabled={!formState.isValid || formState.isSubmitting}
            >
              {saveButtonText}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}
