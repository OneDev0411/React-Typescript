import React, { ReactNode } from 'react'
import { useForm } from 'react-hook-form'

import {
  Grid,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  InputAdornment
} from '@material-ui/core'

import type { ShowingPropertyPlace } from '../../types'
import ShowingPropertyFormSection from './ShowingPropertyFormSection'

type ShowingPropertyFormData = Omit<ShowingPropertyPlace, 'type'>

export interface ShowingPropertyFormProps {
  addressTitle?: string
  priceTitle?: string
  photoTitle?: string
  initialData: ShowingPropertyFormData
  onSubmit: (data: ShowingPropertyFormData) => void
  children?: ReactNode
}

type FieldValues = Record<
  keyof ShowingPropertyFormData['address'] | 'price',
  any
>

function ShowingPropertyForm({
  addressTitle = 'Edit Address',
  priceTitle = 'Add Price',
  photoTitle = 'Add Photo',
  initialData,
  onSubmit,
  children
}: ShowingPropertyFormProps) {
  const { register, handleSubmit, errors } = useForm<FieldValues>()
  const { address, gallery, price } = initialData

  const handleFormSubmit = (data: FieldValues) => {
    const newAddress = { ...data }

    delete newAddress.price

    onSubmit({
      address: {
        ...address,
        ...newAddress
      },
      gallery,
      price: data.price
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <ShowingPropertyFormSection title={addressTitle}>
        <Grid container spacing={1}>
          <Grid item lg={3}>
            <TextField
              name="house_num"
              label="Street Number"
              fullWidth
              defaultValue={address.unit}
              inputRef={register}
              error={!!errors.house_num}
              helperText={errors.house_num}
            />
          </Grid>
          <Grid item lg={3}>
            <FormControl fullWidth>
              <InputLabel>Dir</InputLabel>
              <Select
                name="predir"
                inputRef={register}
                displayEmpty
                defaultValue={address.predir}
              >
                <MenuItem aria-label="None" value="" />
                <MenuItem value="North">North</MenuItem>
                <MenuItem value="South">South</MenuItem>
                <MenuItem value="East">East</MenuItem>
                <MenuItem value="West">West</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="name"
              label="Street Name"
              fullWidth
              defaultValue={address.name}
              inputRef={register}
            />
          </Grid>
          <Grid item lg={2}>
            <TextField
              name="suftype"
              label="Suffix"
              fullWidth
              defaultValue={address.suftype}
              inputRef={register}
            />
          </Grid>
          <Grid item lg={3}>
            <TextField
              name="unit"
              label="Unit/Suit"
              fullWidth
              defaultValue={address.unit}
              inputRef={register}
            />
          </Grid>
          <Grid item lg={3}>
            <TextField
              name="city"
              label="City"
              fullWidth
              defaultValue={address.city}
              inputRef={register}
            />
          </Grid>
          <Grid item lg={2}>
            <TextField
              name="country"
              label="Country"
              fullWidth
              defaultValue={address.country}
              inputRef={register}
            />
          </Grid>
          <Grid item lg={2}>
            <TextField
              name="state"
              label="State"
              fullWidth
              defaultValue={address.state}
              inputRef={register}
            />
          </Grid>
          <Grid item lg={2}>
            <TextField
              name="postcode"
              label="Zip code"
              fullWidth
              defaultValue={address.postcode}
              inputRef={register}
            />
          </Grid>
        </Grid>
      </ShowingPropertyFormSection>

      <ShowingPropertyFormSection title={priceTitle} marginTop={5}>
        <Grid item lg={3}>
          <TextField
            name="price"
            label="Price"
            fullWidth
            defaultValue={price}
            inputRef={register}
            error={!!errors.price}
            helperText={errors.price}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              )
            }}
          />
        </Grid>
      </ShowingPropertyFormSection>

      <ShowingPropertyFormSection title={photoTitle} marginTop={5}>
        <Grid item>gallery photos</Grid>
      </ShowingPropertyFormSection>
      {children}
    </form>
  )
}

export default ShowingPropertyForm
