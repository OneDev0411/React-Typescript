import React from 'react'
import Flex from 'styled-flex-component'

import { Field } from 'react-final-form'

import ActionButton from 'components/Button/ActionButton'

import { AddDealFile } from '../components/AddDealFile'

export function Footer(props) {
  return (
    <Flex justifyBetween alignCenter style={{ width: '100%' }}>
      <Flex>
        <Field
          name="attachments"
          deal={props.deal}
          initialAttachments={props.initialAttachments}
          component={AddDealFile}
        />
      </Flex>

      <ActionButton
        type="submit"
        disabled={props.isSubmitting}
        onClick={props.handleSubmit}
      >
        {props.isSubmitting ? 'Sending...' : 'Send'}
      </ActionButton>
    </Flex>
  )
}
