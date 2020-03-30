import React, { useState } from 'react'

import { Tooltip, Button, createStyles, makeStyles } from '@material-ui/core'

import ClickOutside from 'react-click-outside'

import Input from 'components/Input'

import { isContextApproved } from '../helpers/is-context-approved'

import { EditButton } from '../ActionButtons/Edit'
import { DeleteButton } from '../ActionButtons/Delete'
import { ApproveButton } from '../ActionButtons/Approve'

import { Loading } from '../components/Loading'

import { ContextField } from '../types'

import {
  Editable as Container,
  Item,
  ItemLabel,
  ItemValue,
  ItemActions,
  EmptyValue
} from '../styled'

interface Props {
  deal: IDeal
  field: ContextField
  value: unknown
  isBackOffice: boolean
  onApprove(field: ContextField): void
  onChange(field: ContextField, value: unknown): void
  onDelete(field: ContextField): void
}

const useStyles = makeStyles(() =>
  createStyles({
    editable: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    }
  })
)

export function TextField({
  deal,
  field,
  value,
  isBackOffice,
  onChange,
  onDelete,
  onApprove
}: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [fieldValue, setFieldValue] = useState<unknown>(value)
  const classes = useStyles()

  const toggleEditing = () => setIsEditing(!isEditing)

  const handleCancel = () => {
    toggleEditing()
    setFieldValue(value)
  }

  const handleSave = async (): Promise<void> => {
    setIsSaving(true)

    await onChange(field, fieldValue)

    setIsSaving(false)
    setIsEditing(false)
  }

  const handleDelete = async (): Promise<void> => {
    setIsSaving(true)

    await onDelete(field)

    setIsSaving(false)
    setFieldValue(null)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.which === 13 || e.keyCode === 13) {
      handleSave()
    }
  }

  if (isSaving) {
    return <Loading />
  }

  if (isEditing) {
    return (
      <Item showBorder>
        <ClickOutside
          onClickOutside={handleCancel}
          className={classes.editable}
        >
          <Container>
            <Input
              data-type={field.format || field.data_type}
              autoFocus
              maxLength={15}
              value={fieldValue}
              placeholder={field.label}
              onKeyPress={handleKeyPress}
              onChange={(
                e: React.FormEvent<HTMLInputElement>,
                data: {
                  value?: unknown
                } = {}
              ) =>
                setFieldValue(
                  data.value != null
                    ? data.value
                    : (e.target as HTMLInputElement).value
                )
              }
              {...field.properties}
            />

            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleSave}
            >
              Save
            </Button>
          </Container>
        </ClickOutside>
      </Item>
    )
  }

  return (
    <>
      <Tooltip
        title={
          isContextApproved(deal, field) || isBackOffice
            ? ''
            : 'Pending Office Approval'
        }
      >
        <Item>
          <ItemLabel onClick={toggleEditing}>{field.label}</ItemLabel>
          <ItemValue>
            {field.getFormattedValue(value) || <EmptyValue>—</EmptyValue>}
          </ItemValue>

          <ItemActions>
            <EditButton onClick={toggleEditing} />
            <DeleteButton
              deal={deal}
              field={field}
              value={value}
              onClick={handleDelete}
            />
          </ItemActions>
        </Item>
      </Tooltip>

      <ApproveButton
        deal={deal}
        field={field}
        isBackOffice={isBackOffice}
        onClick={() => onApprove(field)}
      />
    </>
  )
}
