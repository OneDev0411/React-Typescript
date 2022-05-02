import { useContext } from 'react'

import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions } from '@app/utils/react-query'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import { list } from '../query-keys'
import { deleteFromCacheList } from '../query-update'

import { disconnectFacebookPage } from './disconnect-facebook-page'

interface InputData {
  brandId: UUID
  facebookPage: Pick<IFacebookPage, 'id' | 'name'>
}

export type UseDisconnectFacebookPage = Omit<
  UseMutationResult<
    void,
    ResponseError,
    InputData,
    { cache: UpdateCacheActions }
  >,
  'mutateAsync'
>

export type UseDisconnectFacebookPageOptions = Omit<
  UseMutationOptions<
    void,
    ResponseError,
    InputData,
    { cache: UpdateCacheActions }
  >,
  'notify' | 'invalidates'
>

export function useDisconnectFacebookPage(
  options?: UseDisconnectFacebookPageOptions
): UseDisconnectFacebookPage {
  const queryClient = useQueryClient()
  const confirmation = useContext(ConfirmationModalContext)
  const mutation = useMutation(
    async ({ brandId, facebookPage }) =>
      disconnectFacebookPage(brandId, facebookPage.id),
    {
      ...options,
      notify: {
        onSuccess: 'The account has been disconnected',
        onError:
          'Something went wrong while disconnecting the account. Please try again.'
      },
      invalidates: (_, { brandId }) => [list(brandId)],
      onMutate: async ({ brandId, facebookPage }) => ({
        cache: await deleteFromCacheList(queryClient, brandId, facebookPage.id)
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
    mutate: inputData => {
      confirmation.setConfirmationModal({
        message: 'Disconnect from Instagram',
        description: `Are you sure you want to disconnect your Instagram Account (${inputData.facebookPage.name}) from Rechat?
          Please note all of your scheduled posts related to this account will be canceled.`,
        confirmLabel: 'Disconnect',
        onConfirm: () => mutation.mutate(inputData)
      })
    }
  }
}
