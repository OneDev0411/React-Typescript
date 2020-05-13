import useEffectOnce from 'react-use/lib/useEffectOnce'
import { useDispatch, useSelector } from 'react-redux'

import { OAuthProvider } from 'constants/contacts'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'

export function useGetAllOauthAccounts(
  filterAccounts: (account: IOAuthAccount) => boolean
): [IOAuthAccount[], boolean] {
  const oAuthAccounts = useSelector(
    (state: IAppState) => state.contacts.oAuthAccounts
  )

  // We disable submit until connected accounts are fetched, to make sure
  // emails are sent with connected accounts in this case
  const isLoadingAccounts: boolean = Object.values(oAuthAccounts.loading).some(
    i => i !== false
  )

  const dispatch = useDispatch()
  const allAccounts: IOAuthAccount[] = selectAllConnectedAccounts(
    oAuthAccounts
  ).filter(filterAccounts)

  useEffectOnce(() => {
    Object.entries(oAuthAccounts.loading).forEach(
      ([provider, loading]: [OAuthProvider, boolean | null]) => {
        if (loading === null) {
          fetchOAuthAccounts(provider)(dispatch)
        }
      }
    )
  })

  return [allAccounts, isLoadingAccounts]
}
