import React from 'react'
import Radio from '../../../../../../../views/components/radio'
import { Label } from './styled'

const isBackupOffer = checklist => checklist.is_deactivated === true

export const NotifyOffice = ({ id, checklist, isSelected, onChange }) => (
  <div onClick={() => !isBackupOffer(checklist) && onChange(id)}>
    <Radio
      square
      selected={isSelected}
      tooltip={
        isBackupOffer(checklist)
          ? 'You can not Notify Office for Backup offers'
          : null
      }
    />
    <Label>Notify Office</Label>
  </div>
)
