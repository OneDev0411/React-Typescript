import React from 'react'

import OverlayDrawer from '../../../../../../../../../views/components/OverlayDrawer'
import ActionButton from '../../../../../../../../../views/components/Button/ActionButton'

import DatePicker from '../../../../../../../../../views/components/DatePicker'
import { OverlayContainer, OverlayFooter } from './styled'

export default function DateContext(props) {
  return (
    <OverlayDrawer isOpen={props.isOpen} onClose={props.onClose} width={30}>
      <OverlayDrawer.Header title="Edit Field" />
      <OverlayDrawer.Body>
        <OverlayContainer>
          <DatePicker
            onChange={props.onContextChange}
            selectedDate={props.value || new Date(props.defaultValue * 1000)}
          />
        </OverlayContainer>
      </OverlayDrawer.Body>

      <OverlayDrawer.Footer>
        <OverlayFooter>
          <ActionButton
            disabled={props.isSaving || props.value === null}
            onClick={props.handleSave}
          >
            Save
          </ActionButton>
        </OverlayFooter>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}
