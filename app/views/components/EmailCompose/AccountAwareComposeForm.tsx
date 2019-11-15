import { OAuthProvider } from 'constants/contacts'

import * as React from 'react'

import { connect } from 'react-redux'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { IOauthAccountsState } from 'reducers/contacts/oAuthAccounts'
import { IAppState } from 'reducers/index'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'

import LoadingContainer from '../LoadingContainer'
import EmailThreadComposeForm from './EmailThreadComposeForm'
import { SingleEmailComposeForm } from './SingleEmailComposeForm'
import { EmailComposeFormProps, EmailFormValues } from './types'

interface Props<T> extends EmailComposeFormProps<T> {
  oAuthAccounts: IOauthAccountsState
  fetchOAuthAccounts: typeof fetchOAuthAccounts
}

function AccountAwareComposeForm<T>({
  oAuthAccounts,
  fetchOAuthAccounts,
  ...props
}: Props<T>) {
  useEffectOnce(() => {
    Object.entries(oAuthAccounts.loading).forEach(
      ([provider, loading]: [OAuthProvider, boolean | null]) => {
        if (loading === null) {
          fetchOAuthAccounts(provider)
        }
      }
    )
  })

  const isLoading = Object.values(oAuthAccounts.loading).some(
    loading => loading !== false /* only false, not null or true */
  )

  if (isLoading) {
    return <LoadingContainer />
  }

  const allAccounts = Object.values(oAuthAccounts.list)
    .flat()
    .filter(
      account =>
        !account.revoked && (account.scope_summary || []).includes('mail.send')
    )

  const initialValues: Partial<EmailFormValues> | undefined =
    allAccounts.length > 0
      ? {
          ...(props.initialValues || { attachments: [] }),
          from: {
            label: '',
            value: allAccounts[0].id
          }
        }
      : props.initialValues

  return allAccounts.length > 0 ? (
    <EmailThreadComposeForm {...props} initialValues={initialValues} />
  ) : (
    <SingleEmailComposeForm {...props} />
  )
}

export default connect(
  ({ contacts: { oAuthAccounts } }: IAppState) => ({
    oAuthAccounts
  }),
  { fetchOAuthAccounts }
)(AccountAwareComposeForm)
