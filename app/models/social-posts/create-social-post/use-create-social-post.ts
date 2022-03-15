import { UseMutationResult } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { list } from '../query-keys'

import { createSocialPost } from './create-social-post'

interface DataInput extends ISocialPostInput {
  brand: UUID
}

export type UseCreateSocialPost = UseMutationResult<
  ISocialPost,
  ResponseError,
  DataInput
>

export type UseCreateSocialPostOptions = Omit<
  UseMutationOptions<ISocialPost, ResponseError, DataInput>,
  'invalidates'
>

export function useCreateSocialPost(
  options?: UseCreateSocialPostOptions
): UseCreateSocialPost {
  return useMutation(async values => createSocialPost(values), {
    ...options,
    // Just invalidate the lists of campaigns because we dont know the list sort logic
    // at this stage so having an optimistic update is not easy
    invalidates: (_, values) => [list(values.brand)]
  })
}
