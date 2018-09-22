import React from 'react'
import moment from 'moment'

import OverlayDrawer from 'components/OverlayDrawer'
import ActionButton from 'components/Button/ActionButton'
import CancelButton from 'components/Button/CancelButton'

import DatePicker from '../../../../../../../../../views/components/DatePicker'
import DealContext from '../../../../../../../../../models/DealContext'

import { OverlayContainer, OverlayFooter } from './styled'

function onDateChange(props, value) {
  const formattedValue = moment(value).format(DealContext.getDateFormatString())

  return props.onContextChange(value, formattedValue)
}

export default function DateContext(props) {
  return (
    <OverlayDrawer isOpen={props.isOpen} onClose={props.onClose} width={37}>
      <OverlayDrawer.Header title="Edit Field" />
      <OverlayDrawer.Body>
        <OverlayContainer>
          <DatePicker
            onChange={value => onDateChange(props, value)}
            selectedDate={props.value || new Date(props.defaultValue * 1000)}
          />
        </OverlayContainer>
      </OverlayDrawer.Body>

      <OverlayDrawer.Footer>
        <OverlayFooter>
          <ActionButton
            size="small"
            disabled={props.isSaving || props.value === null}
            onClick={props.handleSave}
          >
            Save
          </ActionButton>

          <CancelButton
            size="small"
            onClick={() => props.saveDefaultValue('TBD')}
          >
            TBD
          </CancelButton>
          <CancelButton
            size="small"
            onClick={() => props.saveDefaultValue('N/A')}
          >
            N/A
          </CancelButton>
        </OverlayFooter>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}
