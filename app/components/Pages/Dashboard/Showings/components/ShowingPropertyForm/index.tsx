import React, { ReactNode } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { Grid, TextField } from '@material-ui/core'

import { normalizePostgressStdaddr } from 'components/inline-editable-fields/InlineAddressField/InlineAddressForm/helpers/normalize-postgres-stdaddr'

import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import type { ShowingPropertyPlace } from '../../types'
import ShowingPropertyFormSection from './ShowingPropertyFormSection'

type ShowingPropertyFormData = Omit<ShowingPropertyPlace, 'type'>

export interface ShowingPropertyFormProps {
  addressTitle?: string
  photoTitle?: string
  initialData: ShowingPropertyFormData
  onSubmit: (data: ShowingPropertyFormData) => void
  children?: ReactNode
}

interface FieldValues {
  address: IStdAddr
}

function ShowingPropertyForm({
  addressTitle = 'Edit Address',
  photoTitle = 'Add Photo',
  initialData,
  onSubmit,
  children
}: ShowingPropertyFormProps) {
  const { handleSubmit, control } = useForm<FieldValues>()
  const { address, gallery } = initialData

  const handleFormSubmit = (data: FieldValues) => {
    onSubmit({
      address: {
        ...address,
        ...data.address
      },
      gallery
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <ShowingPropertyFormSection title={addressTitle}>
          <Controller
            name="address"
            control={control}
            defaultValue={address}
            render={({ onChange, value }) => (
              <InlineAddressField
                key={value.full} // Patch the internal state issue of InlineAddressField
                address={value.full}
                handleSubmit={onChange}
                preSaveFormat={normalizePostgressStdaddr}
                closeAddressAndSuggestionOnSubmit
                renderSearchField={({ isLoading, ...otherInputProps }) => (
                  <TextField
                    {...otherInputProps}
                    fullWidth
                    label="Address"
                    autoComplete="disable-autocomplete"
                  />
                )}
              />
            )}
          />
        </ShowingPropertyFormSection>

        <ShowingPropertyFormSection
          title={photoTitle}
          marginTop={5}
          marginBottom={2}
        >
          <Grid item>Gallery Photos</Grid>
        </ShowingPropertyFormSection>
        {children}
      </form>
    </>
  )
}

export default ShowingPropertyForm
