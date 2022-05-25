import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions } from '@app/utils/react-query'

import { updateCacheList } from '../query-update'

import { updateSocialPost, UpdateSocialPostInput } from './update-social-post'

interface DataInput {
  socialPost: Omit<ISocialPost, 'template_instance' | 'owner'>
  inputData: UpdateSocialPostInput
}

export type UseUpdateSocialPost = UseMutationResult<
  Omit<ISocialPost, 'template_instance' | 'owner'>,
  ResponseError,
  DataInput,
  { cache: UpdateCacheActions }
>

export type UseUpdateSocialPostOptions = Omit<
  UseMutationOptions<
    Omit<ISocialPost, 'template_instance' | 'owner'>,
    ResponseError,
    DataInput,
    { cache: UpdateCacheActions }
  >,
  'onMutate'
>

export function useUpdateSocialPost(
  options?: UseUpdateSocialPostOptions
): UseUpdateSocialPost {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ inputData, socialPost }) =>
      updateSocialPost(socialPost.brand, socialPost.id, inputData),
    {
      ...options,
      notify: {
        onSuccess:
          options?.notify?.onSuccess ?? 'Instagram post has been updated',
        onError:
          options?.notify?.onError ??
          'Something went wrong while saving the Instagram post. Please try again.'
      },
      onMutate: async ({ inputData, socialPost }) => ({
        cache: await updateCacheList(
          queryClient,
          socialPost.brand,
          socialPost.id,
          inputData
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
