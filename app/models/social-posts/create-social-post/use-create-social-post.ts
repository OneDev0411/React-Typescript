import { UseMutationResult } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { list } from '../query-keys'

import { createSocialPost } from './create-social-post'

export type UseCreateSocialPost = UseMutationResult<
  ISocialPost,
  ResponseError,
  ISocialPostInput
>

export type UseCreateSocialPostOptions = Omit<
  UseMutationOptions<ISocialPost, ResponseError, ISocialPostInput>,
  'invalidates'
>

export function useCreateSocialPost(
  options?: UseCreateSocialPostOptions
): UseCreateSocialPost {
  return useMutation(createSocialPost, {
    ...options,
    // Just invalidate the lists of campaigns because we dont know the list sort logic
    // at this stage so having an optimistic update is not easy
    invalidates: (_, values) => [list(values.brand)]
  })
}
