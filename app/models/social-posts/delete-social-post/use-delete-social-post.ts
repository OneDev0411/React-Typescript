import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions } from '@app/utils/react-query'

import { deleteFromCacheList } from '../query-update'

import { deleteSocialPost } from './delete-social-post'

export type UseDeleteSocialPost = UseMutationResult<
  void,
  ResponseError,
  Pick<ISocialPost, 'id' | 'brand'>,
  { cache: UpdateCacheActions }
>

export type UseDeleteSocialPostOptions = Omit<
  UseMutationOptions<
    void,
    ResponseError,
    Pick<ISocialPost, 'id' | 'brand'>,
    { cache: UpdateCacheActions }
  >,
  'invalidates'
>

export function useDeleteSocialPost(
  options?: UseDeleteSocialPostOptions
): UseDeleteSocialPost {
  const queryClient = useQueryClient()

  return useMutation(
    async socialPost => deleteSocialPost(socialPost.brand, socialPost.id),
    {
      ...options,
      notify: {
        onSuccess:
          options?.notify?.onSuccess ?? 'Instagram post has been deleted.',
        onError:
          options?.notify?.onError ??
          'Something went wrong while deleting the Instagram post. Please try again.'
      },
      onMutate: async socialPost => ({
        cache: await deleteFromCacheList(
          queryClient,
          socialPost.brand,
          socialPost.id
        )
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
}
