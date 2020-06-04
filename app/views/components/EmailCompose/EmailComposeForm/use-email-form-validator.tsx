import React, { ReactNode, useCallback } from 'react'

import { Link } from '@material-ui/core'
import { Link as RouterLink } from 'react-router'

import { useSelector } from 'react-redux'
import { flow } from 'lodash'

import { IAppState } from 'reducers/index'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { EmailFormValues } from '../types'
import { validateRecipient } from '../../EmailRecipientsChipsInput/helpers/validate-recipient'

export function useEmailFormValidator() {
  const allConnectedAccounts = useSelector(
    flow(
      (state: IAppState) => state.contacts.oAuthAccounts,
      selectAllConnectedAccounts
    )
  )

  return useCallback(
    (values: EmailFormValues) => {
      const errors: { [key in keyof EmailFormValues]?: string | ReactNode } = {}
      const { to } = values

      if (!to || to.length === 0) {
        errors.to = 'You should provide at least one recipient'
      } else {
        const recipientErrors = to.map(validateRecipient).filter(i => i)

        if (recipientErrors.length > 0) {
          errors.to = recipientErrors[0]
        }
      }

      const invalidAccountMsg = (type: string) => (
        <>
          Selected {type} account is removed or no longer connected.{' '}
          <Link
            component={RouterLink}
            target="_blank"
            to="/dashboard/account/connected-accounts"
          >
            Connected Accounts
          </Link>
          .
        </>
      )

      const accountExists = (accountId: string) =>
        allConnectedAccounts.some(account => account.id === accountId)

      if (
        values.microsoft_credential &&
        !accountExists(values.microsoft_credential)
      ) {
        errors.microsoft_credential = invalidAccountMsg('Outlook')
      }

      if (
        values.google_credential &&
        !accountExists(values.google_credential)
      ) {
        errors.google_credential = invalidAccountMsg('Google')
      }

      return errors
    },
    [allConnectedAccounts]
  )
}
