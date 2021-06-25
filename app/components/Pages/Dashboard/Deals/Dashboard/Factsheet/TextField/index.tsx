import { useState } from 'react'

import { Tooltip, Button, createStyles, makeStyles } from '@material-ui/core'
import ClickOutside from 'react-click-outside'

import Input from 'components/Input'
import { getContextInputMask } from 'deals/utils/get-context-mask'
import { getContextProperties } from 'models/Deal/helpers/brand-context/get-context-properties'
import { getFormattedValue } from 'models/Deal/helpers/brand-context/get-formatted-value'

import { EditButton } from '../ActionButtons/Edit'
import { DeleteButton } from '../ActionButtons/Delete'
import { ApproveButton } from '../ActionButtons/Approve'

import { Loading } from '../components/Loading'

import {
  Editable as Container,
  Item,
  ItemLabel,
  ItemValue,
  ItemActions
} from '../styled'

interface Props {
  deal: IDeal
  field: IDealBrandContext
  value: unknown
  isBackOffice: boolean
  isDisabled: boolean
  tooltip: string | React.ReactChild
  onApprove(field: IDealBrandContext): void
  onChange(field: IDealBrandContext, value: unknown): void
  onDelete(field: IDealBrandContext): void
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
  isDisabled,
  tooltip,
  onChange,
  onDelete,
  onApprove
}: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [fieldValue, setFieldValue] = useState<unknown>(value)
  const classes = useStyles()

  const properties = getContextProperties(field.key)

  const toggleEditing = () => {
    if (isDisabled) {
      return
    }

    setIsEditing(!isEditing)
  }

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
      <Item>
        <ClickOutside
          onClickOutside={handleCancel}
          className={classes.editable}
        >
          <Container>
            <Input
              data-type={field.format || field.data_type}
              autoFocus
              maxLength={40}
              value={fieldValue}
              mask={getContextInputMask(field)}
              placeholder={properties.placeholder || field.label}
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
      <Tooltip title={tooltip}>
        <Item disableHover={isDisabled}>
          <ItemLabel onClick={toggleEditing}>{field.label}</ItemLabel>
          <ItemValue>{getFormattedValue(field, value)}</ItemValue>

          {!isDisabled && (
            <ItemActions>
              <EditButton onClick={toggleEditing} />
              <DeleteButton
                deal={deal}
                field={field}
                value={value}
                onClick={handleDelete}
              />
              <ApproveButton
                deal={deal}
                context={field}
                isBackOffice={isBackOffice}
                onClick={() => onApprove(field)}
              />
            </ItemActions>
          )}
        </Item>
      </Tooltip>
    </>
  )
}
