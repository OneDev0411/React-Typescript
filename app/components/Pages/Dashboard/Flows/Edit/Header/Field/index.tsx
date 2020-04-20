import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { Variant } from '@material-ui/core/styles/createTypography'

import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import { Container } from './styled'
import EditMode from './EditMode'

interface Props {
  value?: string
  disabled?: boolean
  validate: (value: string) => string
  variant: Variant
  name: 'name' | 'description'
  onChange: (value: string) => Promise<any>
}

export default function Field(props: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState(props.value || '')
  const [error, setError] = useState('')

  function onToggleEdit() {
    setIsEditing(!isEditing)
  }

  function onCancel() {
    setValue(props.value || '')
    setIsEditing(false)
  }

  async function onSave() {
    const trimmedValue = value.trim()

    const error = props.validate(trimmedValue)

    if (error) {
      setError(error)

      return
    }

    setError('')

    if (trimmedValue === props.value) {
      setIsEditing(false)
      setValue(props.value || '')

      return
    }

    setIsLoading(true)

    await props.onChange(trimmedValue)

    setIsEditing(false)
    setValue(trimmedValue)
    setIsLoading(false)
  }

  function renderViewMode() {
    return (
      <Container>
        {props.value && (
          <Typography variant={props.variant} noWrap>
            {props.value}
          </Typography>
        )}
        {!props.disabled && (
          <Typography
            style={props.value ? { marginLeft: '1rem' } : {}}
            variant="subtitle2"
            color="primary"
          >
            {props.value ? 'Edit' : `Add ${props.name}`}
          </Typography>
        )}
      </Container>
    )
  }

  function renderEditMode({ error }) {
    return (
      <EditMode
        value={value}
        placeholder={`Flow's ${[props.name]}`}
        style={
          props.variant === 'h5'
            ? { fontSize: '1.5rem', fontFamily: 'Merriweather' }
            : {}
        }
        onChange={setValue}
        error={error}
      />
    )
  }

  if (props.disabled) {
    return renderViewMode()
  }

  return (
    <InlineEditableField
      cancelOnOutsideClick
      isEditModeStatic
      error={error}
      isDisabled={isLoading}
      handleCancel={onCancel}
      handleSave={onSave}
      isEditing={isEditing}
      renderEditMode={renderEditMode}
      renderViewMode={renderViewMode}
      showEdit={false}
      showDelete={false}
      toggleMode={onToggleEdit}
    />
  )
}
