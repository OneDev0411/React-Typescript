import React from 'react'
import { browserHistory } from 'react-router'
import Flex from 'styled-flex-component'
import styled from 'styled-components'

import ActionButton from 'components/Button/ActionButton'
import PopOver from 'components/Popover'

const PopOverImage = styled.img`
  width: 40px;
  height: 40px;
`

export default function Export() {
  return (
    <PopOver
      containerStyle={{
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)'
      }}
      popoverStyles={{ width: '250px', textAlign: 'center' }}
      caption={
        <div>
          <div>
            Take your Rechat calendar events with you. Export them to other
            calendars like Outlook, Google, iCal and more
          </div>
          <Flex style={{ marginTop: '1rem' }} justifyAround>
            <PopOverImage src="/static/images/Calendar/outlook.png" />
            <PopOverImage src="/static/images/Calendar/gcal.png" />
            <PopOverImage src="/static/images/Calendar/ical.png" />
          </Flex>
        </div>
      }
    >
      <ActionButton
        noBorder
        appearance="outline"
        onClick={() => {
          browserHistory.push('/dashboard/account/exportCalendar')
        }}
      >
        Calendar Export
      </ActionButton>
    </PopOver>
  )
}
