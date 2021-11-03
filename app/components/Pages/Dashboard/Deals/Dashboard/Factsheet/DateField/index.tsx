import { useState } from 'react'

import { Tooltip } from '@material-ui/core'
import { mdiCheck } from '@mdi/js'
import fecha from 'fecha'
import moment from 'moment'

import { DateTimePicker } from 'components/DateTimePicker'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { getFormattedValue } from 'models/Deal/helpers/brand-context/get-formatted-value'
import { getField } from 'models/Deal/helpers/context/get-field'

import { ApproveButton } from '../ActionButtons/Approve'
import { DeleteButton } from '../ActionButtons/Delete'
import { EditButton } from '../ActionButtons/Edit'
import { Loading } from '../components/Loading'
import {
  Item,
  ItemLabel,
  ItemValue,
  ItemActions,
  CircleStatus,
  TimelineDateProgress
} from '../styled'

interface Props {
  deal: IDeal
  brandContext: IDealBrandContext
  dealContext: Nullable<IDealContext>
  index: number
  total: number
  value: unknown
  isBackOffice: boolean
  isDisabled: boolean
  tooltip: string | React.ReactChild
  onApprove(field: IDealBrandContext): void
  onChange(field: IDealBrandContext, value: unknown): void
  onDelete(field: IDealBrandContext): void
}

export function DateField({
  index,
  total,
  deal,
  brandContext,
  dealContext,
  value,
  isBackOffice,
  isDisabled,
  tooltip,
  onChange,
  onDelete,
  onApprove
}: Props) {
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const isPastDate =
    new Date().getTime() / 1000 > (getField(deal, brandContext.key) ?? Infinity)

  const handleSave = async (date: Date): Promise<void> => {
    setIsSaving(true)

    await onChange(brandContext, fecha.format(date, 'YYYY-MM-DD'))

    setIsSaving(false)
  }

  const handleDelete = async (): Promise<void> => {
    setIsSaving(true)

    await onDelete(brandContext)

    setIsSaving(false)
  }

  if (isSaving) {
    return <Loading />
  }

  return (
    <>
      <Tooltip title={tooltip}>
        <Item disableHover={isDisabled}>
          <ItemLabel>
            <CircleStatus checked={isPastDate}>
              {isPastDate && <SvgIcon path={mdiCheck} color="#fff" />}
            </CircleStatus>{' '}
            {brandContext.label}
          </ItemLabel>
          <ItemValue>{getFormattedValue(brandContext, value)}</ItemValue>

          {!isDisabled && (
            <ItemActions>
              <DateTimePicker
                selectedDate={getInitialDate(deal, brandContext)}
                showTimePicker={false}
                onClose={handleSave}
                saveCaption="Save Date"
              >
                {({ handleOpen }) => <EditButton onClick={handleOpen} />}
              </DateTimePicker>

              <DeleteButton
                deal={deal}
                brandContext={brandContext}
                value={value}
                onClick={handleDelete}
              />

              <ApproveButton
                deal={deal}
                brandContext={brandContext}
                dealContext={dealContext}
                isBackOffice={isBackOffice}
                onClick={() => onApprove(brandContext)}
              />
            </ItemActions>
          )}

          {value && index < total - 1 && isPastDate && <TimelineDateProgress />}
        </Item>
      </Tooltip>
    </>
  )
}

function getInitialDate(deal: IDeal, field: IDealBrandContext): Date {
  const timestamp = getField(deal, field.key)

  if (!timestamp) {
    return new Date()
  }

  // fix timezone issue :cry:
  return moment(moment.unix(timestamp).utc().format('MMM DD, YYYY')).toDate()
}
