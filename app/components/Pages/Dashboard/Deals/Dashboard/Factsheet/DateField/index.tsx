import { useState } from 'react'
import { Tooltip } from '@material-ui/core'
import fecha from 'fecha'
import { mdiCheck } from '@mdi/js'

import { getField } from 'models/Deal/helpers/context/get-field'

import { DateTimePicker } from 'components/DateTimePicker'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getFormattedValue } from 'models/Deal/helpers/dynamic-context'

import { isContextApproved } from '../helpers/is-context-approved'

import { EditButton } from '../ActionButtons/Edit'
import { DeleteButton } from '../ActionButtons/Delete'
import { ApproveButton } from '../ActionButtons/Approve'

import { Loading } from '../components/Loading'

import {
  Item,
  ItemLabel,
  ItemValue,
  ItemActions,
  EmptyValue,
  CircleStatus
} from '../styled'

interface Props {
  deal: IDeal
  field: IDealBrandContext
  value: unknown
  isBackOffice: boolean
  onApprove(field: IDealBrandContext): void
  onChange(field: IDealBrandContext, value: unknown): void
  onDelete(field: IDealBrandContext): void
}

export function DateField({
  deal,
  field,
  value,
  isBackOffice,
  onChange,
  onDelete,
  onApprove
}: Props) {
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const isPastDate =
    new Date().getTime() / 1000 > (getField(deal, field.key) ?? Infinity)

  const handleSave = async (date: Date): Promise<void> => {
    setIsSaving(true)

    await onChange(field, fecha.format(date, 'YYYY-MM-DD'))

    setIsSaving(false)
  }

  const handleDelete = async (): Promise<void> => {
    setIsSaving(true)

    await onDelete(field)

    setIsSaving(false)
  }

  if (isSaving) {
    return <Loading />
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
          <ItemLabel>
            <CircleStatus checked={isPastDate}>
              {isPastDate && <SvgIcon path={mdiCheck} color="#fff" />}
            </CircleStatus>{' '}
            {field.label}
          </ItemLabel>
          <ItemValue>
            {getFormattedValue(field, value) || <EmptyValue>—</EmptyValue>}
          </ItemValue>

          <ItemActions>
            <DateTimePicker
              selectedDate={getInitialDate(deal, field)}
              showTimePicker={false}
              onClose={handleSave}
              saveCaption="Save Date"
            >
              {({ handleOpen }) => <EditButton onClick={handleOpen} />}
            </DateTimePicker>

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
        context={field}
        isBackOffice={isBackOffice}
        onClick={() => onApprove(field)}
      />
    </>
  )
}

function getInitialDate(deal: IDeal, field: IDealBrandContext): Date {
  const timestamp = getField(deal, field.key)

  if (!timestamp) {
    return new Date()
  }

  const now = new Date()

  return new Date(timestamp * 1000 + now.getTimezoneOffset() * 60000)
}
