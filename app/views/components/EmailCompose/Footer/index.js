import React, { useState } from 'react'
import Flex from 'styled-flex-component'
import { Field } from 'react-final-form'

import ActionButton from 'components/Button/ActionButton'
import IconButton from 'components/Button/IconButton'
import TimeIcon from 'components/SvgIcons/Time/IconTime'
import Tooltip from 'components/tooltip'

import DatePicker from '../../../../components/Pages/Dashboard/Deals/components/DatePicker'

import { AddDealFile } from '../components/AddDealFile'

export function Footer(props) {
  const [isSchedulerOpen, setSchedulerOpen] = useState(true)

  return (
    <Flex justifyBetween alignCenter style={{ width: '100%' }}>
      <Flex>
        {props.hasDealsAttachments && (
          <Field
            name="attachments"
            deal={props.deal}
            initialAttachments={props.initialAttachments}
            component={AddDealFile}
          />
        )}
      </Flex>

      <div>
        <DatePicker
          show={isSchedulerOpen}
          saveText="Schedule"
          onClose={() => setSchedulerOpen(false)}
          // saveText={contexts[selectedField] ? 'Update Date' : 'Add Date'}
          // initialDate={contexts[selectedField]}
          // onSelectDate={date => this.onChangeDateContext(date)}
          containerStyle={{
            top: '-8px',
            right: '0',
            left: 'unset',
            transform: 'translateY(-100%)'
          }}
        />
        <ActionButton
          type="submit"
          disabled={props.isSubmitting}
          onClick={props.handleSubmit}
        >
          {props.isSubmitting ? 'Sending...' : 'Send'}
        </ActionButton>

        <Tooltip caption="Schedule Email">
          <IconButton
            inverse
            appearance="primary"
            onClick={() => setSchedulerOpen(!isSchedulerOpen)}
          >
            <TimeIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Flex>
  )
}
