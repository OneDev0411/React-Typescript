import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { ThemeStyle } from '@material-ui/core/styles/createTypography'

import { InlineEditableField } from 'components/inline-editable-fields/InlineEditableField'

import { Container } from './styled'
import EditMode from './EditMode'

interface Props {
  value?: string
  disabled?: boolean
  variant: ThemeStyle
  name: 'name' | 'description'
  onChange: (value: string) => Promise<any>
}

export default function Field(props: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState(props.value || '')

  function onToggleEdit() {
    setIsEditing(!isEditing)
  }

  function onCancel() {
    setValue(props.value || '')
    setIsEditing(false)
  }

  async function onSave() {
    if (value === props.value) {
      setIsEditing(false)

      return
    }

    setIsLoading(true)

    await props.onChange(value)

    setIsEditing(false)
    setIsLoading(false)
  }

  function renderViewMode() {
    return (
      <Container>
        <Typography variant={props.variant}>
          {props.value ? props.value : `No ${props.name}`}
        </Typography>
        {!props.disabled && (
          <Typography
            style={{ marginLeft: '1rem' }}
            variant="subtitle2"
            color="primary"
          >
            {props.value ? 'Edit' : 'Add'}
          </Typography>
        )}
      </Container>
    )
  }

  function renderEditMode() {
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
