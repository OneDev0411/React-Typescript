import { useContext } from 'react'

import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions } from '@app/utils/react-query'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import { list } from '../query-keys'
import { deleteFromCacheAllList } from '../query-update'

import { disconnectFacebookPage } from './disconnect-facebook-page'

export type UseDisconnectFacebookPage = Omit<
  UseMutationResult<
    void,
    ResponseError,
    Pick<IFacebookPage, 'id' | 'name'>,
    { cache: UpdateCacheActions }
  >,
  'mutateAsync'
>

export type UseDisconnectFacebookPageOptions = Omit<
  UseMutationOptions<
    void,
    ResponseError,
    Pick<IFacebookPage, 'id' | 'name'>,
    { cache: UpdateCacheActions }
  >,
  'notify' | 'invalidates'
>

export function useDisconnectFacebookPage(
  options?: UseDisconnectFacebookPageOptions
) {
  const queryClient = useQueryClient()
  const confirmation = useContext(ConfirmationModalContext)
  const mutation = useMutation(
    async facebookPage => disconnectFacebookPage(facebookPage.id),
    {
      ...options,
      notify: {
        onSuccess: 'The account has been disconnected',
        onError:
          'Something went wrong while disconnecting the account. Please try again.'
      },
      invalidates: [list()],
      onMutate: async facebookPage => ({
        cache: await deleteFromCacheAllList(queryClient, facebookPage.id)
      }),
      onError: (error, variables, context) => {
        context?.cache.revert()
        options?.onError?.(error, variables, context)
      },
      onSettled: (data, error, variables, context) => {
        context?.cache.invalidate()
        options?.onSettled?.(data, error, variables, context)
      }
    }
  )

  return {
    ...mutation,
    mutate: facebookPage => {
      confirmation.setConfirmationModal({
        message: 'Disconnecting your Instagram Account',
        description: `Are you sure you want to disconnect your Instagram Account (${facebookPage.name}) from Rechat?
          Please note all of your scheduled posts related to this account will be canceled.`,
        confirmLabel: 'Disconnect',
        onConfirm: () => mutation.mutate(facebookPage)
      })
    }
  }
}
