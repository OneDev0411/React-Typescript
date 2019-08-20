import { connect } from 'react-redux'

import * as React from 'react'

import { IAppState } from 'reducers/index'
import {
  IAttributeDefsState,
  selectDefinitionByName
} from 'reducers/contacts/attributeDefs'

import { Recipient } from './types'
import { recipientToString } from './helpers/recipient-to-string'

interface Props {
  attributeDefs: IAttributeDefsState
  recipient: Recipient
}

export const RecipientToString = connect(
  ({ contacts: { attributeDefs } }: IAppState) => ({ attributeDefs })
)(function RecipientToString({ recipient, attributeDefs }: Props) {
  return (
    <>
      {recipientToString(
        recipient,
        selectDefinitionByName(attributeDefs, 'email')!
      )}
    </>
  )
})
